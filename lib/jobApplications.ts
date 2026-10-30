/** Shared protocol values used by the browser form and Netlify security layer. */
export const JOB_APPLICATION_FORM_NAME = 'job-application'
export const JOB_APPLICATION_FORM_ENDPOINT = '/__job-application.html'

export const JOB_APPLICATION_LIMITS = {
  name: 100,
  email: 255,
  phone: 30,
  location: 120,
  experienceYears: 40,
  noticePeriodDays: 4,
  company: 120,
  compensationExpectation: 120,
  profileUrl: 300,
  coverLetter: 5_000,
  resumeBytes: 5 * 1024 * 1024,
} as const

export const JOB_ID_PATTERN = /^PLJ-[A-Z0-9]{6}$/
export const APPLICATION_ID_PATTERN = /^[a-z0-9-]{16,64}$/i

export function normaliseApplicationEmail(value: string) {
  return value.trim().toLowerCase()
}

/** Removes display punctuation so +91 98765-43210 and 919876543210 match. */
export function normaliseApplicationPhone(value: string) {
  return value.replace(/\D/g, '')
}

export function normaliseJobText(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isApplicationProfileUrl(value: string | null | undefined) {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password
  } catch {
    return false
  }
}

/** Inspect PDF framing, independently of the user-supplied filename or MIME type.
 * This is format validation, not malware scanning or a full PDF parser.
 */
export async function isApplicationPdf(file: Blob) {
  if (file.size === 0 || file.size > JOB_APPLICATION_LIMITS.resumeBytes) return false
  const header = await file.slice(0, 8).text()
  const tail = await file.slice(Math.max(0, file.size - 2048)).text()
  return /^%PDF-(?:1\.[0-7]|2\.0)/.test(header) && /startxref\s+\d+\s+%%EOF\s*$/.test(tail)
}
