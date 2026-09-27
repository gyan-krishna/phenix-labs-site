import type { Metadata } from 'next'
import { JsonLd } from '@/components/common/JsonLd'
import { MainLayout } from '@/components/layout/MainLayout'
import { TestimonialsArchive } from '@/components/sections/TestimonialsArchive'
import { getFooterData, getNavbarData } from '@/lib/config/site'
import { getTestimonialsPage } from '@/lib/data/testimonials'
import {
  generateMetadata,
  getBreadcrumbSchema,
  getWebPageSchema,
} from '@/lib/seo'
import { testimonialsContent } from '@/content/testimonials'
import { sharedContent } from '@/content/shared'

/** Testimonial archive route; unlike Home, this includes inactive testimonials. */
export const metadata: Metadata = generateMetadata({
  ...testimonialsContent.metadata,
})

export default async function TestimonialsPage() {
  const [navbar, footer, initialPage] = await Promise.all([
    getNavbarData(),
    getFooterData(),
    getTestimonialsPage(),
  ])

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd
        data={[
          getWebPageSchema({
            title: testimonialsContent.metadata.schemaTitle,
            description: testimonialsContent.metadata.schemaDescription,
            path: testimonialsContent.metadata.path,
            type: 'CollectionPage',
          }),
          getBreadcrumbSchema([
            { name: sharedContent.breadcrumbs.home, path: '/' },
            { name: testimonialsContent.metadata.breadcrumbLabel, path: testimonialsContent.metadata.path },
          ]),
        ]}
      />
      {/* Archive hero. */}
      <section data-section-label={testimonialsContent.hero.sectionLabel} className="relative overflow-hidden bg-[#162236] px-5 py-20 text-white md:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(158,193,222,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(158,193,222,.42)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_96%)]"
        />
        <div className="absolute -right-28 -top-36 size-[430px] rounded-full bg-[#0064d7]/25 blur-3xl" />
        <div className="absolute -bottom-48 left-[8%] size-[360px] rounded-full bg-[#a984ff]/15 blur-3xl" />
        <div className="relative mx-auto max-w-[980px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#58a7ff]">
            {testimonialsContent.hero.eyebrow}
          </p>
          <h1 className="mt-5 text-[42px] font-bold leading-[1.02] tracking-[-0.04em] md:text-[68px]">
            {testimonialsContent.hero.title}
          </h1>
          <p className="mx-auto mt-7 max-w-[720px] text-[17px] leading-8 text-[#c4cfda] md:text-[19px]">
            {testimonialsContent.hero.description}
          </p>
        </div>
      </section>

      {/* Incrementally loaded testimonial collection. */}
      <section data-section-label={testimonialsContent.archive.sectionLabel} className="bg-[#ecf1f5] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1236px]">
          <TestimonialsArchive initialPage={initialPage} />
        </div>
      </section>
    </MainLayout>
  )
}
