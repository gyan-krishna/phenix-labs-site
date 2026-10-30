/**
 * Core type definitions for the website
 * All data structures are defined here for type safety
 */

export interface NavLink {
  label: string
  href: string
  isActive?: boolean
  /** Keeps a destination available in shared data while omitting it from the primary nav. */
  showInNavbar?: boolean
  showInFooter?: boolean
}

export interface NavbarData {
  logo: {
    text: string
    href: string
    imageSrc?: string
  }
  links: NavLink[]
  contactCta?: {
    text: string
    href: string
  }
  cta?: {
    text: string
    href: string
    openInNewTab?: boolean
  }
}

export interface FooterData {
  copyright: string
  contact: ContactSettings
}

export interface SocialLink {
  id: string
  platform: string
  label: string
  href: string
  customIcon?: string
}

export interface ContactSettings {
  phone: string
  phoneHref: string
  email: string
  emailHref: string
  hours: string
  responseTime: string
  address: string
  socialLinks: SocialLink[]
}

export interface HeroContent {
  title: string
  subtitle: string
  description: string
  cta: {
    text: string
    href: string
  }
  backgroundImage?: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon?: string
  image?: string
}

export interface Stat {
  label: string
  value: string
  suffix?: string
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon?: string
  features?: string[]
  image?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  social?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

export interface ProjectCase {
  id: string
  title: string
  description: string
  category: string
  image: string
  link?: string
  featured?: boolean
}

export interface PageContent {
  title: string
  description: string
  keywords: string[]
}

export interface HomePage extends PageContent {
  hero: HeroContent
  stats: Stat[]
  whatWeDo: {
    title: string
    description: string
    services: Array<{
      id: string
      title: string
      description: string
      icon: string
    }>
  }
  ourServices: {
    title: string
    description: string
    services: Array<{
      id: string
      title: string
      description: string
      icon: string
    }>
  }
  ourInventions: {
    title: string
    description: string
    inventions: Array<{
      id: string
      title: string
      description: string
      image: string
      bgColor: string
    }>
  }
  testimonials: {
    title: string
    description: string
    testimonials: Array<{
      id: string
      quote: string
      author: string
      role: string
      rating: number
    }>
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export interface ServicesPage extends PageContent {
  hero: HeroContent
  serviceCategories: Array<{
    id: string
    number: string
    title: string
    subtitle: string
    description: string
    benefits: string[]
    tags: string[]
    icon: string
  }>
  developmentProcess: {
    title: string
    description: string
    steps: Array<{
      id: string
      title: string
      description: string
    }>
  }
  engineeringServices: Array<{
    id: string
    title: string
    description: string
    icon: string
  }>
  cta: {
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton: {
      text: string
      href: string
    }
  }
}

export interface AboutPage extends PageContent {
  hero: HeroContent
  mission: {
    title: string
    description: string
  }
  values: {
    title: string
    items: {
      title: string
      description: string
    }[]
  }
  team?: TeamMember[]
  stats: Stat[]
}

export interface CasesPage extends PageContent {
  hero: HeroContent
  cases: ProjectCase[]
}
