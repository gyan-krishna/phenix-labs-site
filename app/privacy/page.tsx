import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { JsonLd } from '@/components/common/JsonLd'
import { MainLayout } from '@/components/layout/MainLayout'
import { privacyContent } from '@/content/privacy'
import { getCareerSettings } from '@/lib/data/jobs'
import { getFooterData, getNavbarData } from '@/lib/config/site'
import { generateMetadata, getBreadcrumbSchema, getWebPageSchema } from '@/lib/seo'
import { sharedContent } from '@/content/shared'

export const metadata: Metadata = generateMetadata({ ...privacyContent.metadata })

export default async function PrivacyPage() {
  const [navbar, footer, careers] = await Promise.all([getNavbarData(), getFooterData(), getCareerSettings()])
  return <MainLayout navbarData={navbar} footerData={footer}>
    <JsonLd data={[getWebPageSchema({ title: privacyContent.metadata.schemaTitle, description: privacyContent.metadata.schemaDescription, path: privacyContent.metadata.path }), getBreadcrumbSchema([{ name: sharedContent.breadcrumbs.home, path: '/' }, { name: privacyContent.metadata.breadcrumbLabel, path: privacyContent.metadata.path }])]} />
    <div className="overflow-hidden bg-[#ecf1f5] text-[#08111f]"><section className="relative overflow-hidden bg-[#081321] px-5 py-18 text-white md:py-24"><div aria-hidden="true" className="absolute -left-40 -top-48 size-[580px] rounded-full bg-[#0064d7]/25 blur-[130px]" /><div className="relative mx-auto max-w-[960px]"><span className="flex size-13 items-center justify-center rounded-[17px] bg-[#58a7ff]/14 text-[#71b4ff]"><ShieldCheck aria-hidden="true" size={26} /></span><p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-[#65afff]">{privacyContent.hero.eyebrow}</p><h1 className="mt-5 text-[44px] font-bold leading-[0.97] tracking-[-0.055em] sm:text-[60px]">{privacyContent.hero.title} <span className="bg-linear-to-r from-[#58a7ff] to-[#64d4ef] bg-clip-text text-transparent">{privacyContent.hero.highlightedTitle}</span></h1><p className="mt-6 max-w-[760px] text-[17px] leading-8 text-[#aebbc9]">{privacyContent.hero.description}</p></div></section><section className="px-5 py-18 md:py-24"><div className="mx-auto max-w-[960px] space-y-5">{privacyContent.sections.map((section) => <article key={section.key} className="rounded-[20px] border border-[#cbd8e1] bg-white p-6 shadow-[0_14px_35px_rgba(22,34,54,.06)] sm:p-8"><h2 className="text-[25px] font-bold tracking-[-0.035em] text-[#162236]">{section.title}</h2><p className="mt-3 text-[15px] leading-7 text-[#607183]">{section.body}</p></article>)}<aside className="rounded-[20px] bg-[#0b1523] p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#67aeff]">Retention and contact</p><p className="mt-4 text-[20px] font-bold tracking-[-0.025em]">Applications are retained for up to {careers.retentionDays} days by default.</p><p className="mt-3 text-sm leading-7 text-[#aebccc]">A role can set a different retention period. The exact policy appears beside the privacy consent checkbox for that role.</p><p className="mt-3 text-sm leading-7 text-[#aebccc]">For privacy requests, contact <a className="font-semibold text-[#8dc6ff] underline underline-offset-4" href={`mailto:${careers.privacyContactEmail}`}>{careers.privacyContactEmail}</a> and include the relevant job ID.</p><Link href="/careers" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8dc6ff] transition hover:text-white">View open roles <ArrowUpRight aria-hidden="true" size={17} /></Link></aside></div></section></div>
  </MainLayout>
}
