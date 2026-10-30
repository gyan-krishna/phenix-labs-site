import { getStore } from '@netlify/blobs'
import {
  APPLICATION_ID_PATTERN,
  JOB_APPLICATION_FORM_NAME,
  JOB_APPLICATION_LIMITS,
  JOB_ID_PATTERN,
  normaliseApplicationEmail,
  normaliseApplicationPhone,
  normaliseJobText,
  isApplicationProfileUrl,
  isApplicationPdf,
} from '../../lib/jobApplications'
import { isDisposableEmail } from '../../lib/security/disposableEmailDomains'

const DEDUPE_STORE_NAME = 'career-application-dedupe'

interface EdgeContext {
  next(): Promise<Response>
}

interface PublicJobRecord {
  jobId?: string
  title?: string
  status?: string
  opensAt?: string | null
  applicationDeadline?: string | null
  resumeRequired?: boolean
  coverLetterRequired?: boolean
  applicationsEnabled?: boolean
  retentionDays?: number | null
}

interface CareerValidationResponse {
  job?: PublicJobRecord | null
  applicationsEnabled?: boolean
  defaultRetentionDays?: number
}

function reject(message: string, status: number) {
  return Response.json({ success: false, message }, { status })
}

function runtimeEnv(name: string) {
  const runtime = globalThis as typeof globalThis & {
    Netlify?: { env?: { get(key: string): string | undefined } }
    Deno?: { env?: { get(key: string): string | undefined } }
  }
  return runtime.Netlify?.env?.get(name) || runtime.Deno?.env?.get(name)
}

function getSingleString(form: FormData, field: string) {
  const values = form.getAll(field)
  return values.length === 1 && typeof values[0] === 'string' ? values[0].trim() : null
}

function isWithinWindow(job: PublicJobRecord, now: Date) {
  if (job.status !== 'open') return false
  const opensAt = job.opensAt ? new Date(job.opensAt) : null
  const deadline = job.applicationDeadline ? new Date(job.applicationDeadline) : null
  if ((opensAt && Number.isNaN(opensAt.getTime())) || (deadline && Number.isNaN(deadline.getTime()))) return false
  return (!opensAt || opensAt <= now) && (!deadline || deadline >= now)
}

async function getPublishedJob(jobId: string): Promise<CareerValidationResponse> {
  const projectId = runtimeEnv('NEXT_PUBLIC_SANITY_PROJECT_ID')
  const dataset = runtimeEnv('NEXT_PUBLIC_SANITY_DATASET') || 'production'
  const apiVersion = runtimeEnv('NEXT_PUBLIC_SANITY_API_VERSION') || '2026-02-01'
  if (!projectId) throw new Error('Sanity project configuration is unavailable.')

  const query = `{
    "job": *[_type == "jobPosting" && !(_id in path("drafts.**")) && jobId == $jobId][0]{jobId, title, status, opensAt, applicationDeadline, "resumeRequired": coalesce(resumeRequired, false), "coverLetterRequired": coalesce(coverLetterRequired, false), "applicationsEnabled": coalesce(applicationsEnabled, true), retentionDays},
    "applicationsEnabled": coalesce(*[_type == "careerSettings" && _id == "careerSettings"][0].applicationsEnabled, true),
    "defaultRetentionDays": coalesce(*[_type == "careerSettings" && _id == "careerSettings"][0].retentionDays, 180)
  }`
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', query)
  url.searchParams.set('$jobId', JSON.stringify(jobId))

  const response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(8_000) })
  if (!response.ok) throw new Error('Sanity job lookup failed.')
  const payload = await response.json() as { result?: CareerValidationResponse }
  return payload.result || {}
}

async function duplicateKey(jobId: string, email: string, phone: string) {
  const secret = runtimeEnv('APPLICATION_DEDUP_SECRET')
  if (!secret || secret.length < 32) throw new Error('Application duplicate protection is not configured.')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${jobId}:${email}:${phone}`))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Authoritative validation for multipart career applications. It intentionally
 * records only a keyed hash for duplicate prevention—never applicant PII.
 */
export default async function protectJobApplication(request: Request, context: EdgeContext) {
  if (request.method !== 'POST') return context.next()

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.startsWith('multipart/form-data')) return reject('Unsupported application format.', 415)

  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return reject('Cross-origin submissions are not accepted.', 403)

  let form: FormData
  try {
    form = await request.clone().formData()
  } catch {
    return reject('The application could not be read.', 400)
  }

  if (getSingleString(form, 'application-bot-field')) return new Response(null, { status: 204 })

  const formName = getSingleString(form, 'form-name')
  const applicationId = getSingleString(form, 'applicationId')
  const jobId = getSingleString(form, 'jobId')
  const jobTitle = getSingleString(form, 'jobTitle')
  const retentionDays = getSingleString(form, 'retentionDays')
  const name = getSingleString(form, 'name')
  const email = getSingleString(form, 'email')
  const phone = getSingleString(form, 'phone')
  const location = getSingleString(form, 'location')
  const experienceYears = getSingleString(form, 'experienceYears')
  const noticePeriodDays = getSingleString(form, 'noticePeriodDays')
  const currentCompany = getSingleString(form, 'currentCompany')
  const compensationExpectation = getSingleString(form, 'compensationExpectation')
  const linkedinUrl = getSingleString(form, 'linkedinUrl')
  const portfolioUrl = getSingleString(form, 'portfolioUrl')
  const coverLetter = getSingleString(form, 'coverLetter')
  const privacyConsent = getSingleString(form, 'privacyConsent')
  const resumeEntries = form.getAll('resume')
  const resumeEntry = resumeEntries[0]
  const resume = resumeEntry instanceof File ? resumeEntry : null

  const isValid =
    formName === JOB_APPLICATION_FORM_NAME &&
    Boolean(applicationId && APPLICATION_ID_PATTERN.test(applicationId)) &&
    Boolean(jobId && JOB_ID_PATTERN.test(jobId)) &&
    Boolean(jobTitle && jobTitle.length <= 120) &&
    Boolean(retentionDays && /^\d{2,3}$/.test(retentionDays)) &&
    Boolean(name && name.length >= 2 && name.length <= JOB_APPLICATION_LIMITS.name) &&
    Boolean(email && email.length <= JOB_APPLICATION_LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) &&
    Boolean(phone && phone.length >= 7 && phone.length <= JOB_APPLICATION_LIMITS.phone && /^[+()\d\s.-]+$/.test(phone) && normaliseApplicationPhone(phone).length >= 7 && normaliseApplicationPhone(phone).length <= 15) &&
    Boolean(location && location.length >= 2 && location.length <= JOB_APPLICATION_LIMITS.location) &&
    Boolean(experienceYears && experienceYears.length <= JOB_APPLICATION_LIMITS.experienceYears) &&
    Boolean(noticePeriodDays && /^\d{1,4}$/.test(noticePeriodDays) && Number(noticePeriodDays) <= 3650) &&
    (currentCompany?.length || 0) <= JOB_APPLICATION_LIMITS.company &&
    (compensationExpectation?.length || 0) <= JOB_APPLICATION_LIMITS.compensationExpectation &&
    (linkedinUrl?.length || 0) <= JOB_APPLICATION_LIMITS.profileUrl && isApplicationProfileUrl(linkedinUrl) &&
    (portfolioUrl?.length || 0) <= JOB_APPLICATION_LIMITS.profileUrl && isApplicationProfileUrl(portfolioUrl) &&
    (coverLetter?.length || 0) <= JOB_APPLICATION_LIMITS.coverLetter &&
    privacyConsent === 'yes' &&
    resumeEntries.length <= 1 &&
    (!resumeEntry || resumeEntry instanceof File) &&
    (!resume || resume.size > 0)

  if (!isValid) return reject('Please check the submitted application fields.', 400)
  if (resume && resume.size > JOB_APPLICATION_LIMITS.resumeBytes) return reject('Upload a PDF resume up to 5 MB.', 413)
  if (resume && !await isApplicationPdf(resume)) return reject('Please upload a complete PDF resume. The filename does not matter.', 422)

  const normalisedEmail = normaliseApplicationEmail(email!)
  const normalisedPhone = normaliseApplicationPhone(phone!)
  if (isDisposableEmail(normalisedEmail)) return reject('Please use a permanent email address.', 422)

  let career: CareerValidationResponse
  try {
    career = await getPublishedJob(jobId!)
  } catch (error) {
    console.error('[Job application] Job validation unavailable.', error)
    return reject('Applications are temporarily unavailable. Please try again shortly.', 503)
  }

  if (!career.job || !isWithinWindow(career.job, new Date())) {
    return reject('This role is no longer accepting applications.', 410)
  }
  if (!career.applicationsEnabled) {
    return reject('Applications are temporarily paused. Please check back shortly.', 503)
  }
  if (career.job.applicationsEnabled === false) {
    return reject('Applications for this role are temporarily paused. Please check back shortly.', 503)
  }
  if (normaliseJobText(career.job.jobId || '') !== jobId || normaliseJobText(career.job.title || '') !== normaliseJobText(jobTitle!)) {
    return reject('This role could not be verified. Please refresh the page and try again.', 400)
  }
  const effectiveRetentionDays = career.job.retentionDays ?? career.defaultRetentionDays ?? 180
  if (!Number.isInteger(effectiveRetentionDays) || effectiveRetentionDays < 30 || effectiveRetentionDays > 730) {
    return reject('Applications are temporarily unavailable. Please try again shortly.', 503)
  }
  if (Number(retentionDays) !== effectiveRetentionDays) {
    return reject('This role’s application policy changed. Please refresh the page and try again.', 400)
  }
  if (career.job.resumeRequired && !resume) return reject('A PDF resume is required for this role.', 400)
  if (career.job.coverLetterRequired && !coverLetter) return reject('A cover letter is required for this role.', 400)

  let store: ReturnType<typeof getStore>
  const reserved: string[] = []
  try {
    store = getStore({ name: DEDUPE_STORE_NAME, consistency: 'strong' })
    // Keep recognizing markers written by the original email+phone protocol.
    const legacyKey = `application/${await duplicateKey(jobId!, normalisedEmail, normalisedPhone)}`
    if (await store.get(legacyKey) !== null) return reject('An application for this role already exists with these contact details.', 409)
    const keys = [
      `email/${await duplicateKey(jobId!, normalisedEmail, '')}`,
      `phone/${await duplicateKey(jobId!, '', normalisedPhone)}`,
    ]
    const existing = await Promise.all(keys.map((key) => store.get(key, { type: 'json' })))
    if (existing.every((record) => record?.applicationId === applicationId && record?.accepted === true)) {
      return Response.json({ success: true })
    }
    for (const key of keys) {
      const reservation = await store.setJSON(key, { applicationId, accepted: false }, { onlyIfNew: true })
      if (!reservation.modified) {
        await Promise.all(reserved.map((ownedKey) => store.delete(ownedKey)))
        return reject('An application for this role already exists or is being processed with this email address or phone number.', 409)
      }
      reserved.push(key)
    }
  } catch (error) {
    await Promise.allSettled(reserved.map((key) => store.delete(key)))
    console.error('[Job application] Duplicate protection unavailable.', error)
    return reject('Applications are temporarily unavailable. Please try again shortly.', 503)
  }

  try {
    const response = await context.next()
    if (response.status >= 400) {
      await Promise.all(reserved.map((key) => store.delete(key)))
    } else {
      // Failure to finalize a marker must never turn a stored application into a UI failure.
      const updates = await Promise.allSettled(reserved.map((key) => store.setJSON(key, { applicationId, accepted: true })))
      if (updates.some((result) => result.status === 'rejected')) console.error('[Job application] Could not finalize duplicate markers.')
    }
    return response
  } catch (error) {
    // The downstream service may already have accepted it: preserve the reservation
    // rather than risk a second application after an ambiguous network failure.
    console.error('[Job application] Submission outcome is uncertain.', error)
    return reject('We could not confirm the submission. Please contact the careers team before submitting again.', 503)
  }
}

/** Three attempts per fifteen minutes helps control flooding without punishing normal applicants. */
export const config = {
  path: '/__job-application.html',
  onError: 'fail',
  rateLimit: {
    windowLimit: 3,
    windowSize: 900,
    aggregateBy: ['ip', 'domain'],
  },
}
