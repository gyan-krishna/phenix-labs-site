import { getStore } from '@netlify/blobs'
import type { FormSubmittedEvent } from '@netlify/functions'
import { Resend } from 'resend'
import { APPLICATION_ID_PATTERN, JOB_APPLICATION_FORM_NAME } from '../../lib/jobApplications'

function runtimeEnv(name: string) {
  return Netlify.env.get(name) || process.env[name]
}

/** Sends one brief applicant receipt after Netlify has verified the application submission. */
const applicationReceipt = {
  async formSubmitted(event: FormSubmittedEvent) {
    const data = event.data
    // Netlify event payloads can omit routing metadata; application-specific fields
    // below still make this subscription exclusive to the careers form.
    if (data['form-name'] && data['form-name'] !== JOB_APPLICATION_FORM_NAME) return

    const applicationId = data.applicationId || ''
    const email = data.email?.trim()
    const jobTitle = data.jobTitle?.trim()
    const jobId = data.jobId?.trim()
    if (!APPLICATION_ID_PATTERN.test(applicationId) || !email || !jobTitle || !jobId) return

    const apiKey = runtimeEnv('RESEND_API_KEY')
    const from = runtimeEnv('RESEND_FROM_EMAIL')
    const replyTo = runtimeEnv('CAREERS_REPLY_TO_EMAIL')
    if (!apiKey || !from) {
      console.warn('[Job application receipt] Resend is not configured.')
      return
    }

    try {
      const store = getStore({ name: 'career-application-receipts', consistency: 'strong' })
      const receiptKey = `receipt/${applicationId}`
      if (await store.get(receiptKey) !== null) return
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from,
        to: email,
        ...(replyTo && { replyTo }),
        subject: `We received your application for ${jobTitle}`,
        // Keep the payload stable across event retries for Resend idempotency.
        text: `Thank you for applying to ${jobTitle} at Phenix Labs.\n\nJob ID: ${jobId}\n\nOur team will review your application and contact you if there is a suitable next step. This is a confirmation only; please do not send your resume by reply unless requested.`,
      }, { idempotencyKey: `job-application/${applicationId}` })
      if (error) throw new Error(error.message)
      await store.set(receiptKey, '', { onlyIfNew: true })
    } catch (error) {
      console.error('[Job application receipt] Could not send confirmation.', error)
      // Surface the event failure so it can be retried; the application is already stored.
      throw error
    }
  },
}

export default applicationReceipt
