'use client'

import { useCallback, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import {
  getExampleNumber,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/min'
import mobilePhoneExamples from 'libphonenumber-js/examples.mobile.json'
import {
  CONTACT_FIELD_LIMITS,
  contactFormSchema,
  type ContactFormData,
} from '@/lib/schemas/contact'
import { Button } from '@/components/ui/button'
import {
  ToastNotice,
  type ToastNoticeData,
} from '@/components/feedback/ToastNotice'
import {
  CountryCallingCodeSelect,
  getCountryDisplayName,
} from '@/components/forms/CountryCallingCodeSelect'
import { contactContent } from '@/content/contact'

// Must match the static blueprint so Netlify files submissions under one form.
const NETLIFY_FORM_NAME = 'project-enquiry'

// Netlify intercepts POSTs to this deployed static blueprint before serving the file.
const NETLIFY_FORM_ENDPOINT = '/__forms.html'

export interface ContactFormProps {
  submitButtonText?: string
  className?: string
  showPhone?: boolean
  showCompany?: boolean
  showSubscribe?: boolean
  idPrefix?: string
}

interface CharacterCountProps {
  current: number
  maximum: number
}

/** Compact live field counter that becomes more prominent near its limit. */
function CharacterCount({ current, maximum }: CharacterCountProps) {
  const isNearLimit = current >= maximum * 0.9

  return (
    <span
      aria-label={`${current} of ${maximum} characters used`}
      className={`text-[11px] font-semibold tabular-nums transition-colors ${
        isNearLimit ? 'text-green-500' : 'text-[#8291a1]'
      }`}
    >
      {current}/{maximum}
    </span>
  )
}

class ContactSubmissionError extends Error {}

/**
 * Reusable Contact Form component with React Hook Form and Zod validation
 * Handles client-side validation and URL-encoded Netlify Forms submission.
 */
export function ContactForm({
  submitButtonText = contactContent.form.defaultSubmitAction,
  className = '',
  showPhone = false,
  showCompany = false,
  showSubscribe = true,
  idPrefix = 'contact',
}: ContactFormProps) {
  const [notice, setNotice] = useState<ToastNoticeData | null>(null)
  // India is always the initial selection; visitors may choose another country.
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>('IN')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
      company: '',
      subscribe: false,
    },
    mode: 'onBlur',
  })
  const fieldValues = useWatch({ control })
  const dismissNotice = useCallback(() => setNotice(null), [])
  const phoneRegistration = register('phone')
  // The counter and input limit describe only the national number visible to users.
  const phoneExample = getExampleNumber(phoneCountry, mobilePhoneExamples)
  const phoneNationalLimit =
    phoneExample?.nationalNumber.length ||
    CONTACT_FIELD_LIMITS.phone - getCountryCallingCode(phoneCountry).length
  const phonePlaceholder = phoneExample?.nationalNumber || contactContent.form.placeholders.phone

  const changePhoneCountry = useCallback(
    (country: CountryCode) => {
      setPhoneCountry(country)

      // A newly selected country may use a shorter national mobile-number format.
      const countryExample = getExampleNumber(country, mobilePhoneExamples)
      const maximum =
        countryExample?.nationalNumber.length ||
        CONTACT_FIELD_LIMITS.phone - getCountryCallingCode(country).length
      const currentNumber = fieldValues.phone || ''
      if (currentNumber.length > maximum) {
        setValue('phone', currentNumber.slice(0, maximum), {
          shouldValidate: true,
        })
      }
    },
    [fieldValues.phone, setValue],
  )

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setNotice(null)

      try {
        let submittedPhone = ''

        if (data.phone) {
          const parsedPhone = parsePhoneNumberFromString(
            data.phone,
            phoneCountry,
          )

          if (!parsedPhone?.isValid()) {
            const countryName = getCountryDisplayName(phoneCountry)
            setError('phone', {
              type: 'validate',
              message: contactContent.form.phoneFieldErrorTemplate.replace('{country}', countryName),
            })
            setNotice({
              id: Date.now(),
              type: 'error',
              title: contactContent.form.phoneErrorTitle,
              message: contactContent.form.phoneErrorTemplate.replace('{country}', countryName),
            })
            return
          }

          const callingCode = getCountryCallingCode(phoneCountry)
          submittedPhone = parsedPhone.number.replace(
            `+${callingCode}`,
            `+${callingCode} `,
          )
        }

        // Netlify identifies an AJAX submission through the matching form-name field.
        const response = await fetch(NETLIFY_FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': NETLIFY_FORM_NAME,
            'bot-field': '',
            name: data.name,
            email: data.email,
            // Netlify stores one normalized value, for example "+91 8961548205".
            phone: submittedPhone,
            company: data.company || '',
            subject: data.subject,
            message: data.message,
            subscribe: data.subscribe ? 'yes' : 'no',
          }).toString(),
        })

        if (!response.ok) {
          const message =
            response.status === 429
              ? contactContent.form.rateLimitError
              : response.status === 400
                ? contactContent.form.validationError
                : contactContent.form.submissionError
          throw new ContactSubmissionError(message)
        }

        setNotice({
          id: Date.now(),
          type: 'success',
          title: contactContent.form.successTitle,
          message: contactContent.form.successMessage,
        })
        reset()
      } catch (error) {
        console.error('[ContactForm] Submission error:', error)
        setNotice({
          id: Date.now(),
          type: 'error',
          title: contactContent.form.failureTitle,
          message:
            error instanceof ContactSubmissionError
              ? error.message
              : contactContent.form.failureMessage,
        })
      }
    },
    [phoneCountry, reset, setError]
  )

  const labelClassName = 'mb-2 block text-sm font-semibold text-[#334458]'
  const fieldClassName = 'w-full rounded-[14px] border border-[#c9d5df] bg-[#f8fafc] px-4 py-3.5 text-[#162236] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-[#8a98a7] hover:border-[#aebfcd] focus:border-[#4b9ce7] focus:bg-white focus:ring-4 focus:ring-[#0064d7]/8 disabled:cursor-not-allowed disabled:opacity-60'
  const errorClassName = 'mt-1.5 text-sm text-[#c53e4a]'

  return (
    <div className={className}>
      <ToastNotice notice={notice} onDismiss={dismissNotice} duration={3_000} />

      <form
        name={NETLIFY_FORM_NAME}
        method="POST"
        acceptCharset="UTF-8"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-5 sm:grid-cols-2"
        noValidate
      >
        {/*
          `form-name` is Netlify routing metadata, not information entered by a user.
          It associates this AJAX submission with the registered project-enquiry form.
        */}
        <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />

        {/*
          The honeypot is intentionally invisible and keyboard-inaccessible. People
          leave it empty; bots that populate every field identify themselves as spam.
        */}
        <p
          aria-hidden="true"
          className="absolute size-px overflow-hidden [clip:rect(0,0,0,0)]"
        >
          <label htmlFor={`${idPrefix}-bot-field`}>
            Do not fill this field
          </label>
          <input
            id={`${idPrefix}-bot-field`}
            name="bot-field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </p>

        {/* Name Field */}
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className={`${labelClassName} flex items-center justify-between gap-3`}
          >
            <span>
              {contactContent.form.labels.name} <span className="text-red-500" aria-label={contactContent.form.labels.required}>*</span>
            </span>
            <CharacterCount
              current={fieldValues.name?.length || 0}
              maximum={CONTACT_FIELD_LIMITS.name}
            />
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            minLength={2}
            maxLength={100}
            placeholder={contactContent.form.placeholders.name}
            {...register('name')}
            className={fieldClassName}
            aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p id={`${idPrefix}-name-error`} className={errorClassName} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor={`${idPrefix}-email`}
            className={`${labelClassName} flex items-center justify-between gap-3`}
          >
            <span>
              {contactContent.form.labels.email} <span className="text-red-500" aria-label={contactContent.form.labels.required}>*</span>
            </span>
            <CharacterCount
              current={fieldValues.email?.length || 0}
              maximum={CONTACT_FIELD_LIMITS.email}
            />
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            maxLength={255}
            placeholder={contactContent.form.placeholders.email}
            {...register('email')}
            className={fieldClassName}
            aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p id={`${idPrefix}-email-error`} className={errorClassName} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Field (Optional) */}
        {showPhone && (
          <div>
            <label
              htmlFor={`${idPrefix}-phone`}
              className={`${labelClassName} flex items-center justify-between gap-3`}
            >
              <span>{contactContent.form.labels.phone}</span>
              <CharacterCount
                current={fieldValues.phone?.length || 0}
                maximum={phoneNationalLimit}
              />
            </label>
            <div className="flex min-h-13 overflow-visible rounded-[14px] border border-[#c9d5df] bg-[#f8fafc] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:border-[#aebfcd] focus-within:border-[#4b9ce7] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0064d7]/8">
              <CountryCallingCodeSelect
                value={phoneCountry}
                onChange={changePhoneCountry}
                disabled={isSubmitting}
              />
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={phoneNationalLimit}
                placeholder={phonePlaceholder}
                {...phoneRegistration}
                onChange={(event) => {
                  // Store only national digits in UI state; formatting happens on submit.
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, '')
                    .slice(0, phoneNationalLimit)
                  phoneRegistration.onChange(event)
                }}
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[#162236] outline-none placeholder:text-[#8a98a7] disabled:cursor-not-allowed disabled:opacity-60"
                aria-describedby={errors.phone ? `${idPrefix}-phone-error` : undefined}
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && (
              <p id={`${idPrefix}-phone-error`} className={errorClassName} role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        )}

        {/* Company Field (Optional) */}
        {showCompany && (
          <div>
            <label
              htmlFor={`${idPrefix}-company`}
              className={`${labelClassName} flex items-center justify-between gap-3`}
            >
              <span>{contactContent.form.labels.company}</span>
              <CharacterCount
                current={fieldValues.company?.length || 0}
                maximum={CONTACT_FIELD_LIMITS.company}
              />
            </label>
            <input
              id={`${idPrefix}-company`}
              type="text"
              maxLength={100}
              placeholder={contactContent.form.placeholders.company}
              {...register('company')}
              className={fieldClassName}
              aria-describedby={errors.company ? `${idPrefix}-company-error` : undefined}
              disabled={isSubmitting}
            />
            {errors.company && (
              <p id={`${idPrefix}-company-error`} className={errorClassName} role="alert">
                {errors.company.message}
              </p>
            )}
          </div>
        )}

        {/* Subject Field */}
        <div className="sm:col-span-2">
          <label
            htmlFor={`${idPrefix}-subject`}
            className={`${labelClassName} flex items-center justify-between gap-3`}
          >
            <span>
              {contactContent.form.labels.subject} <span className="text-red-500" aria-label={contactContent.form.labels.required}>*</span>
            </span>
            <CharacterCount
              current={fieldValues.subject?.length || 0}
              maximum={CONTACT_FIELD_LIMITS.subject}
            />
          </label>
          <input
            id={`${idPrefix}-subject`}
            type="text"
            minLength={5}
            maxLength={200}
            placeholder={contactContent.form.placeholders.subject}
            {...register('subject')}
            className={fieldClassName}
            aria-describedby={errors.subject ? `${idPrefix}-subject-error` : undefined}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p id={`${idPrefix}-subject-error`} className={errorClassName} role="alert">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="sm:col-span-2">
          <label
            htmlFor={`${idPrefix}-message`}
            className={`${labelClassName} flex items-center justify-between gap-3`}
          >
            <span>
              {contactContent.form.labels.message} <span className="text-red-500" aria-label={contactContent.form.labels.required}>*</span>
            </span>
            <CharacterCount
              current={fieldValues.message?.length || 0}
              maximum={CONTACT_FIELD_LIMITS.message}
            />
          </label>
          <textarea
            id={`${idPrefix}-message`}
            placeholder={contactContent.form.placeholders.message}
            rows={5}
            minLength={10}
            maxLength={5000}
            {...register('message')}
            className={`${fieldClassName} resize-none`}
            aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p id={`${idPrefix}-message-error`} className={errorClassName} role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Subscribe Checkbox (Optional) */}
        {showSubscribe && (
          <div className="flex items-center sm:col-span-2">
            <input
              id={`${idPrefix}-subscribe`}
              type="checkbox"
              {...register('subscribe')}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <label htmlFor={`${idPrefix}-subscribe`} className="ml-2 text-sm text-gray-700">
              {contactContent.form.labels.subscribe}
            </label>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 w-full cursor-pointer gap-2 rounded-[14px] bg-[#0064d7] px-6 text-[15px] font-bold text-white shadow-[0_14px_35px_rgba(0,100,215,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#0055b8] hover:shadow-[0_18px_42px_rgba(0,100,215,0.3)] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
              {contactContent.form.submittingAction}
            </>
          ) : (
            <>
              {submitButtonText}
              <ArrowUpRight aria-hidden="true" size={18} />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
