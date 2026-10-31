'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { BriefcaseBusiness, ContactRound, FileText } from 'lucide-react'
import { dataset, projectId, studioUrl } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { RecreateSingletonAction } from './sanity/actions/RecreateSingletonAction'

const singletonTypes = new Set(['aboutPage', 'contactSettings', 'careerSettings'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

/** Studio configuration, navigation structure, schemas, and singleton safeguards. */
export default defineConfig({
  name: 'phenixLabs',
  title: 'Phenix Labs Admin Panel',
  basePath: studioUrl,
  projectId,
  dataset,
  plugins: [
    structureTool({
      // Pin singleton documents to canonical ids and list collection documents below them.
      structure: (structure) =>
        structure
          .list()
          .title('Content')
          .items([
            structure
              .listItem()
              .title('About Page')
              .icon(FileText)
              .child(
                structure
                  .document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage'),
              ),
            structure
              .listItem()
              .title('Contact & Social')
              .icon(ContactRound)
              .child(
                structure
                  .document()
                  .schemaType('contactSettings')
                  .documentId('contactSettings'),
              ),
            structure
              .listItem()
              .title('Careers Settings')
              .icon(BriefcaseBusiness)
              .child(
                structure
                  .document()
                  .schemaType('careerSettings')
                  .documentId('careerSettings'),
              ),
            structure.divider(),
            ...structure
              .documentTypeListItems()
              .filter(
                (item) =>
                  item.getId() !== 'aboutPage' &&
                  item.getId() !== 'contactSettings' &&
                  item.getId() !== 'careerSettings',
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previousActions, context) => {
      // Singletons cannot be duplicated or deleted through standard document actions.
      if (!singletonTypes.has(context.schemaType)) return previousActions

      const actions = previousActions.filter((action) =>
        singletonActions.has(action.action ?? ''),
      )

      return [...actions, RecreateSingletonAction]
    },
    newDocumentOptions: (previousOptions) =>
      // Hide singleton templates from the global "new document" menu.
      previousOptions.filter(
        (option) =>
          option.templateId !== 'aboutPage' &&
          option.templateId !== 'contactSettings' &&
          option.templateId !== 'careerSettings',
      ),
  },
})
