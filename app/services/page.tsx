import type { Metadata } from 'next'
import { JsonLd } from '@/components/common/JsonLd'
import {
  generateMetadata,
  getBreadcrumbSchema,
  getServiceSchema,
  getWebPageSchema,
} from '@/lib/seo'
import { MainLayout } from '@/components/layout/MainLayout'
import { ServicesPageContent } from '@/components/sections/ServicesPageContent'
import { getNavbarData, getFooterData } from '@/lib/config/site'
import { getAllServices } from '@/lib/data/services'
import { servicesContent } from '@/content/services'
import { sharedContent } from '@/content/shared'

/** Services route populated from the shared Sanity service collection. */
export const metadata: Metadata = generateMetadata({
  ...servicesContent.metadata,
})

export default async function Services() {
  // Shared layout content and page services are safe to fetch concurrently.
  const [navbar, footer, services] = await Promise.all([
    getNavbarData(),
    getFooterData(),
    getAllServices(),
  ])

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd
        data={[
          getWebPageSchema({
            title: servicesContent.metadata.schemaTitle,
            description: servicesContent.metadata.schemaDescription,
            path: servicesContent.metadata.path,
            type: 'CollectionPage',
          }),
          getBreadcrumbSchema([
            { name: sharedContent.breadcrumbs.home, path: '/' },
            { name: servicesContent.metadata.breadcrumbLabel, path: servicesContent.metadata.path },
          ]),
          ...services.map((service) =>
            getServiceSchema({
              name: service.title,
              description: service.description,
            }),
          ),
        ]}
      />
      <ServicesPageContent services={services} />
    </MainLayout>
  )
}
