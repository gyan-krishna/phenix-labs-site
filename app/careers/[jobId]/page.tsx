import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Check, FileText, MapPin, PauseCircle, Send } from 'lucide-react'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/common/JsonLd'
import { MarkdownContent } from '@/components/content/MarkdownContent'
import { JobApplicationForm } from '@/components/forms/JobApplicationForm'
import { MainLayout } from '@/components/layout/MainLayout'
import { ScrollResetLink } from '@/components/navigation/ScrollResetLink'
import { careersContent } from '@/content/careers'
import { getCareerSettings, getJobApplicationPolicy, getJobById, isAcceptingApplications, isJobApplicationWindowOpen } from '@/lib/data/jobs'
import { getFooterData, getNavbarData } from '@/lib/config/site'
import { generateMetadata as makeMetadata, getBreadcrumbSchema, getJobPostingSchema, getWebPageSchema } from '@/lib/seo'
import { sharedContent } from '@/content/shared'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

export async function generateMetadata({ params }: { params: Promise<{ jobId: string }> }): Promise<Metadata> {
  const { jobId } = await params
  const job = await getJobById(jobId)
  if (!job || job.status === 'draft') return makeMetadata({ title: 'Role not found', path: `/careers/${jobId}`, index: false })
  const open = isAcceptingApplications(job, await getCareerSettings())
  return makeMetadata({
    title: job.title,
    description: job.summary,
    path: `/careers/${job.jobId}`,
    keywords: ['Phenix Labs careers', job.title, job.department, job.location],
    index: open,
  })
}

/** Stable-ID role detail page; closed roles remain readable but cannot receive submissions. */
export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const [navbar, footer, job, settings] = await Promise.all([getNavbarData(), getFooterData(), getJobById(jobId), getCareerSettings()])
  if (!job || job.status === 'draft') notFound()

  const acceptingApplications = isAcceptingApplications(job, settings)
  const jobApplicationWindowOpen = isJobApplicationWindowOpen(job)
  const applicationPolicy = getJobApplicationPolicy(job, settings)
  const closed = !acceptingApplications
  // A role's own closed/deadline state is more specific than the global pause.
  const showGlobalPause = jobApplicationWindowOpen && !settings.applicationsEnabled
  const showRolePause = jobApplicationWindowOpen && settings.applicationsEnabled && !job.applicationsEnabled
  const unavailableTitle = showGlobalPause
    ? careersContent.detail.pausedTitle
    : showRolePause
      ? careersContent.detail.rolePausedTitle
      : careersContent.detail.closedTitle
  const unavailableDescription = showGlobalPause
    ? careersContent.detail.pausedDescription
    : showRolePause
      ? careersContent.detail.rolePausedDescription
      : careersContent.detail.closedDescription

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd data={[
        getWebPageSchema({ title: job.title, description: job.summary, path: `/careers/${job.jobId}` }),
        getBreadcrumbSchema([{ name: sharedContent.breadcrumbs.home, path: '/' }, { name: careersContent.metadata.breadcrumbLabel, path: '/careers' }, { name: job.title, path: `/careers/${job.jobId}` }]),
        ...(acceptingApplications ? [getJobPostingSchema({ title: job.title, description: job.summary, path: `/careers/${job.jobId}`, employmentType: job.employmentType, workplaceType: job.workplaceType, location: job.location, datePosted: job.opensAt, validThrough: job.applicationDeadline })] : []),
      ]} />
      <div className="overflow-hidden bg-[#ecf1f5] text-[#08111f]">
        <section data-section-label="Role overview" className="relative overflow-hidden bg-[#081321] px-5 py-16 text-white md:py-22">
          <div aria-hidden="true" className="absolute -left-44 -top-48 size-[580px] rounded-full bg-[#0064d7]/25 blur-[130px]" />
          <div aria-hidden="true" className="absolute right-[-14rem] top-0 size-[480px] rounded-full bg-[#45c9e8]/15 blur-[120px]" />
          <div className="relative mx-auto max-w-[1236px]">
            <Link href="/careers" className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-[#aebbc9] transition-colors hover:text-white"><ArrowLeft aria-hidden="true" size={17} />{careersContent.detail.backAction}</Link>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65afff]">{careersContent.detail.jobIdLabel}: {job.jobId}</p>
                <h1 className="mt-5 max-w-[830px] text-[44px] font-bold leading-[0.97] tracking-[-0.055em] sm:text-[60px] md:text-[72px]">{job.title}</h1>
                <p className="mt-6 max-w-[760px] text-[17px] leading-8 text-[#aebbc9]">{job.summary}</p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5 text-sm backdrop-blur-md">
                <dl className="space-y-4 text-[#c6d2de]">
                  <div><dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{careersContent.labels.department}</dt><dd className="mt-1 font-semibold text-white">{job.department}</dd></div>
                  <div><dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{careersContent.labels.experience}</dt><dd className="mt-1 font-semibold text-white">{job.experienceYears || job.experienceLevel}</dd></div>
                  <div><dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{careersContent.detail.compensationLabel}</dt><dd className="mt-1 font-semibold text-white">{job.compensation || careersContent.detail.compensationNotDisclosed}</dd></div>
                  {job.applicationDeadline && <div><dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{careersContent.labels.deadline}</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-white"><CalendarDays aria-hidden="true" size={15} className="text-[#65afff]" />{formatDate(job.applicationDeadline)}</dd></div>}
                </dl>
              </div>
            </div>
            <div className="mt-9 flex flex-wrap gap-2.5 text-sm text-[#d5e0ea]"><span className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2">{job.employmentType}</span><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2"><MapPin aria-hidden="true" size={15} className="text-[#65afff]" />{job.location} · {job.workplaceType}</span></div>
          </div>
        </section>

        <section data-section-label="Role details" className="px-5 py-16 md:py-22">
          <div className="mx-auto grid max-w-[1236px] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <article className="min-w-0 rounded-[20px] border border-[#cbd8e1] bg-white p-6 shadow-[0_18px_48px_rgba(22,34,54,.07)] sm:p-9">
              <MarkdownContent content={job.description} className="max-w-none" />
              {job.responsibilities.length > 0 && <RoleList title={careersContent.detail.responsibilitiesTitle} items={job.responsibilities} />}
              {job.requiredSkills.length > 0 && <RoleList title={careersContent.detail.requiredSkillsTitle} items={job.requiredSkills} />}
              {job.preferredSkills.length > 0 && <RoleList title={careersContent.detail.preferredSkillsTitle} items={job.preferredSkills} />}
              {job.benefits.length > 0 && <RoleList title={careersContent.detail.benefitsTitle} items={job.benefits} />}
            </article>
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[20px] bg-[#0b1523] p-6 text-white shadow-[0_20px_55px_rgba(22,34,54,.15)]"><Send aria-hidden="true" size={22} className="text-[#67aeff]" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#67aeff]">{acceptingApplications ? careersContent.detail.applicationTitle : unavailableTitle}</p><p className="mt-3 text-sm leading-7 text-[#aebccc]">{acceptingApplications ? careersContent.detail.applicationDescription : unavailableDescription}</p>{acceptingApplications && <ScrollResetLink href="#application" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#0064d7] px-5 text-sm font-semibold text-white transition hover:bg-[#0055b8]">Apply now</ScrollResetLink>}</div>
            </aside>
          </div>
        </section>

        <section id="application" data-section-label="Application" className="scroll-mt-24 px-5 pb-24 md:pb-30">
          <div className="mx-auto max-w-[920px] rounded-[20px] border border-[#c8d6e0] bg-white p-6 shadow-[0_24px_65px_rgba(22,34,54,.09)] sm:p-9 md:p-11">
            {closed ? <div className="text-center"><span className="mx-auto flex size-13 items-center justify-center rounded-[16px] bg-[#eef3f6] text-[#526a80]"><PauseCircle aria-hidden="true" size={24} /></span><h2 className="mt-6 text-[28px] font-bold tracking-[-0.04em] text-[#162236]">{unavailableTitle}</h2><p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-7 text-[#607183]">{unavailableDescription}</p></div> : <><div className="mb-8 border-b border-[#d8e1e8] pb-7"><div className="flex size-10 items-center justify-center rounded-[13px] bg-[#e7f2ff] text-[#0064d7]"><FileText aria-hidden="true" size={19} /></div><h2 className="mt-5 text-[30px] font-bold tracking-[-0.035em] text-[#162236] md:text-[40px]">{careersContent.detail.applicationTitle}</h2><p className="mt-3 text-sm leading-7 text-[#607183]">{careersContent.detail.applicationDescription}</p></div><JobApplicationForm jobId={job.jobId} jobTitle={job.title} resumeRequired={job.resumeRequired} coverLetterRequired={job.coverLetterRequired} retentionDays={applicationPolicy.retentionDays} privacyContactEmail={applicationPolicy.privacyContactEmail} /></>}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

function RoleList({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-10 border-t border-[#e0e7ec] pt-9"><h2 className="text-[25px] font-bold tracking-[-0.035em] text-[#162236]">{title}</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-[#536476]"><Check aria-hidden="true" size={17} className="mt-1 shrink-0 text-[#168a68]" />{item}</li>)}</ul></section>
}
