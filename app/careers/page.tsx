import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, CirclePause, MapPin, Sparkles } from 'lucide-react'
import { JsonLd } from '@/components/common/JsonLd'
import { MainLayout } from '@/components/layout/MainLayout'
import { careersContent } from '@/content/careers'
import { getCareerSettings, getOpenJobs } from '@/lib/data/jobs'
import { getFooterData, getNavbarData } from '@/lib/config/site'
import { generateMetadata, getBreadcrumbSchema, getWebPageSchema } from '@/lib/seo'
import { sharedContent } from '@/content/shared'

export const metadata: Metadata = generateMetadata({ ...careersContent.metadata })

/** Server-rendered open-role collection backed by published Sanity job postings. */
export default async function CareersPage() {
  const [navbar, footer, jobs, settings] = await Promise.all([
    getNavbarData(),
    getFooterData(),
    getOpenJobs(),
    getCareerSettings(),
  ])

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd data={[
        getWebPageSchema({ title: careersContent.metadata.schemaTitle, description: careersContent.metadata.schemaDescription, path: careersContent.metadata.path, type: 'CollectionPage' }),
        getBreadcrumbSchema([{ name: sharedContent.breadcrumbs.home, path: '/' }, { name: careersContent.metadata.breadcrumbLabel, path: careersContent.metadata.path }]),
      ]} />
      <div className="overflow-hidden bg-[#ecf1f5] text-[#08111f]">
        <section data-section-label="Careers overview" className="relative overflow-hidden bg-[#081321] px-5 py-18 text-white md:py-24 lg:py-28">
          <div aria-hidden="true" className="absolute -left-44 -top-48 size-[600px] rounded-full bg-[#0064d7]/25 blur-[130px]" />
          <div aria-hidden="true" className="absolute -bottom-56 right-[10%] size-[540px] rounded-full bg-[#45c9e8]/16 blur-[130px]" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(103,174,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(103,174,255,.6)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="relative mx-auto grid max-w-[1236px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#65afff]"><Sparkles aria-hidden="true" size={16} />{careersContent.hero.eyebrow}</p>
              <h1 className="mt-6 max-w-[800px] text-[48px] font-bold leading-[0.96] tracking-[-0.055em] sm:text-[62px] md:text-[78px]">
                {careersContent.hero.title} <span className="bg-linear-to-r from-[#58a7ff] via-[#64d4ef] to-[#9aabff] bg-clip-text text-transparent">{careersContent.hero.highlightedTitle}</span>
              </h1>
              <p className="mt-7 max-w-[690px] text-[17px] leading-8 text-[#aebbc9] md:text-[19px]">{careersContent.hero.description}</p>
            </div>
            <aside className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.055] p-7 shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur-md sm:p-8">
              <div aria-hidden="true" className="absolute -right-12 -top-12 size-44 rounded-full bg-[#58a7ff]/18 blur-3xl" />
              <div className="relative">
                <span className="flex size-12 items-center justify-center rounded-[15px] bg-[#58a7ff]/14 text-[#71b4ff]"><BriefcaseBusiness aria-hidden="true" size={23} /></span>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#65afff]">{careersContent.hero.roleCountLabel}</p>
                <p className="mt-2 text-5xl font-bold tracking-[-0.05em]">{jobs.length.toString().padStart(2, '0')}</p>
                <p className="mt-4 text-sm leading-6 text-[#aebbc9]">Each opening is reviewed with the same care we bring to our engineering work.</p>
              </div>
            </aside>
          </div>
        </section>

        <section data-section-label="Open roles" className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-[1236px]">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0064d7]">{careersContent.list.eyebrow}</p>
              <h2 className="mt-4 text-[34px] font-bold tracking-[-0.045em] text-[#162236] sm:text-[46px]">{careersContent.list.title}</h2>
              <p className="mt-4 text-[16px] leading-7 text-[#607183]">{settings.pageIntro || careersContent.list.defaultIntro}</p>
            </div>

            {!settings.applicationsEnabled && (
              <aside className="mt-8 flex gap-4 rounded-[20px] border border-[#efc885] bg-[#fff8e8] p-5 text-[#543d18] shadow-[0_12px_32px_rgba(95,65,14,.07)] sm:items-center sm:p-6" role="status">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f7dfae] text-[#875d13]"><CirclePause aria-hidden="true" size={21} /></span>
                <div>
                  <h3 className="font-bold tracking-[-0.015em]">{careersContent.list.pausedTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#765b2d]">{careersContent.list.pausedDescription}</p>
                </div>
              </aside>
            )}

            {jobs.length > 0 ? (
              <div className="mt-10 grid gap-5">
                {jobs.map((job) => (
                  <article key={job.jobId} className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#cbd8e1] bg-white p-6 shadow-[0_16px_42px_rgba(22,34,54,.07)] transition-all hover:-translate-y-1 hover:border-[#8abbe8] hover:shadow-[0_22px_55px_rgba(22,34,54,.12)] sm:p-8">
                    <div aria-hidden="true" className="absolute -right-14 -top-16 size-44 rounded-full bg-[#64c8ef]/12 blur-3xl transition-opacity group-hover:opacity-100" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0064d7]">
                        <span className="rounded-full bg-[#e7f2ff] px-3 py-1.5">{careersContent.list.roleLabel}</span>
                        {!job.applicationsEnabled && <span className="rounded-full bg-[#fff1d8] px-3 py-1.5 text-[#8a5a10]">Applications paused</span>}
                        <span className="text-[#7a8b9c]">{careersContent.list.jobIdLabel}: {job.jobId}</span>
                      </div>
                      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-[26px] font-bold tracking-[-0.035em] text-[#162236] sm:text-[30px]">{job.title}</h3>
                        <span className="text-sm font-medium text-[#718297]">{job.workplaceType}</span>
                      </div>
                      <dl className="mt-5 grid gap-2 text-[15px] leading-6 text-[#536476]">
                        <div><dt className="inline font-semibold text-[#26374a]">Location: </dt><dd className="inline"><MapPin aria-hidden="true" size={14} className="-mt-0.5 mr-1 inline text-[#278bc2]" />{job.location}</dd></div>
                        <div><dt className="inline font-semibold text-[#26374a]">{careersContent.labels.jobType}: </dt><dd className="inline">{job.employmentType}</dd></div>
                        <div><dt className="inline font-semibold text-[#26374a]">{careersContent.labels.experience}: </dt><dd className="inline">{job.experienceYears || job.experienceLevel}</dd></div>
                      </dl>
                      <p className="mt-6 text-[15px] leading-7 text-[#607183]">{job.summary}</p>
                      <div className="mt-7 flex flex-wrap gap-3 pt-1">
                        <Link href={`/careers/${job.jobId}`} className="inline-flex h-11 items-center justify-center rounded-full border border-[#7d8d9d] px-5 text-sm font-semibold text-[#26374a] transition hover:border-[#26374a] hover:bg-[#f3f7fa]">{careersContent.list.viewRole}</Link>
                        {settings.applicationsEnabled && job.applicationsEnabled ? (
                          <Link href={`/careers/${job.jobId}#application`} className="group/link inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#5aa7ed] bg-[#f5faff] px-5 text-sm font-semibold text-[#0064d7] transition hover:border-[#0064d7] hover:bg-[#e7f2ff]">{careersContent.list.applyNow}<ArrowUpRight aria-hidden="true" size={16} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /></Link>
                        ) : <span className="inline-flex h-11 items-center rounded-full border border-[#efd29e] bg-[#fff8e8] px-5 text-sm font-semibold text-[#8a5a10]">Applications paused</span>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-[20px] border border-dashed border-[#b9c9d5] bg-white/60 p-9 text-center shadow-[0_14px_35px_rgba(22,34,54,.05)] sm:p-14">
                <span className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#e7f2ff] text-[#0064d7]"><BriefcaseBusiness aria-hidden="true" size={26} /></span>
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.035em] text-[#162236]">{careersContent.list.emptyTitle}</h3>
                <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#607183]">{careersContent.list.emptyDescription}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
