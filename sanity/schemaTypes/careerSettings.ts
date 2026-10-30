import { defineField, defineType } from 'sanity'

/** Global defaults for careers; a role can explicitly override retention. */
export const careerSettingsType = defineType({
  name: 'careerSettings',
  title: 'Careers Settings',
  type: 'document',
  initialValue: {
    applicationsEnabled: true,
    retentionDays: 180,
    privacyContactEmail: 'gyankrishna@phenixlabs.in',
  },
  groups: [
    { name: 'public', title: 'Public careers page', default: true },
    { name: 'privacy', title: 'Application defaults' },
  ],
  fields: [
    defineField({
      name: 'applicationsEnabled',
      title: 'Accept Applications Globally',
      type: 'boolean',
      group: 'public',
      description: 'Turn this off to pause all job applications without hiding published roles.',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageIntro',
      title: 'Careers Intro',
      type: 'text',
      rows: 3,
      group: 'public',
      description: 'Optional supporting text shown above open roles.',
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: 'privacyContactEmail',
      title: 'Default Applicant Privacy Contact Email',
      type: 'string',
      group: 'privacy',
      description: 'Required contact for applicant data requests across all roles.',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'retentionDays',
      title: 'Default Application Retention (Days)',
      type: 'number',
      group: 'privacy',
      description: 'Required default. A job-level retention value takes priority when present.',
      initialValue: 180,
      validation: (rule) => rule.required().integer().min(30).max(730),
    }),
  ],
  preview: {
    select: { applicationsEnabled: 'applicationsEnabled', retentionDays: 'retentionDays', privacyContactEmail: 'privacyContactEmail' },
    prepare({ applicationsEnabled, retentionDays, privacyContactEmail }) {
      return {
        title: 'Careers Settings',
        subtitle: `${applicationsEnabled === false ? 'Applications paused' : 'Applications enabled'} · ${retentionDays || 180} day default · ${privacyContactEmail || 'No privacy email'}`,
      }
    },
  },
})
