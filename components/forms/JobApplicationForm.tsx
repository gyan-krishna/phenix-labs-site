'use client'

import { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, FileText, LoaderCircle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastNotice, type ToastNoticeData } from '@/components/feedback/ToastNotice'
import { isDisposableEmail } from '@/lib/security/disposableEmailDomains'
import {
  JOB_APPLICATION_FORM_ENDPOINT,
  JOB_APPLICATION_FORM_NAME,
  JOB_APPLICATION_LIMITS,
  normaliseApplicationEmail,
} from '@/lib/jobApplications'
import { jobApplicationSchema, type JobApplicationData } from '@/lib/schemas/jobApplication'

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  resumeRequired: boolean
  coverLetterRequired: boolean
  retentionDays: number
  privacyContactEmail: string
}

class JobApplicationSubmissionError extends Error {}

function createApplicationId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`
}

/** Client-side form island; the Netlify Edge guard remains the authoritative validation layer. */
export function JobApplicationForm({
  jobId,
  jobTitle,
  resumeRequired,
  coverLetterRequired,
  retentionDays,
  privacyContactEmail,
}: JobApplicationFormProps) {
  const [notice, setNotice] = useState<ToastNoticeData | null>(null)
  const [formKey, setFormKey] = useState(0)
  const applicationIdRef = useRef<string | null>(null)
  const honeypotRef = useRef<HTMLInputElement | null>(null)
  const [resumeName, setResumeName] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    setValue,
  } = useForm<JobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      name: '', email: '', phone: '', location: '', experienceYears: '', noticePeriodDays: '',
      currentCompany: '', compensationExpectation: '', linkedinUrl: '', portfolioUrl: '',
      coverLetter: '', resume: undefined, privacyConsent: false,
    },
    mode: 'onBlur',
  })

  const dismissNotice = useCallback(() => setNotice(null), [])
  const resumeRegistration = register('resume')

  const onSubmit = useCallback(async (data: JobApplicationData) => {
    setNotice(null)

    if (isDisposableEmail(data.email)) {
      const message = 'Please use a permanent email address rather than a temporary email service.'
      setError('email', { type: 'validate', message })
      setNotice({ id: Date.now(), type: 'error', title: 'Use a permanent email', message })
      return
    }

    if (resumeRequired && !data.resume) {
      setError('resume', { type: 'required', message: 'Please attach your PDF resume for this role.' })
      return
    }
    if (coverLetterRequired && !data.coverLetter?.trim()) {
      setError('coverLetter', { type: 'required', message: 'A cover letter is required for this role.' })
      return
    }

    const body = new FormData()
    body.append('form-name', JOB_APPLICATION_FORM_NAME)
    body.append('application-bot-field', honeypotRef.current?.value || '')
    applicationIdRef.current ||= createApplicationId()
    body.append('applicationId', applicationIdRef.current)
    body.append('jobId', jobId)
    body.append('jobTitle', jobTitle)
    body.append('retentionDays', String(retentionDays))
    body.append('name', data.name.trim())
    body.append('email', normaliseApplicationEmail(data.email))
    body.append('phone', data.phone.trim())
    body.append('location', data.location.trim())
    body.append('experienceYears', data.experienceYears.trim())
    body.append('noticePeriodDays', data.noticePeriodDays.trim())
    body.append('currentCompany', data.currentCompany?.trim() || '')
    body.append('compensationExpectation', data.compensationExpectation?.trim() || '')
    body.append('linkedinUrl', data.linkedinUrl?.trim() || '')
    body.append('portfolioUrl', data.portfolioUrl?.trim() || '')
    body.append('coverLetter', data.coverLetter?.trim() || '')
    body.append('privacyConsent', 'yes')
    if (data.resume instanceof File) {
      body.append('resume', new File([data.resume], `resume-${applicationIdRef.current}.pdf`, { type: 'application/pdf' }))
    }

    try {
      const response = await fetch(JOB_APPLICATION_FORM_ENDPOINT, { method: 'POST', body })
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { message?: string } | null
        const fallback = response.status === 409
          ? 'An application for this role already exists with this email address or phone number.'
          : response.status === 410
            ? 'This role is no longer accepting applications.'
            : response.status === 422
              ? 'Please use a permanent email address and review your application details.'
              : response.status === 429
                ? 'Too many application attempts were made recently. Please wait and try again.'
                : response.status === 413
                  ? 'Your resume is too large. Please upload a PDF smaller than 5 MB.'
                  : 'Your application could not be submitted. Please try again shortly.'
        throw new JobApplicationSubmissionError(payload?.message || fallback)
      }

      reset()
      applicationIdRef.current = null
      setResumeName('')
      setFormKey((value) => value + 1)
      setNotice({
        id: Date.now(),
        type: 'success',
        title: 'Application received',
        message: `Thanks for applying to ${jobTitle}. Our team will review your application and contact you if there is a suitable next step.`,
      })
    } catch (error) {
      console.error('[JobApplicationForm] Submission error:', error)
      setNotice({
        id: Date.now(),
        type: 'error',
        title: 'Application not submitted',
        message: error instanceof JobApplicationSubmissionError ? error.message : 'Please try again shortly.',
      })
    }
  }, [coverLetterRequired, jobId, jobTitle, reset, resumeRequired, retentionDays, setError])

  const labelClassName = 'mb-2 block text-sm font-semibold text-[#334458]'
  const fieldClassName = 'w-full rounded-[14px] border border-[#c9d5df] bg-[#f8fafc] px-4 py-3.5 text-[#162236] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-[#8a98a7] hover:border-[#aebfcd] focus:border-[#4b9ce7] focus:bg-white focus:ring-4 focus:ring-[#0064d7]/8 disabled:cursor-not-allowed disabled:opacity-60'
  const errorClassName = 'mt-1.5 text-sm text-[#c53e4a]'
  const required = <span className="text-red-500" aria-label="required">*</span>

  const fieldError = (name: keyof typeof errors, id: string) =>
    errors[name] ? <p id={`${id}-error`} className={errorClassName} role="alert">{errors[name]?.message as string}</p> : null

  return (
    <div>
      <ToastNotice notice={notice} onDismiss={dismissNotice} duration={5_000} />
      <form
        key={formKey}
        name={JOB_APPLICATION_FORM_NAME}
        method="POST"
        encType="multipart/form-data"
        data-netlify="true"
        data-netlify-honeypot="application-bot-field"
        onSubmit={(event) => { void handleSubmit(onSubmit)(event) }}
        className="grid gap-5 sm:grid-cols-2"
        noValidate
      >
        <input type="hidden" name="form-name" value={JOB_APPLICATION_FORM_NAME} />
        <p aria-hidden="true" className="absolute size-px overflow-hidden [clip:rect(0,0,0,0)]">
          <label htmlFor="application-bot-field">Do not fill this field</label>
          <input ref={honeypotRef} id="application-bot-field" name="application-bot-field" type="text" tabIndex={-1} autoComplete="off" />
        </p>

        <div>
          <label htmlFor="application-name" className={labelClassName}>Full name {required}</label>
          <input id="application-name" autoComplete="name" maxLength={JOB_APPLICATION_LIMITS.name} {...register('name')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.name ? 'application-name-error' : undefined} />
          {fieldError('name', 'application-name')}
        </div>
        <div>
          <label htmlFor="application-email" className={labelClassName}>Email address {required}</label>
          <input id="application-email" type="email" autoComplete="email" maxLength={JOB_APPLICATION_LIMITS.email} {...register('email')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.email ? 'application-email-error' : undefined} />
          {fieldError('email', 'application-email')}
        </div>
        <div>
          <label htmlFor="application-phone" className={labelClassName}>Phone number {required}</label>
          <input id="application-phone" type="tel" autoComplete="tel" maxLength={JOB_APPLICATION_LIMITS.phone} {...register('phone')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.phone ? 'application-phone-error' : undefined} />
          {fieldError('phone', 'application-phone')}
        </div>
        <div>
          <label htmlFor="application-location" className={labelClassName}>Current location {required}</label>
          <input id="application-location" autoComplete="address-level2" maxLength={JOB_APPLICATION_LIMITS.location} placeholder="City, country" {...register('location')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.location ? 'application-location-error' : undefined} />
          {fieldError('location', 'application-location')}
        </div>
        <div>
          <label htmlFor="application-experience" className={labelClassName}>Years of experience {required}</label>
          <input id="application-experience" maxLength={JOB_APPLICATION_LIMITS.experienceYears} placeholder="For example, 3 years" {...register('experienceYears')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.experienceYears ? 'application-experience-error' : undefined} />
          {fieldError('experienceYears', 'application-experience')}
        </div>
        <div>
          <label htmlFor="application-notice" className={labelClassName}>Notice period (days) {required}</label>
          <input id="application-notice" type="number" min="0" max="3650" step="1" inputMode="numeric" placeholder="For example, 30" {...register('noticePeriodDays')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.noticePeriodDays ? 'application-notice-error' : undefined} />
          {fieldError('noticePeriodDays', 'application-notice')}
        </div>
        <div>
          <label htmlFor="application-company" className={labelClassName}>Current company <span className="font-normal text-[#8291a1]">(optional)</span></label>
          <input id="application-company" maxLength={JOB_APPLICATION_LIMITS.company} {...register('currentCompany')} className={fieldClassName} disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="application-compensation" className={labelClassName}>Compensation expectation <span className="font-normal text-[#8291a1]">(optional)</span></label>
          <input id="application-compensation" maxLength={JOB_APPLICATION_LIMITS.compensationExpectation} {...register('compensationExpectation')} className={fieldClassName} disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="application-linkedin" className={labelClassName}>LinkedIn URL <span className="font-normal text-[#8291a1]">(optional)</span></label>
          <input id="application-linkedin" type="url" inputMode="url" maxLength={JOB_APPLICATION_LIMITS.profileUrl} placeholder="https://linkedin.com/in/..." {...register('linkedinUrl')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.linkedinUrl ? 'application-linkedin-error' : undefined} />
          {fieldError('linkedinUrl', 'application-linkedin')}
        </div>
        <div>
          <label htmlFor="application-portfolio" className={labelClassName}>Portfolio URL <span className="font-normal text-[#8291a1]">(optional)</span></label>
          <input id="application-portfolio" type="url" inputMode="url" maxLength={JOB_APPLICATION_LIMITS.profileUrl} placeholder="https://yourportfolio.com" {...register('portfolioUrl')} className={fieldClassName} disabled={isSubmitting} aria-describedby={errors.portfolioUrl ? 'application-portfolio-error' : undefined} />
          {fieldError('portfolioUrl', 'application-portfolio')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="application-cover-letter" className={labelClassName}>Cover letter {coverLetterRequired ? required : <span className="font-normal text-[#8291a1]">(optional)</span>}</label>
          <textarea id="application-cover-letter" rows={6} maxLength={JOB_APPLICATION_LIMITS.coverLetter} placeholder="Share the experience or perspective you would bring to this role." {...register('coverLetter')} className={`${fieldClassName} resize-none`} disabled={isSubmitting} aria-describedby={errors.coverLetter ? 'application-cover-letter-error' : undefined} />
          {fieldError('coverLetter', 'application-cover-letter')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="application-resume" className={labelClassName}>Resume (PDF, max 5 MB) {resumeRequired ? required : <span className="font-normal text-[#8291a1]">(optional)</span>}</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-[#aebfcd] bg-[#f8fafc] p-4 text-sm text-[#526071] transition hover:border-[#4b9ce7] hover:bg-white">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#e7f2ff] text-[#0064d7]"><Upload aria-hidden="true" size={18} /></span>
            <span><span className="font-semibold text-[#26374a]">{resumeName || 'Choose a PDF'}</span><span className="mt-0.5 block text-xs text-[#8291a1]">Any filename is fine. One PDF only, up to 5 MB.</span></span>
            <FileText aria-hidden="true" size={18} className="ml-auto text-[#8291a1]" />
            <input
              id="application-resume"
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              {...resumeRegistration}
              onChange={(event) => {
                resumeRegistration.onChange(event)
                const file = event.target.files?.[0]
                setResumeName(file?.name || '')
                setValue('resume', file, { shouldValidate: true })
              }}
              disabled={isSubmitting}
            />
          </label>
          {fieldError('resume', 'application-resume')}
        </div>
        <div className="sm:col-span-2">
          <label className="flex gap-3 rounded-[14px] border border-[#d8e1e8] bg-[#f8fafc] p-4 text-sm leading-6 text-[#536476]">
            <input type="checkbox" {...register('privacyConsent')} className="mt-1 size-4 shrink-0 rounded border-[#aebfcd] accent-[#0064d7]" disabled={isSubmitting} />
            <span>I have read the <a href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#0064d7] underline underline-offset-2">applicant privacy notice</a> and consent to Phenix Labs using my application information for this role. Applications are retained for up to {retentionDays} days. For privacy requests, contact <a href={`mailto:${privacyContactEmail}`} className="font-semibold text-[#0064d7] underline underline-offset-2">{privacyContactEmail}</a>.</span>
          </label>
          {fieldError('privacyConsent', 'application-privacy-consent')}
        </div>
        <Button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer gap-2 rounded-[14px] bg-[#0064d7] px-6 text-[15px] font-bold text-white shadow-[0_14px_35px_rgba(0,100,215,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#0055b8] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2" aria-busy={isSubmitting}>
          {isSubmitting ? <><LoaderCircle aria-hidden="true" className="animate-spin" size={18} />Submitting application</> : <>Submit application <ArrowUpRight aria-hidden="true" size={18} /></>}
        </Button>
      </form>
    </div>
  )
}
