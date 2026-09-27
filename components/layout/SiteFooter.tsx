import Image from 'next/image'
import Link from 'next/link'
import type { FooterData, NavbarData, NavLink } from '@/types'
import { ContactFooterSection } from './ContactFooterSection'
import { sharedContent } from '@/content/shared'

interface SiteFooterProps {
  data: FooterData
  links: NavLink[]
  logo: NavbarData['logo']
}

/** Global footer using the same persisted navigation visibility data as the navbar. */
export function SiteFooter({ data, links, logo }: SiteFooterProps) {
  // Navigation owns footer visibility so editors configure each destination once.
  const footerLinks = links.filter((link) => link.showInFooter !== false)

  return (
    <footer className="bg-[#060d18] text-white">
      <ContactFooterSection contact={data.contact} />

      <div className="border-t border-[#1a2a3e] px-5 py-8">
        <div className="mx-auto flex max-w-[1236px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Link
            href={logo.href}
            className="flex w-fit items-center gap-3"
            aria-label={`${logo.text} home`}
          >
            {logo.imageSrc ? (
              <span className="flex size-12 items-center justify-center rounded-[14px] bg-white">
                <Image
                  src={logo.imageSrc}
                  alt=""
                  width={54}
                  height={54}
                  className="size-10 object-contain"
                />
              </span>
            ) : null}
            <span>
              <span className="block text-[15px] font-bold tracking-[-0.01em]">
                {logo.text}
              </span>
              <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-[#718095]">
                {sharedContent.brand.tagline}
              </span>
            </span>
          </Link>

          <nav aria-label={sharedContent.footer.navigationLabel}>
            <ul className="flex flex-wrap gap-x-2 gap-y-2 md:justify-center">
              {footerLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full px-3.5 py-2 text-sm text-[#9eabb9] transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-sm text-[#718095] md:text-right">{data.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
