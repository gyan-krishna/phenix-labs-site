import { defineField, defineType, type ValidationContext } from 'sanity'
import { BriefcaseBusiness } from 'lucide-react'
import { MarkdownEditorInput } from '@/sanity/components/MarkdownEditorInput'
import { apiVersion } from '@/sanity/env'

const jobStatuses = [
  { title: 'Draft', value: 'draft' },
  { title: 'Open', value: 'open' },
  { title: 'Closed', value: 'closed' },
] as const

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
const workplaceTypes = ['On-site', 'Hybrid', 'Remote']

function createJobId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(6)
  globalThis.crypto?.getRandomValues(bytes)
  return `PLJ-${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}

async function validateUniqueJobId(value: string | undefined, context: ValidationContext) {
  if (!value) return true

  const documentId = context.document?._id
  if (!documentId) return true

  const publishedId = documentId.replace(/^drafts\./, '')
  const draftId = `drafts.${publishedId}`
  const query = `count(*[_type == "jobPosting" && jobId == $jobId && !(_id in [$publishedId, $draftId])])`

  try {
    const count = await context
      .getClient({ apiVersion })
      .withConfig({ perspective: 'raw' })
      .fetch<number>(query, { jobId: value, publishedId, draftId })

    return count === 0 || 'This job ID is already in use. Create a new job posting instead.'
  } catch {
    return 'Unable to confirm that this job ID is unique. Please try again.'
  }
}

/** Job documents are public content only; applicant data is intentionally never stored in Sanity. */
export const jobPostingType = defineType({
  name: 'jobPosting',
  title: 'Job Postings',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Role basics', default: true },
    { name: 'details', title: 'Role details' },
    { name: 'application', title: 'Application link' },
    { name: 'publishing', title: 'Publishing' },
  ],
  fields: [
    defineField({
      name: 'jobId',
      title: 'Public Job ID',
      type: 'string',
      group: 'basics',
      description: 'Generated once and used in the public job URL. Do not reuse it for a reposted role.',
      initialValue: createJobId,
      readOnly: ({ document }) => Boolean(document?.jobId),
      validation: (rule) => rule.required().regex(/^PLJ-[A-Z0-9]{6}$/, { name: 'job ID' }).custom(validateUniqueJobId),
    }),
    defineField({
      name: 'title',
      title: 'Role Title',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({ name: 'department', title: 'Department', type: 'string', group: 'basics', validation: (rule) => rule.required().max(80) }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      group: 'basics',
      options: { list: employmentTypes.map((value) => ({ title: value, value })), layout: 'dropdown' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workplaceType',
      title: 'Workplace Type',
      type: 'string',
      group: 'basics',
      options: { list: workplaceTypes.map((value) => ({ title: value, value })), layout: 'dropdown' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'string', group: 'basics', validation: (rule) => rule.required().max(120) }),
    defineField({ name: 'experienceLevel', title: 'Experience Level', type: 'string', group: 'basics', validation: (rule) => rule.required().max(80) }),
    defineField({ name: 'experienceYears', title: 'Experience Range', type: 'string', group: 'basics', description: 'For example: 2–4 years.', validation: (rule) => rule.max(80) }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      group: 'details',
      validation: (rule) => rule.required().min(30).max(320),
    }),
    defineField({
      name: 'description',
      title: 'Role Description',
      type: 'text',
      rows: 18,
      group: 'details',
      components: { input: MarkdownEditorInput },
      description: 'Markdown is supported for richer role details.',
      validation: (rule) => rule.required().min(50).max(20_000),
    }),
    defineField({ name: 'responsibilities', title: 'Responsibilities', type: 'array', group: 'details', of: [{ type: 'string' }], validation: (rule) => rule.unique().max(20) }),
    defineField({ name: 'requiredSkills', title: 'Required Skills', type: 'array', group: 'details', of: [{ type: 'string' }], validation: (rule) => rule.unique().max(20) }),
    defineField({ name: 'preferredSkills', title: 'Preferred Skills', type: 'array', group: 'details', of: [{ type: 'string' }], validation: (rule) => rule.unique().max(20) }),
    defineField({ name: 'benefits', title: 'Benefits', type: 'array', group: 'details', of: [{ type: 'string' }], validation: (rule) => rule.unique().max(20) }),
    defineField({ name: 'compensation', title: 'Compensation', type: 'string', group: 'details', description: 'Optional public range or statement.', validation: (rule) => rule.max(160) }),
    defineField({
      name: 'applicationsEnabled',
      title: 'Accept Applications for This Role',
      type: 'boolean',
      group: 'application',
      description: 'Turn this off to pause this role while keeping it visible on the Careers page. The global Careers Settings switch still applies to every role.',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'applyLink',
      title: 'Apply Link',
      type: 'url',
      group: 'application',
      description: 'The Google Forms or external application URL opened by the Apply now buttons.',
      validation: (rule) => rule.uri({ scheme: ['https'] }).custom((value, context) => {
        const isActive = context.document?.status === 'open' && context.document?.applicationsEnabled !== false
        return !isActive || Boolean(value) || 'An Apply Link is required when this role is open and accepting applications.'
      }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'publishing',
      initialValue: 'draft',
      options: { list: [...jobStatuses], layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'opensAt', title: 'Opening Date', type: 'datetime', group: 'publishing', description: 'Optional. The role stays hidden until this time.' }),
    defineField({
      name: 'applicationDeadline',
      title: 'Application Deadline',
      type: 'datetime',
      group: 'publishing',
      description: 'Optional. Applications close automatically after this time.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const opensAt = context.document?.opensAt
          if (!value || !opensAt) return true
          return new Date(String(value)) >= new Date(String(opensAt)) || 'Deadline must be after the opening date.'
        }),
    }),
  ],
  orderings: [
    { title: 'Open roles first', name: 'openFirst', by: [{ field: 'status', direction: 'asc' }, { field: 'opensAt', direction: 'desc' }, { field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', jobId: 'jobId', status: 'status', applicationDeadline: 'applicationDeadline' },
    prepare({ title, jobId, status, applicationDeadline }) {
      const deadline = applicationDeadline ? ` · Closes ${new Date(applicationDeadline).toLocaleDateString()}` : ''
      return { title: title || 'Untitled role', subtitle: `${jobId || 'No job ID'} · ${status || 'draft'}${deadline}`, media: BriefcaseBusiness }
    },
  },
})
