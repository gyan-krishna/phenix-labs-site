import { defineField, defineType } from 'sanity'
import { generateCertificateId } from './certificateIds'

/** Free-form internal certificate record retained from the original CMS. */
export const internalCertificateType = defineType({
  name: 'internalCertificate',
  title: 'Internal Certificate',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Certificate Content',
      type: 'text',
      description: 'Complete certificate content including name, role, duration, etc.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'certificateId',
      title: 'Certificate ID',
      type: 'string',
      readOnly: true,
      initialValue: generateCertificateId,
      validation: (rule) => rule.required().length(20),
      description:
        'Visit https://phenixlabs.in/internal-certificate-download/[CERTIFICATE-ID] to download certificate',
    }),
  ],
  preview: {
    select: { title: 'content', media: 'certificateId' },
    prepare({ title, media }) {
      const content = typeof title === 'string' ? title : ''
      return {
        title: content
          ? `${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
          : 'Internal certificate',
        subtitle: `ID: ${media || 'Pending'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Certificate ID (A-Z)',
      name: 'certificateIdAsc',
      by: [{ field: 'certificateId', direction: 'asc' }],
    },
    {
      title: 'Recently Created',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
