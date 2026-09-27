import type { Metadata } from 'next'
import { JsonLd } from '@/components/common/JsonLd'
import { generateMetadata, getWebPageSchema } from '@/lib/seo'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePageContent } from '@/components/sections/HomePageContent'
import { getNavbarData, getFooterData } from '@/lib/config/site'
import { getHomeTestimonials } from '@/lib/data/testimonials'
import { getClients } from '@/lib/data/clients'
import { getHomeServices } from '@/lib/data/services'
import { getFeaturedInventions } from '@/lib/data/inventions'
import { homeContent } from '@/content/home'

/** Home route: composes independently cached CMS collections into one page model. */
export const metadata: Metadata = generateMetadata({
  ...homeContent.metadata,
})

export default async function Home() {
  // These collections do not depend on one another, so resolve them in parallel.
  const [navbar, footer, testimonials, clients, services, inventions] = await Promise.all([
    getNavbarData(),
    getFooterData(),
    getHomeTestimonials(),
    getClients(),
    getHomeServices(),
    getFeaturedInventions(),
  ])

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd
        data={getWebPageSchema({
          title: homeContent.metadata.title,
          description: homeContent.metadata.schemaDescription,
          path: homeContent.metadata.path,
        })}
      />
      <HomePageContent
        testimonials={testimonials}
        clients={clients}
        services={services}
        inventions={inventions}
      />
    </MainLayout>
  )
}
