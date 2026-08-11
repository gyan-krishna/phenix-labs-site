import type { Metadata } from 'next'
import type { ContactSettings } from '@/types'
import { DEFAULT_CONTACT_SETTINGS } from '@/config/contact'

const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '')

/** Shared public identity used by metadata, canonical URLs, and structured data. */
const siteConfig = {
  name: 'Phenix Labs',
  description:
    'Engineering and product development partner for PCB design, embedded systems, firmware, Edge AI, prototyping, and research-led innovation.',
  url: configuredUrl || 'https://phenix-labs.com',
  ogImage: '/opengraph-image',
  twitter: '@phenixlabs',
  locale: 'en_IN',
}

export interface SEOMetadata {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  keywords?: string[]
  author?: string
  path?: string
  index?: boolean
}

/** Resolve a route against the configured origin without producing duplicate slashes. */
export function absoluteUrl(path = '/') {
  return new URL(path, `${siteConfig.url}/`).toString()
}

/** Produces consistent metadata while allowing each route to own its canonical URL. */
export function generateMetadata(params: SEOMetadata = {}): Metadata {
  const {
    title = siteConfig.name,
    description = siteConfig.description,
    canonicalUrl,
    ogImage = siteConfig.ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    keywords = [],
    path = '/',
    index = true,
  } = params

  const fullTitle =
    title === siteConfig.name ? title : `${siteConfig.name} - ${title}`;
  const pageUrl = absoluteUrl(path)
  const canonical = canonicalUrl || pageUrl
  const socialImage = absoluteUrl(ogImage)

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: { canonical },
    formatDetection: { email: false, telephone: false, address: false },
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [{ url: socialImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: twitterCard,
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title: fullTitle,
      description,
      images: [socialImage],
    },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

/** Organization entity shared by the website and page-level structured data. */
export function getOrganizationSchema(
  contact: ContactSettings = DEFAULT_CONTACT_SETTINGS,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/images/logo.png'),
    description: siteConfig.description,
    ...(contact.socialLinks.length > 0 && {
      sameAs: contact.socialLinks.map((link) => link.href),
    }),
    ...((contact.email || contact.phone) && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales and general enquiries',
        ...(contact.email && { email: contact.email }),
        ...(contact.phone && { telephone: contact.phone }),
        availableLanguage: ['English'],
      },
    }),
    ...(contact.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact.address,
        addressCountry: 'IN',
      },
    }),
  }
}

/** Website entity connects every page back to one canonical site identity. */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: absoluteUrl('/'),
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'en-IN',
  }
}

/** Page entity for standard, About, Contact, and collection routes. */
export function getWebPageSchema(params: {
  title: string
  description: string
  path: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': params.type || 'WebPage',
    '@id': `${absoluteUrl(params.path)}#webpage`,
    name: params.title,
    description: params.description,
    url: absoluteUrl(params.path),
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'en-IN',
  }
}

/** Breadcrumb schema gives crawlers an explicit route hierarchy. */
export function getBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Service entity mirrors only published CMS service content. */
export function getServiceSchema(params: {
  name: string
  description: string
  path?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path || '/services'),
    areaServed: { '@type': 'Country', name: 'India' },
    provider: { '@id': `${siteConfig.url}/#organization` },
  }
}

/** Catalogue schema describes inventions as creative engineering work, not retail offers. */
export function getInventionCollectionSchema(
  inventions: Array<{
    id: string
    title: string
    description: string
    imageUrl?: string
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Phenix Labs inventions and products',
    numberOfItems: inventions.length,
    itemListElement: inventions.map((invention, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: invention.title,
        description: invention.description,
        url: `${absoluteUrl('/products')}?invention=${encodeURIComponent(invention.id)}`,
        ...(invention.imageUrl && { image: invention.imageUrl }),
        creator: { '@id': `${siteConfig.url}/#organization` },
      },
    })),
  }
}

export const siteMetadata = siteConfig
