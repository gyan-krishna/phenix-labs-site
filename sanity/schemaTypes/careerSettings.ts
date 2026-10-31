import { defineField, defineType } from 'sanity'

/** Global controls for the public Careers page. */
export const careerSettingsType = defineType({
  name: 'careerSettings',
  title: 'Careers Settings',
  type: 'document',
  initialValue: {
    applicationsEnabled: true,
  },
  fields: [
    defineField({
      name: 'applicationsEnabled',
      title: 'Accept Applications Globally',
      type: 'boolean',
      description: 'Turn this off to pause all job applications without hiding published roles.',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageIntro',
      title: 'Careers Intro',
      type: 'text',
      rows: 3,
      description: 'Optional supporting text shown above open roles.',
      validation: (rule) => rule.max(320),
    }),
  ],
  preview: {
    select: { applicationsEnabled: 'applicationsEnabled' },
    prepare({ applicationsEnabled }) {
      return {
        title: 'Careers Settings',
        subtitle: applicationsEnabled === false ? 'Applications paused' : 'Applications enabled',
      }
    },
  },
})
