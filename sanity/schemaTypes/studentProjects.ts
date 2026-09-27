import { defineArrayMember, defineField, defineType } from 'sanity'

/** Student project showcase entry linked to an education course. */
export const studentProjectsType = defineType({
  name: 'studentprojects',
  title: 'Student Projects',
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
    defineField({ name: 'project', title: 'Project Name', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'images',
      title: 'Project Images',
      type: 'array',
      of: [defineArrayMember({ type: 'image' })],
    }),
  ],
})
