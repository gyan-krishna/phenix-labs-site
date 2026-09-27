import { defineField, defineType } from 'sanity'
import { generateCertificateId } from './certificateIds'

/** Completion certificate issued for an education course. */
export const certificateType = defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Student Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'age', title: 'Age', type: 'number', validation: (rule) => rule.required().min(1).max(120) }),
    defineField({ name: 'courseName', title: 'Course Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'spanned',
      title: 'Course Duration',
      type: 'string',
      description: "Duration of the course (e.g., '3 months', '6 weeks')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'string',
      options: {
        list: [
          { title: 'A+', value: 'A+' },
          { title: 'A', value: 'A' },
          { title: 'B+', value: 'B+' },
          { title: 'B', value: 'B' },
          { title: 'C+', value: 'C+' },
          { title: 'C', value: 'C' },
          { title: 'Pass', value: 'Pass' },
          { title: 'Excellent', value: 'Excellent' },
          { title: 'Good', value: 'Good' },
          { title: 'Satisfactory', value: 'Satisfactory' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'dateOfCompletion', title: 'Date of Completion', type: 'date', validation: (rule) => rule.required() }),
    defineField({
      name: 'certificateId',
      title: 'Certificate ID',
      type: 'string',
      readOnly: true,
      initialValue: generateCertificateId,
      validation: (rule) => rule.required().length(20),
      description:
        'Visit https://learn.phenixlabs.in/certificate-download/[CERTIFICATE-ID] to download certificate',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'courseName', media: 'certificateId' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Unnamed student',
        subtitle: `${subtitle || 'No course'} - ID: ${media || 'Pending'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Date of Completion (newest first)',
      name: 'dateOfCompletionDesc',
      by: [{ field: 'dateOfCompletion', direction: 'desc' }],
    },
    {
      title: 'Date of Completion (oldest first)',
      name: 'dateOfCompletionAsc',
      by: [{ field: 'dateOfCompletion', direction: 'asc' }],
    },
    {
      title: 'Student Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
