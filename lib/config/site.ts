import type { FooterData, NavbarData } from '@/types'
import { DEFAULT_CONTACT_SETTINGS } from '@/config/contact'
import { getContactSettings } from '@/lib/data/contact'

/**
 * Persistent site-wide navigation configuration.
 *
 * Visibility flags let one source configure primary and footer navigation independently.
 */
export const navbarData: NavbarData = {
  logo: {
    text: 'Phenix Labs',
    href: '/',
    imageSrc: '/images/logo.png',
  },
  links: [
    { label: 'Home', href: '/', isActive: true, showInFooter: true },
    { label: 'About', href: '/about', showInFooter: true },
    { label: 'Services', href: '/services', showInFooter: true },
    { label: 'Products', href: '/products', showInFooter: true },
    { label: 'Testimonials', href: '/testimonials', showInFooter: true },
    { label: 'Careers', href: '/careers', showInNavbar: false, showInFooter: true },
  ],
  contactCta: {
    text: 'Contact Us',
    href: '/contact',
  },
  // cta: {
  //   text: 'Education',
  //   href: 'https://learn.phenixlabs.in/',
  //   openInNewTab: true,
  // },
}

/**
 * Persistent site-wide footer configuration.
 *
 * Footer navigation is derived from `navbarData.links`.
 */
export const footerData: FooterData = {
  copyright: '© 2026 Phenix Labs. All rights reserved.',
  contact: DEFAULT_CONTACT_SETTINGS,
}

export async function getNavbarData(): Promise<NavbarData> {
  return navbarData
}

export async function getFooterData(): Promise<FooterData> {
  return {
    ...footerData,
    contact: await getContactSettings(),
  }
}
