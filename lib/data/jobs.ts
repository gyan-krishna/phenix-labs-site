import { sanityClient } from '@/sanity/lib/client'

export type JobStatus = 'draft' | 'open' | 'closed'

export interface JobPosting {
  id: string
  jobId: string
  title: string
  department: string
  employmentType: string
  workplaceType: string
  location: string
  experienceLevel: string
  experienceYears: string
  summary: string
  description: string
  responsibilities: string[]
  requiredSkills: string[]
  preferredSkills: string[]
  benefits: string[]
  compensation: string
  applicationsEnabled: boolean
  applyLink: string
  status: JobStatus
  opensAt: string | null
  applicationDeadline: string | null
}

const jobProjection = `{
  "id": _id,
  jobId,
  title,
  department,
  employmentType,
  workplaceType,
  location,
  experienceLevel,
  "experienceYears": coalesce(experienceYears, ""),
  summary,
  description,
  "responsibilities": coalesce(responsibilities, []),
  "requiredSkills": coalesce(requiredSkills, []),
  "preferredSkills": coalesce(preferredSkills, []),
  "benefits": coalesce(benefits, []),
  "compensation": coalesce(compensation, ""),
  "applicationsEnabled": coalesce(applicationsEnabled, true),
  "applyLink": coalesce(applyLink, ""),
  status,
  opensAt,
  applicationDeadline
}`

const openJobsQuery = `*[
  _type == "jobPosting" &&
  !(_id in path("drafts.**")) &&
  status == "open" &&
  defined(jobId) &&
  defined(title) &&
  defined(summary) &&
  (!defined(opensAt) || dateTime(opensAt) <= dateTime(now())) &&
  (!defined(applicationDeadline) || dateTime(applicationDeadline) >= dateTime(now()))
] | order(coalesce(opensAt, _createdAt) desc, title asc) ${jobProjection}`

const jobByIdQuery = `*[
  _type == "jobPosting" &&
  !(_id in path("drafts.**")) &&
  jobId == $jobId &&
  defined(jobId)
][0] ${jobProjection}`

const careerSettingsQuery = `*[_type == "careerSettings" && _id == "careerSettings"][0]{
  "applicationsEnabled": coalesce(applicationsEnabled, true),
  "pageIntro": coalesce(pageIntro, "")
}`

export interface CareerSettings {
  applicationsEnabled: boolean
  pageIntro: string
}

export const DEFAULT_CAREER_SETTINGS: CareerSettings = {
  applicationsEnabled: true,
  pageIntro: '',
}

function normaliseApplyLink(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function normaliseJob(job: JobPosting | null): JobPosting | null {
  if (!job || !job.jobId || !job.title || !job.summary) return null
  return {
    ...job,
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.filter(Boolean) : [],
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.filter(Boolean) : [],
    preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills.filter(Boolean) : [],
    benefits: Array.isArray(job.benefits) ? job.benefits.filter(Boolean) : [],
    applicationsEnabled: job.applicationsEnabled !== false,
    applyLink: normaliseApplyLink(job.applyLink),
  }
}

/** Lists published roles that are open and within their configured application window. */
export async function getOpenJobs(): Promise<JobPosting[]> {
  try {
    const jobs = await sanityClient.fetch<JobPosting[]>(openJobsQuery, {}, { next: { revalidate: 60 } })
    return jobs.map(normaliseJob).filter((job): job is JobPosting => Boolean(job))
  } catch (error) {
    console.warn('[Sanity] Could not load open job postings.', error)
    return []
  }
}

/** Looks up a published role by its stable public job ID, including closed roles for reference. */
export async function getJobById(jobId: string): Promise<JobPosting | null> {
  try {
    const job = await sanityClient.fetch<JobPosting | null>(jobByIdQuery, { jobId }, { next: { revalidate: 60 } })
    return normaliseJob(job)
  } catch (error) {
    console.warn('[Sanity] Could not load job posting.', error)
    return null
  }
}

/** Returns required global defaults used when a job does not provide its own override. */
export async function getCareerSettings(): Promise<CareerSettings> {
  try {
    const settings = await sanityClient.fetch<Partial<CareerSettings> | null>(careerSettingsQuery, {}, { next: { revalidate: 60 } })
    return {
      applicationsEnabled: settings?.applicationsEnabled ?? DEFAULT_CAREER_SETTINGS.applicationsEnabled,
      pageIntro: settings?.pageIntro || '',
    }
  } catch (error) {
    console.warn('[Sanity] Could not load Careers Settings.', error)
    return { ...DEFAULT_CAREER_SETTINGS, applicationsEnabled: false }
  }
}

/** Checks only the role's own status and dates, independent of the global pause. */
export function isJobApplicationWindowOpen(job: JobPosting, now = new Date()) {
  if (job.status !== 'open') return false
  if (job.opensAt && Number.isNaN(Date.parse(job.opensAt))) return false
  if (job.applicationDeadline && Number.isNaN(Date.parse(job.applicationDeadline))) return false
  if (job.opensAt && new Date(job.opensAt) > now) return false
  if (job.applicationDeadline && new Date(job.applicationDeadline) < now) return false
  return true
}

/** Shared guard for public route rendering; the Edge function repeats this authoritatively. */
export function isAcceptingApplications(job: JobPosting, settings: CareerSettings, now = new Date()) {
  return settings.applicationsEnabled && job.applicationsEnabled && Boolean(job.applyLink) && isJobApplicationWindowOpen(job, now)
}
