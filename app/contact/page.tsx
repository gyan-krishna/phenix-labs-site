import type { Metadata } from 'next'
import {
  AlarmClock,
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { JsonLd } from '@/components/common/JsonLd'
import { MainLayout } from '@/components/layout/MainLayout'
import { SocialBrandIcon } from '@/components/common/SocialBrandIcon'
import { getFooterData, getNavbarData } from '@/lib/config/site'
import { ContactFormClient } from './contact-form'
import {
  generateMetadata,
  getBreadcrumbSchema,
  getWebPageSchema,
} from '@/lib/seo'
import { contactContent } from '@/content/contact'
import { sharedContent } from '@/content/shared'

/** Contact route combining persisted contact settings with the enquiry form. */
export const metadata: Metadata = generateMetadata({
  ...contactContent.metadata,
})

export default async function Contact() {
  const [navbar, footer] = await Promise.all([
    getNavbarData(),
    getFooterData(),
  ])
  const contact = footer.contact
  // Empty CMS channels are removed so the UI never renders dead contact actions.
  const directChannels = [
    {
      icon: Phone,
      label: contactContent.details.callLabel,
      value: contact.phone,
      note: contact.hours,
      href: contact.phoneHref,
    },
    {
      icon: Mail,
      label: contactContent.details.emailLabel,
      value: contact.email,
      note: contact.responseTime,
      href: contact.emailHref,
    },
  ].filter((channel) => channel.value && channel.href)

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <JsonLd
        data={[
          getWebPageSchema({
            title: contactContent.metadata.schemaTitle,
            description: contactContent.metadata.schemaDescription,
            path: contactContent.metadata.path,
            type: 'ContactPage',
          }),
          getBreadcrumbSchema([
            { name: sharedContent.breadcrumbs.home, path: '/' },
            { name: contactContent.metadata.breadcrumbLabel, path: contactContent.metadata.path },
          ]),
        ]}
      />
      <div className="overflow-hidden bg-[#ecf1f5] text-[#08111f]">
        <section data-section-label={contactContent.hero.sectionLabel} className="relative px-5 pb-20 pt-20 md:pb-24 md:pt-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(22,34,54,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(22,34,54,.12)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div aria-hidden="true" className="absolute -right-48 top-0 size-[640px] rounded-full bg-[#64c8ef]/18 blur-[120px]" />
          <div aria-hidden="true" className="absolute -left-56 bottom-0 size-[500px] rounded-full bg-[#8b90ff]/9 blur-[120px]" />

          <div className="relative mx-auto grid max-w-[1236px] gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0064d7]">
                {contactContent.hero.eyebrow}
              </p>
              <h1 className="mt-5 max-w-[800px] text-[46px] font-bold leading-[0.98] tracking-[-0.05em] sm:text-[58px] md:text-[72px]">
                {contactContent.hero.title}{' '}
                <span className="bg-linear-to-r from-[#0064d7] to-[#38a4cc] bg-clip-text text-transparent">
                  {contactContent.hero.highlightedTitle}
                </span>
              </h1>
              <p className="mt-7 max-w-[700px] text-[17px] leading-8 text-[#4c5d6f] md:text-[19px]">
                {contactContent.hero.description}
              </p>
              <a
                href="#contact-form"
                className="group mt-9 inline-flex h-13 items-center gap-2 rounded-full border border-[#a9bbc9] bg-white/55 px-6 font-semibold text-[#26374a] shadow-[0_12px_34px_rgba(22,34,54,0.07)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#0064d7]/45 hover:text-[#0064d7]"
              >
                {contactContent.hero.action}
                <ArrowDownRight aria-hidden="true" size={18} className="transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>

            <aside className="relative overflow-hidden rounded-[20px] border border-white/80 bg-white/55 p-6 shadow-[0_26px_70px_rgba(22,34,54,0.11)] backdrop-blur-md sm:p-8">
              <div aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full bg-[#58a7ff]/14 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 border-b border-[#cfdae3] pb-5">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4dbf91] opacity-50" />
                    <span className="relative inline-flex size-3 rounded-full bg-[#38a978]" />
                  </span>
                  <span className="text-sm font-bold text-[#26374a]">{contactContent.hero.status}</span>
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#0064d7]">
                  {contactContent.hero.startingPointsLabel}
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-[#536476]">
                  {contactContent.hero.startingPoints.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e5f1fc] text-[11px] font-bold text-[#0064d7]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section id="contact-form" data-section-label={contactContent.details.sectionLabel} className="scroll-mt-24 px-5 pb-24 md:pb-30">
          <div className="mx-auto grid max-w-[1236px] gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[20px] bg-[#0b1523] p-7 text-white shadow-[0_24px_65px_rgba(22,34,54,0.14)] sm:p-9 lg:sticky lg:top-24">
              <div aria-hidden="true" className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(88,167,255,.85)_1px,transparent_1.2px)] [background-size:25px_25px]" />
              <div aria-hidden="true" className="absolute -left-24 top-10 size-64 rounded-full bg-[#0064d7]/22 blur-[85px]" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#67aeff]">{contactContent.details.eyebrow}</p>
                <h2 className="mt-3 text-[30px] font-bold tracking-[-0.035em] sm:text-[38px]">
                  {contactContent.details.title}
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-[#9eacbc]">
                  {contactContent.details.description}
                </p>

                <div className="mt-8 space-y-3">
                  {directChannels.map(({ icon: Icon, label, value, note, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="group flex items-center gap-4 rounded-[16px] border border-white/[0.085] bg-white/[0.04] p-4 transition-colors hover:border-[#58a7ff]/35 hover:bg-white/[0.07]"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#14273d] text-[#67aeff]">
                        <Icon aria-hidden="true" size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{label}</span>
                        <span className="mt-1 block break-words text-sm font-semibold text-[#d9e2eb]">{value}</span>
                        <span className="mt-1 block text-xs text-[#74869b]">{note}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" size={17} className="ml-auto shrink-0 text-[#62758b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#67aeff]" />
                    </a>
                  ))}
                </div>

                {contact.address && (
                  <div className="mt-3 flex gap-4 rounded-[16px] border border-white/[0.085] bg-white/[0.04] p-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#14273d] text-[#67aeff]">
                      <MapPin aria-hidden="true" size={20} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{contactContent.details.addressLabel}</p>
                      <address className="mt-1 text-sm font-medium not-italic leading-6 text-[#d9e2eb]">
                        {contact.address}
                      </address>
                    </div>
                  </div>
                )}

                {contact.socialLinks.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-7">
                    <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#718297]">{contactContent.details.socialLabel}</span>
                    {contact.socialLinks.map(({ id, label, href, platform, customIcon }) => (
                      <a
                        key={id}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${contactContent.details.socialAriaPrefix} ${label}`}
                        className="flex size-10 items-center justify-center rounded-[13px] border border-white/[0.085] bg-white/[0.04] text-[#9baabd] transition-all hover:-translate-y-0.5 hover:border-[#58a7ff]/40 hover:text-[#67aeff]"
                      >
                        <SocialBrandIcon platform={platform} customIcon={customIcon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[20px] border border-[#c8d6e0] bg-white p-6 shadow-[0_24px_65px_rgba(22,34,54,0.09)] sm:p-9 md:p-11">
              <div className="mb-8 border-b border-[#d8e1e8] pb-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[13px] bg-[#e7f2ff] text-[#0064d7]">
                    <AlarmClock aria-hidden="true" size={19} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0064d7]">{contactContent.enquiry.eyebrow}</p>
                    <p className="mt-1 text-xs text-[#718091]">{contact.responseTime}</p>
                  </div>
                </div>
                <h2 className="mt-6 text-[30px] font-bold tracking-[-0.035em] text-[#162236] md:text-[40px]">
                  {contactContent.enquiry.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#607183]">
                  {contactContent.enquiry.description}
                </p>
              </div>
              <ContactFormClient />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
