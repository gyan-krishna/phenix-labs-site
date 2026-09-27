import { defineArrayMember, defineField, defineType } from 'sanity'

/** Education course catalogue entry retained from the original CMS. */
export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'registerLink', title: 'Register Google Form Link', type: 'url' }),
    defineField({ name: 'smallDescription', title: 'Small Description', type: 'text' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Released', value: 'RELEASED' },
          { title: 'Coming Soon', value: 'COMING_SOON' },
          { title: 'Closed', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'banner', title: 'Banner Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'courseLogo', title: 'Course Logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'ageMin',
      title: 'Age Min',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'ageMax',
      title: 'Age Max',
      type: 'number',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (typeof value !== 'number') return true
          const ageMin = context.document?.ageMin
          return typeof ageMin !== 'number' || value > ageMin
            ? true
            : 'Age Max must be greater than Age Min.'
        }),
    }),
    defineField({
      name: 'steps',
      title: 'Steps of Course',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'courseStep',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'courseDemo',
      title: 'Course Demo',
      type: 'object',
      fields: [
        defineField({ name: 'demoTitle', title: 'Demo Title', type: 'string' }),
        defineField({ name: 'demoDescription', title: 'Demo Description', type: 'text' }),
        defineField({ name: 'demoImage', title: 'Demo Image', type: 'image', options: { hotspot: true } }),
        defineField({
          name: 'demoSteps',
          title: 'Demo Steps',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
        }),
      ],
    }),
    defineField({
      name: 'whatYouWillLearn',
      title: 'What You Will Learn',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'learningOutcome',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'courseBenefit',
          fields: [
            defineField({ name: 'text', title: 'Text', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'enrollmentProcess',
      title: 'Enrollment Process',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'cardBackgroundColor',
      title: 'Card Background Color',
      type: 'string',
      description: 'Use a valid hex code or color name',
    }),
  ],
})
