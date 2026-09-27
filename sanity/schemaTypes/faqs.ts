import { defineField, defineType } from 'sanity'

/** FAQ entries shared by the research and education experiences. */
export const faqsType = defineType({
  name: 'faqs',
  title: 'FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required().min(1).error('Question is required'),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (rule) => rule.required().min(1).error('Answer is required'),
    }),
    defineField({
      name: 'for',
      title: 'For',
      type: 'string',
      options: {
        list: [
          { title: 'RND-SITE', value: 'RND-SITE' },
          { title: 'EDU-SITE', value: 'EDU-SITE' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required().error('You must select a value'),
    }),
  ],
})
