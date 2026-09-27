/** Static Testimonials route and archive interface copy. */
export const testimonialsContent = {
  metadata: {
    title: 'Engineering Client Testimonials',
    description:
      'Read what clients say about collaborating with Phenix Labs on engineering, product development, and technology projects.',
    keywords: [
      'Phenix Labs reviews',
      'engineering client testimonials',
      'product development partner',
    ],
    path: '/testimonials',
    breadcrumbLabel: 'Testimonials',
    schemaTitle: 'Client Testimonials',
    schemaDescription:
      'Client experiences from engineering, product development, and technology collaborations.',
  },
  hero: {
    sectionLabel: 'Testimonials overview',
    eyebrow: 'Voices of collaboration',
    title: 'Built Together. Proven Through Experience.',
    description:
      'Every story reflects a challenge understood, a solution shaped, and a partnership carried through with care.',
  },
  archive: {
    sectionLabel: 'Client stories',
    ratingSuffix: 'out of 5 stars',
    emptyTitle: 'More client stories are coming soon',
    emptyDescription:
      'Published testimonials will appear here as soon as they are added in the admin panel.',
    showingPrefix: 'Showing',
    showingSuffix: 'client stories',
    loadMore: 'Load more stories',
    loading: 'Loading stories',
    loadError: 'More client stories could not be loaded. Please try again.',
    end: 'You’ve reached the end of the collection.',
  },
} as const
