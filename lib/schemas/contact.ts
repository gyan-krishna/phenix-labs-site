import { z } from 'zod'
import { contactContent } from '@/content/contact'

/** Shared UI and validation limits for enquiry fields. */
export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 255,
  // E.164 permits at most 15 total digits across the calling and national codes.
  phone: 15,
  company: 100,
  subject: 200,
  message: 5_000,
} as const

/** Shared server/client validation contract for project enquiries. */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, contactContent.form.validation.nameMinimum)
    .max(CONTACT_FIELD_LIMITS.name, contactContent.form.validation.nameMaximum)
    .regex(/^[a-zA-Z\s'-]+$/, contactContent.form.validation.nameFormat),
  
  email: z
    .string()
    .email(contactContent.form.validation.emailFormat)
    .max(CONTACT_FIELD_LIMITS.email, contactContent.form.validation.emailMaximum),
  
  subject: z
    .string()
    .min(5, contactContent.form.validation.subjectMinimum)
    .max(CONTACT_FIELD_LIMITS.subject, contactContent.form.validation.subjectMaximum),
  
  message: z
    .string()
    .min(10, contactContent.form.validation.messageMinimum)
    .max(CONTACT_FIELD_LIMITS.message, contactContent.form.validation.messageMaximum),
  
  phone: z
    .string()
    .max(CONTACT_FIELD_LIMITS.phone, contactContent.form.validation.phoneMaximum)
    .optional()
    .refine(
      (value) => !value || /^\d{4,15}$/.test(value),
      contactContent.form.validation.phoneFormat
    ),
  
  company: z
    .string()
    .max(CONTACT_FIELD_LIMITS.company, contactContent.form.validation.companyMaximum)
    .optional(),

  subscribe: z
    .boolean(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const contactFormFieldErrors = {
  name: 'Name is required and must be valid',
  email: 'Please provide a valid email address',
  subject: 'Subject is required',
  message: 'Message is required',
  phone: 'Phone number format is invalid',
  company: 'Company name is invalid',
}
