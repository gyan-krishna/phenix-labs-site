import { defineField, defineType } from 'sanity'

/** Student review linked to an education course. */
export const studentReviewType = defineType({
  name: 'studentreviews',
  title: 'Student Reviews',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Student Name', type: 'string' }),
    defineField({
      title: 'Course',
      name: 'course',
      type: 'reference',
      weak: true,
      to: [{ type: 'course' }],
    }),
    defineField({ name: 'review', title: 'Review', type: 'text' }),
    defineField({
      name: 'stars',
      title: 'Stars',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
      description: 'Value must be within 1–5',
    }),
  ],
})
