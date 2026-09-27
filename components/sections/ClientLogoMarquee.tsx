import Image from 'next/image'
import type { ClientLogo } from '@/lib/data/clients'
import { homeContent } from '@/content/home'

interface ClientLogoMarqueeProps {
  clients: ClientLogo[]
}

export function ClientLogoMarquee({ clients }: ClientLogoMarqueeProps) {
  if (clients.length === 0) return null

  const repeatCount = Math.max(1, Math.ceil(8 / clients.length))
  const sequence = Array.from({ length: repeatCount }, (_, repeatIndex) =>
    clients.map((client) => ({ ...client, repeatIndex })),
  ).flat()
  const duration = Math.max(24, sequence.length * 3.5)

  const logoList = (duplicate: boolean) => (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4"
    >
      {sequence.map((client) => (
        <li
          key={`${duplicate ? 'duplicate' : 'primary'}-${client.id}-${client.repeatIndex}`}
          className="group flex h-[88px] w-[164px] shrink-0 items-center justify-center rounded-[16px] border border-[#d5e0e8] bg-white/90 px-5 shadow-[0_10px_30px_rgba(22,34,54,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a9c9e2] hover:shadow-[0_14px_36px_rgba(22,34,54,0.1)] md:h-[96px] md:w-[194px] md:px-7"
        >
          <div className="relative h-11 w-full">
            <Image
              src={client.logoUrl}
              alt={duplicate ? '' : `${client.name} logo`}
              fill
              className="object-contain opacity-65 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              sizes="194px"
            />
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <section data-section-label={homeContent.clients.sectionLabel} className="relative overflow-hidden py-7 md:py-9" aria-labelledby="client-logo-title">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(0,100,215,.65)_1px,transparent_1.2px)] [background-size:24px_24px]" />
      <div className="relative z-10 mb-7 px-4 md:mb-8 md:px-6.75">
        <div className="mx-auto flex max-w-[1396px] flex-col gap-2 px-6 md:flex-row md:items-end md:justify-center md:px-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0064d7]">{homeContent.clients.eyebrow}</p>
            <h2 id="client-logo-title" className="mt-2 text-[25px] font-bold tracking-[-0.03em] text-[#162236] md:text-[32px]">{homeContent.clients.title}</h2>
          </div>
        </div>
      </div>

      <div className="client-logo-marquee relative z-10 w-full overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-linear-to-r from-[#ecf1f5] to-transparent md:w-24" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-linear-to-l from-[#ecf1f5] to-transparent md:w-24" />
        <div className="client-logo-track flex w-max" style={{ animationDuration: `${duration}s` }}>
          {logoList(false)}
          {logoList(true)}
        </div>
      </div>
    </section>
  )
}
