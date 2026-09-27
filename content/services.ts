/** Static Services page copy and ordered process/market content. */
export const servicesContent = {
  metadata: {
    title: 'PCB, Firmware, Edge AI & Prototyping Services',
    description:
      'Explore Phenix Labs engineering services for PCB design, firmware, embedded systems, Edge AI, prototyping, testing, CAD, and product development.',
    keywords: [
      'engineering solutions',
      'custom electronics',
      'embedded systems',
      'research partnerships',
      'industrial solutions',
    ],
    path: '/services',
    breadcrumbLabel: 'Services',
    schemaTitle: 'Engineering Services',
    schemaDescription:
      'PCB, firmware, embedded systems, Edge AI, prototyping, testing, and product development services.',
  },
  hero: {
    sectionLabel: 'Services overview',
    eyebrow: 'Engineering partnerships',
    title: 'Engineering solutions built for the',
    highlightedTitle: 'real world.',
    description:
      'Phenix Labs partners with industries, research organizations, and academic institutions to transform ideas into reliable engineering solutions. From custom electronics and embedded systems to rapid prototyping and product development, we provide end-to-end support from concept to deployment.',
    primaryAction: 'Discuss your project',
    secondaryAction: 'See our process',
    imageAlt: 'Engineering system blueprint',
    imageEyebrow: 'System architecture',
    imageStatus: 'Ready to build',
  },
  audiences: {
    sectionLabel: 'Who we serve',
    eyebrow: 'Where we help',
    title: 'Built for research and industry',
    description:
      'The same end-to-end engineering discipline, adapted to the different realities of laboratories, institutions, and production environments.',
    benefitLabel: 'Why Phenix Labs',
    items: [
      {
        key: 'academic',
        title: 'Academic & Research',
        number: '01',
        description:
          'Accelerating research through custom instrumentation, rapid prototyping, and collaborative engineering.',
        accent: '#ff895d',
        benefits: [
          'Research-focused engineering',
          'Rapid prototype development',
          'Iterative development with researcher feedback',
          'Interdisciplinary expertise',
          'Laboratory to real-world deployment',
        ],
        tags: ['Research Instrumentation', 'Embedded Systems', 'AI & Edge Computing'],
      },
      {
        key: 'industrial',
        title: 'Industrial',
        number: '02',
        description:
          'Building reliable and scalable engineering solutions for automation, manufacturing, and industrial applications.',
        accent: '#ffc85d',
        benefits: [
          'Industry-ready solutions',
          'Rapid prototyping to production',
          'End-to-end product development',
          'Innovation-driven engineering',
          'Design for manufacturing (DFM)',
        ],
        tags: ['Instrumentation & Control', 'Industrial IoT', 'Robotics'],
      },
    ],
  },
  process: {
    sectionLabel: 'Development process',
    eyebrow: 'From idea to deployment',
    title: 'Our Development Process',
    description:
      'A clear engineering path with room to learn, test, and refine before a solution reaches the real world.',
    stageCount: '6 connected stages',
    routeLabel: 'Phenix development route',
    routeStatus: 'Concept to deployment',
    centerEyebrow: 'One connected journey',
    centerTitle: 'From concept to',
    centerHighlight: 'reality.',
    centerDescription:
      'Every stage informs the next, creating one clear route from idea to deployment.',
    steps: [
      { key: 'consultation', number: '01', shortTitle: 'Concept', title: 'Consultation', copy: 'Initial idea, define requirement, scope and feasibility.', accent: '#58a7ff' },
      { key: 'concept', number: '02', shortTitle: 'Strategy', title: 'Concept Development', copy: 'Feasibility analysis and architecture planning.', accent: '#45c9e8' },
      { key: 'design', number: '03', shortTitle: 'Creation', title: 'Design', copy: 'Product schematics, CAD and software architecture.', accent: '#a984ff' },
      { key: 'prototype', number: '04', shortTitle: 'Build', title: 'Prototype', copy: 'Physical build and preliminary functional validation.', accent: '#ff9a43' },
      { key: 'testing', number: '05', shortTitle: 'Refine', title: 'Testing & Iteration', copy: 'Rigorous testing and performance tuning.', accent: '#52cbb5' },
      { key: 'deployment', number: '06', shortTitle: 'Launch', title: 'Deployment & Support', copy: 'Final documentation, training and on-site delivery support.', accent: '#8b90ff' },
    ],
  },
  catalogue: {
    sectionLabel: 'Engineering services',
    eyebrow: 'Technical capabilities',
    title: 'Engineering Services',
    description:
      'Focused expertise across electronics, embedded intelligence, product design, and system delivery.',
    action: 'Start a conversation',
    cardLabel: 'Engineering service',
  },
  contact: {
    eyebrow: 'Let’s build it together',
    title: 'Have an idea or an engineering challenge?',
    description:
      'Tell us what you are trying to solve, and we will help identify the clearest path from concept to working system.',
    primaryAction: 'Discuss your project',
    secondaryAction: 'Review our process',
    nextEyebrow: 'What happens next',
    nextLabel: 'Simple & focused',
    steps: [
      { number: '01', title: 'Share the challenge', copy: 'Give us the useful context, constraints, and outcome.' },
      { number: '02', title: 'We assess the fit', copy: 'Our team reviews the technical direction and scope.' },
      { number: '03', title: 'Receive a clear next step', copy: 'We respond with the most practical way to move forward.' },
    ],
  },
} as const
