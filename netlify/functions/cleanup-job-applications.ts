import type { Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const FORM_NAME = 'job-application'
const PAGE_SIZE = 100
const RUN_BUDGET_MS = 20_000

interface NetlifyForm { id: string; name: string }
interface NetlifySubmission {
  id: string
  created_at: string
  data?: Record<string, string>
}

function runtimeEnv(name: string) {
  return Netlify.env.get(name) || process.env[name]
}

async function netlifyRequest(path: string, init?: RequestInit) {
  const token = runtimeEnv('NETLIFY_ACCESS_TOKEN')
  if (!token) throw new Error('NETLIFY_ACCESS_TOKEN is not configured.')
  const response = await fetch(`https://api.netlify.com/api/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...init?.headers },
    signal: AbortSignal.timeout(4_000),
  })
  if (!response.ok) throw new Error(`Netlify API request failed (${response.status}).`)
  return response
}

async function listSubmissions(formId: string, page: number, state: string) {
  const query = new URLSearchParams({ page: String(page), per_page: String(PAGE_SIZE) })
  if (state === 'spam') query.set('state', state)
  const response = await netlifyRequest(`/forms/${formId}/submissions?${query}`)
  return await response.json() as NetlifySubmission[]
}

async function deleteInBatches(ids: string[], deadline: number) {
  let deleted = 0
  for (let index = 0; index < ids.length; index += 10) {
    if (Date.now() >= deadline) return { deleted, complete: false }
    const batch = ids.slice(index, index + 10)
    const outcomes = await Promise.allSettled(batch.map(async (id) => {
      await netlifyRequest(`/submissions/${id}`, { method: 'DELETE' })
    }))
    deleted += outcomes.filter((outcome) => outcome.status === 'fulfilled').length
    if (outcomes.some((outcome) => outcome.status === 'rejected')) {
      throw new Error('One or more expired applications could not be deleted; cleanup will retry this page.')
    }
  }
  return { deleted, complete: true }
}

function getSubmissionRetentionDays(submission: NetlifySubmission) {
  // This is a snapshot from the accepted form, so an editor changing a role later
  // cannot silently alter the retention promise made to an earlier applicant.
  const value = Number(submission.data?.retentionDays)
  return Number.isInteger(value) && value >= 30 && value <= 730 ? value : 180
}

/** Daily retention cleanup; dedupe hashes intentionally remain untouched for the job ID lifetime. */
export default async function cleanupJobApplications() {
  const startedAt = Date.now()
  const dryRun = runtimeEnv('APPLICATION_CLEANUP_DRY_RUN') === 'true'
  const siteId = runtimeEnv('NETLIFY_SITE_ID')
  if (!siteId) throw new Error('NETLIFY_SITE_ID is not configured.')

  const formsResponse = await netlifyRequest(`/sites/${siteId}/forms`)
  const forms = await formsResponse.json() as NetlifyForm[]
  const form = forms.find((candidate) => candidate.name === FORM_NAME)
  if (!form) {
    console.info('[Job application cleanup] Form is not deployed yet.')
    return new Response(null, { status: 204 })
  }

  // Only pagination state is stored here, never applicant information.
  const store = getStore({ name: 'career-application-cleanup', consistency: 'strong' })
  let deleted = 0
  let eligible = 0
  for (const state of ['verified', 'spam']) {
    const deadline = Math.min(startedAt + RUN_BUDGET_MS, Date.now() + RUN_BUDGET_MS / 2)
    const cursorKey = `${form.id}/${state}`
    const saved = dryRun ? null : await store.get(cursorKey, { type: 'json' })
    let page = Number.isInteger(saved?.page) && saved.page >= 1 ? saved.page : 1
    while (Date.now() < deadline) {
      const submissions = await listSubmissions(form.id, page, state)
      const expiredIds = [...new Set(submissions.filter((submission) => {
        const createdAt = new Date(submission.created_at).getTime()
        const cutoff = Date.now() - getSubmissionRetentionDays(submission) * 86_400_000
        return Number.isFinite(createdAt) && createdAt < cutoff
      }).map((submission) => submission.id))]
      eligible += expiredIds.length
      // Persist the current page before deletion so failures/crashes retry it.
      if (!dryRun) await store.setJSON(cursorKey, { page })
      if (!dryRun && expiredIds.length) {
        const result = await deleteInBatches(expiredIds, deadline)
        deleted += result.deleted
        if (!result.complete) break
        // Deletes shift subsequent records forward. Re-read this page to avoid skips.
        continue
      }
      if (submissions.length < PAGE_SIZE) {
        if (!dryRun) await store.setJSON(cursorKey, { page: 1 })
        break
      }
      page += 1
      if (!dryRun) await store.setJSON(cursorKey, { page })
    }
  }
  console.info(`[Job application cleanup] ${dryRun ? 'Dry run: eligible' : 'Deleted'} ${dryRun ? eligible : deleted} applications. Incomplete scans resume next run.`)
  return new Response(null, { status: 204 })
}

export const config: Config = { schedule: '@daily' }
