import Link from 'next/link'
import {
  AlarmClock,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { SocialBrandIcon } from '@/components/common/SocialBrandIcon'
import type { ContactSettings } from '@/types'
import { sharedContent } from '@/content/shared'

/** Footer contact summary populated by the singleton Contact & Social document. */
export function ContactFooterSection({ contact }: { contact: ContactSettings }) {
  // Omit unset CMS values so the footer never renders empty contact rows.
  const contactDetails = [
    { icon: Phone, label: sharedContent.footer.contactLabels.phone, value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: sharedContent.footer.contactLabels.email, value: contact.email, href: contact.emailHref },
    { icon: AlarmClock, label: sharedContent.footer.contactLabels.hours, value: contact.hours },
    { icon: MapPin, label: sharedContent.footer.contactLabels.address, value: contact.address },
  ].filter((item) => item.value)

  return (
    <section
      className="relative overflow-hidden px-5 pb-14 pt-18 text-white md:pb-18 md:pt-24"
      aria-labelledby="footer-contact-title"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 560"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70 [mask-image:linear-gradient(to_bottom,black,black_72%,transparent)]"
      >
        <g fill="none" stroke="#58a7ff" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M-120 95 C90 -10 240 195 450 90 S810 -12 1020 95 S1370 195 1560 80" opacity="0.28" />
          <path d="M-120 140 C90 35 240 240 450 135 S810 33 1020 140 S1370 240 1560 125" opacity="0.2" />
          <path d="M-120 185 C90 80 240 285 450 180 S810 78 1020 185 S1370 285 1560 170" opacity="0.13" />
        </g>
      </svg>
      <div aria-hidden="true" className="absolute -left-44 top-0 size-[460px] rounded-full bg-[#0064d7]/18 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 size-[420px] rounded-full bg-[#a984ff]/9 blur-[120px]" />

      <div className="relative mx-auto max-w-[1236px]">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#77b8ff]">
              <span className="size-2 rounded-full bg-[#4ddb9d] shadow-[0_0_0_5px_rgba(77,219,157,0.1)]" />
              {sharedContent.footer.availability}
            </span>
            <h2
              id="footer-contact-title"
              className="mt-7 max-w-[720px] text-[40px] font-bold leading-[1.02] tracking-[-0.045em] md:text-[60px]"
            >
              {sharedContent.footer.title}
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-[520px] text-[16px] leading-8 text-[#9aa8b9]">
              {sharedContent.footer.description}
            </p>
            <Link
              href="/contact"
              className="group mt-7 inline-flex h-14 items-center gap-3 rounded-full bg-[#0c70df] px-7 font-semibold text-white shadow-[0_15px_38px_rgba(0,100,215,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#1680ef] hover:shadow-[0_18px_44px_rgba(0,100,215,0.38)]"
            >
              {sharedContent.footer.action}
              <ArrowUpRight
                aria-hidden="true"
                size={18}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid border-y border-white/[0.085] sm:grid-cols-2 lg:mt-18 lg:grid-cols-4">
          {contactDetails.map(({ icon: Icon, label, value, href }, index) => {
            const content = (
              <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.08] bg-white/[0.045] text-[#67aeff]">
                  <Icon aria-hidden="true" size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f8094]">
                    {label}
                  </span>
                  <span className="mt-1.5 block text-sm font-semibold leading-6 text-[#ced8e3]">
                    {value}
                  </span>
                </span>
              </>
            )
            const className = `group flex min-h-[116px] items-center gap-4 py-5 transition-colors hover:bg-white/[0.025] sm:px-5 ${
              index > 0 ? 'lg:border-l lg:border-white/[0.085]' : ''
            } ${index % 2 === 1 ? 'sm:border-l sm:border-white/[0.085]' : ''}`

            return href ? (
              <a key={label} href={href} className={className}>
                {content}
              </a>
            ) : (
              <div key={label} className={className}>
                {content}
              </div>
            )
          })}
        </div>

        {(contact.responseTime || contact.socialLinks.length > 0) && (
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {contact.responseTime ? (
              <p className="text-sm text-[#77879a]">{contact.responseTime}</p>
            ) : <span />}
            {contact.socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f8094]">
                  {sharedContent.footer.socialLabel}
                </span>
                {contact.socialLinks.map(({ id, label, href, platform, customIcon }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${sharedContent.footer.socialAriaPrefix} ${label}`}
                    className="flex size-10 items-center justify-center rounded-[13px] border border-white/[0.085] bg-white/[0.035] text-[#9aa9ba] transition-all hover:-translate-y-0.5 hover:border-[#58a7ff]/40 hover:bg-[#10243b] hover:text-[#67aeff]"
                  >
                    <SocialBrandIcon platform={platform} customIcon={customIcon} />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
