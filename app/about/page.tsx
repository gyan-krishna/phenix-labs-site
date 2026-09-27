import type { Metadata } from 'next'
import { JsonLd } from '@/components/common/JsonLd'
import { MarkdownContent } from '@/components/content/MarkdownContent'
import { MainLayout } from '@/components/layout/MainLayout'
import { getNavbarData, getFooterData } from '@/lib/config/site'
import { getAboutMarkdown } from '@/lib/data/about'
import {
  generateMetadata,
  getBreadcrumbSchema,
  getWebPageSchema,
} from '@/lib/seo'
import { aboutContent } from '@/content/about'
import { sharedContent } from '@/content/shared'

/** Public About route. The page intentionally stays empty when no CMS Markdown is published. */
export const metadata: Metadata = generateMetadata({
  ...aboutContent.metadata,
})

export default async function About() {
  // Load shared chrome and page content concurrently to avoid serial CMS requests.
  const [navbar, footer, markdown] = await Promise.all([
    getNavbarData(),
    getFooterData(),
    getAboutMarkdown(),
  ])

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd
        data={[
          getWebPageSchema({
            title: aboutContent.metadata.schemaTitle,
            description: aboutContent.metadata.schemaDescription,
            path: aboutContent.metadata.path,
            type: 'AboutPage',
          }),
          getBreadcrumbSchema([
            { name: sharedContent.breadcrumbs.home, path: '/' },
            { name: aboutContent.metadata.breadcrumbLabel, path: aboutContent.metadata.path },
          ]),
        ]}
      />
      {markdown ? (
        <section data-section-label={aboutContent.sectionLabel} className="bg-[#ecf1f5] px-5 py-16 md:px-8 md:py-24">
          <MarkdownContent content={markdown} />
        </section>
      ) : null}
    </MainLayout>
  )
}
