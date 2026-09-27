/** Static Home page copy. Sanity-backed collections remain in `lib/data`. */
export const homeContent = {
  metadata: {
    title: 'Phenix Labs - Engineering, Prototyping & Embedded Systems',
    description:
      'Phenix Labs develops PCB, firmware, embedded systems, Edge AI, prototypes, and engineered products for industry, research, and academic partners.',
    keywords: [
      'engineering company India',
      'embedded systems development',
      'PCB design',
      'firmware development',
      'Edge AI development',
      'engineering prototyping',
    ],
    path: '/',
    schemaDescription:
      'Engineering services and research-led product development for industry and academic partners.',
  },
  hero: {
    sectionLabel: 'Introduction',
    eyebrow: 'Research · Engineering · Education',
    title: 'Research Driven Product',
    highlightedTitle: 'Development.',
    quote: '“The best way to predict the future is to invent it.”',
    primaryAction: { label: 'Explore our work', href: '/products' },
    secondaryAction: { label: 'See our services', href: '/services' },
    capabilities: ['Research-led', 'Built end to end', 'Ready for the real world'],
  },
  clients: {
    sectionLabel: 'Clients',
    eyebrow: 'Selected collaborations',
    title: 'Trusted by teams that build boldly.',
  },
  highlights: {
    sectionLabel: 'Company highlights',
    items: [
      { value: 150, suffix: ' +', label: 'Designs Completed', color: '#d97822' },
      { value: 50, suffix: ' +', label: 'Happy Clients', color: '#7957cf' },
      { value: 12, suffix: ' +', label: 'Years of Experience', color: '#168ab3' },
      { value: 2, suffix: ' +', label: 'Years in Business', color: '#5961cc' },
    ],
  },
  whatWeDo: {
    sectionLabel: 'What we do',
    eyebrow: 'What We Do',
    title: 'Turning Ideas Into Reality',
    description:
      'We bring research, product development, and practical education together under one roof—creating useful technology while helping the next generation understand how it works.',
    items: [
      {
        key: 'research',
        number: '01',
        title: 'Research',
        copy: 'We explore robotics, AI, and automation to uncover practical ideas that can shape tomorrow’s products.',
        accent: '#58a7ff',
      },
      {
        key: 'development',
        number: '02',
        title: 'Development',
        copy: 'We turn promising concepts into dependable hardware and software, from early prototypes through production.',
        accent: '#ff9a43',
      },
      {
        key: 'education',
        number: '03',
        title: 'Education',
        copy: 'We make modern technology approachable through hands-on learning in robotics, AI, and automation.',
        accent: '#a984ff',
      },
    ],
  },
  services: {
    sectionLabel: 'Services',
    eyebrow: 'What we build',
    title: 'Our Services',
    description:
      'From the first circuit to the final interface, we build connected solutions that are ready for the real world.',
    cardActionPrefix: 'Explore',
    allAction: 'Explore all services',
    target: '/services#engineering-services',
  },
  inventions: {
    sectionLabel: 'Inventions',
    eyebrow: 'Ideas made tangible',
    title: 'Our Inventions',
    description:
      'Experiments, prototypes, and engineered objects that turn curiosity into something people can see, touch, and test.',
    action: 'Explore our work',
    cardLabel: 'Featured invention',
    viewPrefix: 'View',
  },
  testimonials: {
    sectionLabel: 'Testimonials',
    eyebrow: 'Client stories',
    title: 'What Our Clients Say About Us',
    description:
      'Real experiences from the people who trusted us to turn complex ideas into useful products.',
    archiveAction: 'Explore more client stories',
    play: 'Play',
    pause: 'Pause',
    previousLabel: 'Show previous testimonial',
    nextLabel: 'Show next testimonial',
    resumeLabel: 'Resume automatic testimonial rotation',
    pauseLabel: 'Pause automatic testimonial rotation',
    carouselLabel: 'Client testimonials',
    itemLabel: 'Testimonial',
    showItemLabel: 'Show testimonial',
    chooserLabel: 'Choose a testimonial',
    readMore: 'Read more',
    modalEyebrow: 'Client testimonial',
    ratingSuffix: 'out of 5 stars',
    closeLabel: 'Close full testimonial',
  },
} as const
