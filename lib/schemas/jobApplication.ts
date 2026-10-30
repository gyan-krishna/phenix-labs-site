import { z } from 'zod'
import { JOB_APPLICATION_LIMITS, normaliseApplicationPhone, isApplicationProfileUrl, isApplicationPdf } from '@/lib/jobApplications'

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional().or(z.literal(''))

/** Browser-side validation mirrors the Edge guard while retaining a useful form experience. */
export const jobApplicationSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(JOB_APPLICATION_LIMITS.name),
  email: z.string().trim().email('Enter a valid email address.').max(JOB_APPLICATION_LIMITS.email),
  phone: z.string().trim().min(7, 'Enter a phone number with at least 7 digits.').max(JOB_APPLICATION_LIMITS.phone).regex(/^[+()\d\s.-]+$/, 'Enter a valid phone number.').refine((value) => {
    const digits = normaliseApplicationPhone(value)
    return digits.length >= 7 && digits.length <= 15
  }, 'Enter a phone number with 7 to 15 digits.'),
  location: z.string().trim().min(2, 'Enter your current location.').max(JOB_APPLICATION_LIMITS.location),
  experienceYears: z.string().trim().min(1, 'Tell us about your experience.').max(JOB_APPLICATION_LIMITS.experienceYears),
  noticePeriodDays: z.string().trim().regex(/^\d+$/, 'Enter notice period as a whole number of days.').refine((value) => Number(value) <= 3650, 'Notice period must be 3,650 days or less.').max(JOB_APPLICATION_LIMITS.noticePeriodDays),
  currentCompany: optionalText(JOB_APPLICATION_LIMITS.company),
  compensationExpectation: optionalText(JOB_APPLICATION_LIMITS.compensationExpectation),
  linkedinUrl: optionalText(JOB_APPLICATION_LIMITS.profileUrl).refine(isApplicationProfileUrl, 'Use a full LinkedIn URL.'),
  portfolioUrl: optionalText(JOB_APPLICATION_LIMITS.profileUrl).refine(isApplicationProfileUrl, 'Use a full portfolio URL.'),
  coverLetter: optionalText(JOB_APPLICATION_LIMITS.coverLetter),
  resume: z.unknown().optional().refine(
    async (value) => !value || (typeof File !== 'undefined' && value instanceof File && await isApplicationPdf(value)),
    'Upload a complete PDF resume, up to 5 MB. The filename does not matter.',
  ),
  privacyConsent: z.boolean().refine((value) => value, 'Please confirm that you have read the applicant privacy notice.'),
})

export type JobApplicationData = z.infer<typeof jobApplicationSchema>
