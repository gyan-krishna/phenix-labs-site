/** Copy reused across public routes and exceptional states. */
export const sharedContent = {
  brand: {
    name: 'Phenix Labs',
    tagline: 'Ideas into reality',
    homeLabel: 'Phenix Labs home',
  },
  breadcrumbs: {
    home: 'Home',
  },
  footer: {
    navigationLabel: 'Footer navigation',
    availability: 'Available for new projects',
    title: 'Let’s make the next idea real.',
    description:
      'Tell us what you are exploring, improving, or bringing to life. We will respond with practical next steps.',
    action: 'Start a conversation',
    socialLabel: 'Follow',
    socialAriaPrefix: 'Follow Phenix Labs on',
    contactLabels: {
      phone: 'Call us',
      email: 'Email us',
      hours: 'Working hours',
      address: 'Visit us',
    },
  },
  navigation: {
    primaryLabel: 'Primary navigation',
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu',
    sectionsLabel: 'Page sections',
    sectionsTitle: 'On this page',
    openSectionsLabel: 'Navigate page sections',
    closeSectionsLabel: 'Close section navigation',
    backToTopLabel: 'Back to top',
  },
  feedback: {
    dismissLabel: 'Dismiss notification',
  },
  socialPreview: {
    alt: 'Phenix Labs — Engineering ideas into reality',
    brand: 'PHENIX LABS',
    title: 'Engineering ideas into reality.',
    capabilities:
      'PCB · Embedded Systems · Edge AI · Prototyping · Product Development',
  },
  statusPages: {
    notFound: {
      code: '404',
      eyebrow: 'Route not found',
      title: 'This path leads beyond the map.',
      description:
        'The page may have moved, the address may be incomplete, or the content may no longer be available. Continue from a known part of Phenix Labs.',
      primaryAction: 'Return home',
      secondaryAction: 'Explore products',
    },
    error: {
      code: '500',
      eyebrow: 'System interruption',
      title: 'Something interrupted the process.',
      description:
        'The page could not finish loading. Retry the operation first; if the issue continues, return home and begin again from a stable route.',
      retryAction: 'Try again',
      homeAction: 'Return home',
    },
  },
} as const
