'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ServiceIcon } from '@/components/sections/ServiceIcon'
import {
  getAlternatingServiceSpans,
  getMosaicDarkIndexes,
} from '@/components/sections/serviceGridLayout'
import type { Service } from '@/lib/data/services'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Check,
  CircuitBoard,
  Hammer,
  Lightbulb,
  Map,
  PenTool,
  Rocket,
  ScanSearch,
} from 'lucide-react'
import { servicesContent } from '@/content/services'

const audienceIcons = { academic: BookOpen, industrial: Boxes }
const processIcons = {
  consultation: Lightbulb,
  concept: Map,
  design: PenTool,
  prototype: Hammer,
  testing: ScanSearch,
  deployment: Rocket,
}

const roadmapOrbitPositions = [
  'lg:left-[5%] lg:top-[3%]',
  'lg:right-[5%] lg:top-[3%]',
  'lg:right-0 lg:top-[38%]',
  'lg:bottom-[3%] lg:right-[6%]',
  'lg:bottom-[3%] lg:left-[6%]',
  'lg:left-0 lg:top-[38%]',
]

const roadmapPath = 'M 425 80 A 345 345 0 1 1 424.99 80 Z'

function getServiceSpanClass(span: number) {
  if (span === 12) return 'lg:col-span-12'
  if (span === 7) return 'lg:col-span-7'
  if (span === 5) return 'lg:col-span-5'
  return 'lg:col-span-4'
}

interface ServicesPageContentProps {
  services: Service[]
}

/** Complete Services page presentation with independent visual language per section. */
export function ServicesPageContent({ services }: ServicesPageContentProps) {
  const shouldReduceMotion = useReducedMotion()
  const serviceGridSpans = getAlternatingServiceSpans(services.length)
  const darkCardIndexes = getMosaicDarkIndexes(serviceGridSpans)
  const reveal = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <div className="overflow-hidden bg-[#ecf1f5] text-[#08111f]">
      {/* Page hero keeps copy readable while artwork decorates large viewports. */}
      <section data-section-label={servicesContent.hero.sectionLabel} className="relative min-h-[620px] overflow-hidden bg-[#eaf0f4] px-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(22,34,54,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(22,34,54,.1)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />
        <div aria-hidden="true" className="absolute -right-40 top-4 size-[620px] rounded-full bg-[#64c8ef]/18 blur-[115px]" />
        <div className="relative mx-auto grid min-h-[620px] max-w-[1236px] items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <motion.div initial="hidden" animate="visible" variants={reveal} className="relative z-10 max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0064d7]">{servicesContent.hero.eyebrow}</p>
            <h1 className="mt-5 text-[44px] font-bold leading-[1.02] tracking-[-0.045em] sm:text-[56px] md:text-[68px]">
              {servicesContent.hero.title}{' '}
              <span className="bg-linear-to-r from-[#0064d7] to-[#38a4cc] bg-clip-text text-transparent">{servicesContent.hero.highlightedTitle}</span>
            </h1>
            <p className="mt-7 max-w-[700px] text-[16px] leading-8 text-[#4b5b6c] md:text-[19px]">
              {servicesContent.hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0064d7] px-7 font-semibold text-white shadow-[0_14px_35px_rgba(0,100,215,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#0055b8]">
                {servicesContent.hero.primaryAction}
                <ArrowUpRight aria-hidden="true" size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="#development-process" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#a9bbc9] bg-white/45 px-7 font-semibold text-[#162236] backdrop-blur-sm transition-colors hover:border-[#0064d7] hover:text-[#0064d7]">
                {servicesContent.hero.secondaryAction}
                <ArrowDownRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { scale: 0.94, rotate: 2 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[500px] lg:mr-[-30px]"
          >
            <div className="absolute -inset-4 rotate-3 rounded-[32px] border border-[#b8cad7]/70 bg-white/30" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/72 p-5 shadow-[0_28px_80px_rgba(22,34,54,0.13)] backdrop-blur-md md:p-8">
              <div className="mb-5 flex items-center justify-between border-b border-[#d6e0e7] pb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#718192]">
                <span>{servicesContent.hero.imageEyebrow}</span>
                <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#52cbb5]" />{servicesContent.hero.imageStatus}</span>
              </div>
              <Image src="/images/services-hero.png" alt={servicesContent.hero.imageAlt} width={500} height={496} priority className="h-auto w-full object-contain mix-blend-multiply" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capability categories use a dark visual break from surrounding sections. */}
      <section data-section-label={servicesContent.audiences.sectionLabel} className="relative bg-[#0a101d] px-5 py-20 text-white md:py-[108px]">
        <div aria-hidden="true" className="absolute left-[-180px] top-16 size-[420px] rounded-full bg-[#0064d7]/12 blur-[110px]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(88,167,255,.48) 0 1px, transparent 1px 48px), repeating-linear-gradient(45deg, rgba(88,167,255,.32) 0 1px, transparent 1px 48px)',
          }}
        />
        <div className="relative mx-auto max-w-[1236px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={reveal} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#58a7ff]">{servicesContent.audiences.eyebrow}</p>
              <h2 className="mt-4 text-[36px] font-bold leading-[1.05] tracking-[-0.035em] md:text-[52px]">{servicesContent.audiences.title}</h2>
            </div>
            <p className="max-w-[650px] text-[16px] leading-8 text-[#9facbb] md:text-[18px]">{servicesContent.audiences.description}</p>
          </motion.div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
            {servicesContent.audiences.items.map(({ key, number, title, description, accent, benefits, tags }, index) => {
              const Icon = audienceIcons[key]
              return (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={reveal}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.08 }}
                className={`group relative overflow-hidden rounded-[20px] border border-white/[0.09] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.16] md:p-10 ${index === 0 ? 'bg-[#111d2d]' : 'bg-linear-to-br from-[#111d2d] to-[#17263b]'}`}
              >
                <div className="absolute -right-20 -top-24 size-64 rounded-full opacity-[0.11] blur-3xl transition-transform duration-700 group-hover:scale-125" style={{ backgroundColor: accent }} />
                <div className="relative z-10 flex items-start justify-between gap-5">
                  <span className="text-[48px] font-black leading-none text-white/[0.07]">{number}</span>
                  <span className="flex size-14 items-center justify-center rounded-full border" style={{ color: accent, borderColor: `${accent}48`, backgroundColor: `${accent}14` }}><Icon aria-hidden="true" size={27} strokeWidth={1.8} /></span>
                </div>
                <div className="relative z-10 mt-7">
                  <h3 className="text-[28px] font-bold tracking-[-0.025em] md:text-[34px]">{title}</h3>
                  <p className="mt-3 max-w-[520px] text-[15px] leading-7 text-[#aeb9c7] md:text-[16px]">{description}</p>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>{servicesContent.audiences.benefitLabel}</p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {benefits.map((benefit) => <li key={benefit} className="flex gap-2.5 text-[13px] leading-5 text-[#c0cad5]"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full" style={{ color: accent, backgroundColor: `${accent}18` }}><Check size={11} strokeWidth={2.5} /></span>{benefit}</li>)}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {tags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-[#c5cfda]">{tag}</span>)}
                  </div>
                </div>
              </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Animated circular roadmap; reduced-motion visitors receive its static state. */}
      <section id="development-process" data-section-label={servicesContent.process.sectionLabel} className="relative scroll-mt-24 overflow-hidden bg-[#fdfdfd] px-5 py-20 md:py-[108px]">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(22,34,54,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(22,34,54,.55)_1px,transparent_1px)] [background-size:38px_38px] [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]" />
        <div aria-hidden="true" className="absolute -left-40 top-1/3 size-[440px] rounded-full bg-[#0064d7]/8 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-44 bottom-20 size-[420px] rounded-full bg-[#a984ff]/7 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-[1236px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={reveal} className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0064d7]">{servicesContent.process.eyebrow}</p>
              <h2 className="mt-4 text-[36px] font-bold leading-[1.05] tracking-[-0.035em] md:text-[52px]">{servicesContent.process.title}</h2>
              <p className="mt-5 max-w-[650px] text-[16px] leading-8 text-[#536273] md:text-[18px]">{servicesContent.process.description}</p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-full border border-[#cbd9e3] bg-white px-4 py-2.5 text-sm font-semibold text-[#536273] shadow-[0_10px_30px_rgba(22,34,54,0.06)]">
              <span className="relative flex size-2.5">
                {!shouldReduceMotion && <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#52cbb5] opacity-60" />}
                <span className="relative inline-flex size-2.5 rounded-full bg-[#52cbb5]" />
              </span>
              {servicesContent.process.stageCount}
            </div>
          </motion.div>

          <div className="relative mt-12 py-6 md:px-5 md:py-10 lg:px-10">
            <div className="relative lg:h-[850px]">
              <svg aria-hidden="true" viewBox="0 0 850 850" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 hidden h-full w-full lg:block">
                <defs>
                  <filter id="roadGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <path d={roadmapPath} fill="none" stroke="rgba(72,94,114,.32)" strokeWidth="1.5" strokeDasharray="12 18" strokeLinecap="round" strokeLinejoin="round" />
                <motion.path
                  d={roadmapPath}
                  pathLength={1}
                  fill="none"
                  stroke="#55f4eb"
                  strokeWidth="1.5"
                  strokeDasharray="0.02 0.18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#roadGlow)"
                  opacity="0.85"
                  initial={{ strokeDashoffset: 0 }}
                  animate={shouldReduceMotion ? undefined : { strokeDashoffset: [0, -1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </svg>

              <motion.div
                aria-hidden="true"
                initial={{ scaleY: shouldReduceMotion ? 1 : 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 left-[9px] top-4 w-px origin-top bg-[repeating-linear-gradient(to_bottom,rgba(72,94,114,.38)_0_8px,transparent_8px_16px)] lg:hidden"
              />
              {[18, 48, 78].map((position, index) => (
                <motion.div
                  key={position}
                  aria-hidden="true"
                  className="absolute left-[8px] h-10 w-[3px] rounded-full bg-[#55aff4] blur-[1px] lg:hidden"
                  style={{ top: `${position}%` }}
                  animate={shouldReduceMotion ? { opacity: 0.35 } : { opacity: [0.12, 0.62, 0.12] }}
                  transition={{ duration: 3.6, delay: index * 0.8, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                />
              ))}

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-1/2 top-1/2 z-[5] hidden w-[310px] -translate-x-1/2 -translate-y-1/2 text-center lg:block"
              >
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#008db5]/10 blur-[48px]" />
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#45c9e8]/40 bg-white/80 text-[#008db5] shadow-[0_16px_40px_rgba(22,34,54,0.1)]">
                  <CircuitBoard aria-hidden="true" size={29} strokeWidth={1.6} />
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[#58a7ff]">{servicesContent.process.centerEyebrow}</p>
                <h3 className="mt-3 text-[34px] font-bold leading-[1.05] tracking-[-0.04em] text-[#111827]">
                  {servicesContent.process.centerTitle} <span className="text-[#009bc4]">{servicesContent.process.centerHighlight}</span>
                </h3>
                <p className="mx-auto mt-4 max-w-[270px] text-[14px] leading-6 text-[#607183]">{servicesContent.process.centerDescription}</p>
              </motion.div>

              <div className="relative flex flex-col gap-5 pl-9 lg:block lg:h-[850px] lg:pl-0">
                {servicesContent.process.steps.map(({ key, number, shortTitle, title, copy, accent }, index) => {
                  const Icon = processIcons[key]
                  return (
                    <motion.article
                      key={number}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className={`group relative z-10 min-h-[180px] overflow-hidden rounded-[20px] border border-[#c7d5df] bg-white/92 p-5 text-[#111827] shadow-[0_18px_50px_rgba(22,34,54,0.1)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#9fc4df] hover:bg-white hover:shadow-[0_22px_60px_rgba(22,34,54,0.14)] md:p-6 lg:absolute lg:h-[190px] lg:w-[34%] ${roadmapOrbitPositions[index]}`}
                    >
                      <div className="absolute -right-14 -top-16 size-40 rounded-full opacity-[0.12] blur-3xl transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: accent }} />
                      <span className="absolute -left-[36px] top-7 size-4 rounded-full border-[4px] border-[#edf3f6] shadow-[0_0_0_3px_rgba(69,201,232,0.25)] lg:hidden" style={{ backgroundColor: accent }} />

                      <div className="relative z-10 flex items-start justify-between gap-5">
                        <span className="flex size-12 items-center justify-center rounded-[15px] border" style={{ color: accent, borderColor: `${accent}45`, backgroundColor: `${accent}16` }}><Icon aria-hidden="true" size={23} strokeWidth={1.8} /></span>
                        <span className="text-[34px] font-black leading-none text-[#162236]/[0.07]">{number}</span>
                      </div>
                      <div className="relative z-10 mt-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{number} / {shortTitle}</p>
                        <h3 className="mt-2 text-[20px] font-bold tracking-[-0.02em] md:text-[23px]">{title}</h3>
                        <p className="mt-2 max-w-[350px] text-[13px] leading-6 text-[#5e6d7d] md:text-[14px]">{copy}</p>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All published services enter the shared alternating mosaic layout. */}
      {services.length > 0 && (
      <section id="engineering-services" data-section-label={servicesContent.catalogue.sectionLabel} className="scroll-mt-24 bg-[#dfe8ef] px-5 py-20 md:py-[108px]">
        <div className="mx-auto max-w-[1236px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={reveal} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0064d7]">{servicesContent.catalogue.eyebrow}</p>
              <h2 className="mt-4 text-[36px] font-bold leading-[1.05] tracking-[-0.035em] md:text-[52px]">{servicesContent.catalogue.title}</h2>
              <p className="mt-5 max-w-[650px] text-[16px] leading-8 text-[#536273] md:text-[18px]">{servicesContent.catalogue.description}</p>
            </div>
            <Link href="/contact" className="group inline-flex w-fit items-center gap-2 border-b border-[#8199ab] pb-2 text-sm font-semibold text-[#162236] transition-colors hover:border-[#0064d7] hover:text-[#0064d7]">{servicesContent.catalogue.action} <ArrowUpRight aria-hidden="true" size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {services.map(({ id, title, icon, accent: color, description: copy }, index) => {
              const spanUnits = serviceGridSpans[index]
              const span = getServiceSpanClass(spanUnits)
              const isFeatured = spanUnits > 5
              const isDark = darkCardIndexes.has(index)
              const fillsTabletRow = services.length % 2 === 1 && index === services.length - 1
              return (
                <motion.article
                  key={id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={reveal}
                  className={`group relative overflow-hidden rounded-[20px] border p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_65px_rgba(22,34,54,0.14)] md:p-7 ${fillsTabletRow ? 'sm:col-span-2' : 'sm:col-span-1'} ${span} ${isFeatured ? 'min-h-[290px]' : 'min-h-[260px]'} ${isDark ? 'border-[#263b54] bg-[#111d2d] text-white' : 'border-[#c5d3de] bg-white text-[#111827]'}`}
                >
                  <div className="absolute -right-16 -top-20 size-56 rounded-full opacity-[0.14] blur-3xl transition-transform duration-700 group-hover:scale-125" style={{ backgroundColor: color }} />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 opacity-[0.05] ${isDark ? 'bg-[linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(22,34,54,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(22,34,54,.8)_1px,transparent_1px)]'} bg-size-[34px_34px]`}
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <span className="flex size-13 items-center justify-center rounded-[16px] border" style={{ color, borderColor: `${color}45`, backgroundColor: `${color}18` }}><ServiceIcon name={icon} aria-hidden="true" size={26} strokeWidth={1.8} /></span>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isDark ? 'text-[#91a1b5]' : 'text-[#708093]'}`}>{servicesContent.catalogue.cardLabel}</p>
                          <p className="mt-1 text-xs font-bold tabular-nums" style={{ color }}>/ {String(index + 1).padStart(2, '0')}</p>
                        </div>
                      </div>
                      <span className="mt-2 h-1 w-8 rounded-full transition-all duration-300 group-hover:w-12" style={{ backgroundColor: color }} />
                    </div>
                    <div className="mt-auto pt-8">
                      <h3 className={`font-bold leading-tight tracking-[-0.025em] ${isFeatured ? 'text-[26px] md:text-[31px]' : 'text-[21px] md:text-[24px]'}`}>{title}</h3>
                      <p className={`mt-3 max-w-[500px] text-[14px] leading-7 md:text-[15px] ${isDark ? 'text-[#aeb9c7]' : 'text-[#586779]'}`}>{copy}</p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="relative mt-16 overflow-hidden rounded-[20px] bg-[#0b1422] px-6 py-10 text-white md:px-12 md:py-14">
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(rgba(113,180,255,.75)_1.2px,transparent_1.4px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,black_78%,transparent)]" />
            <div aria-hidden="true" className="absolute -left-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[#0064d7]/22 blur-[80px]" />
            <div aria-hidden="true" className="absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[#a984ff]/15 blur-[80px]" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#58a7ff]">{servicesContent.contact.eyebrow}</p>
                <h2 className="mt-4 max-w-[650px] text-[30px] font-bold leading-tight tracking-[-0.03em] md:text-[44px]">{servicesContent.contact.title}</h2>
                <p className="mt-4 max-w-[590px] text-[15px] leading-7 text-[#aeb9c7] md:text-[17px]">{servicesContent.contact.description}</p>
                <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <Link href="/contact" className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#0064d7] px-7 font-semibold text-white shadow-[0_14px_34px_rgba(0,100,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#1475e8] hover:shadow-[0_18px_40px_rgba(0,100,215,0.32)]">{servicesContent.contact.primaryAction} <ArrowUpRight aria-hidden="true" size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
                  <Link href="#development-process" className="group inline-flex items-center gap-2 border-b border-[#62758b] pb-1.5 text-sm font-semibold text-[#b7c3d0] transition-colors hover:border-[#58a7ff] hover:text-[#67aeff]">
                    {servicesContent.contact.secondaryAction}
                    <ArrowUpRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[20px] border border-white/[0.1] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-6">
                <div aria-hidden="true" className="absolute -right-16 -top-16 size-44 rounded-full bg-[#58a7ff]/12 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#67aeff]">{servicesContent.contact.nextEyebrow}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#66798e]">{servicesContent.contact.nextLabel}</span>
                  </div>
                  <div className="mt-2">
                    {servicesContent.contact.steps.map(({ number, title, copy }, index) => (
                      <div key={number} className={`flex gap-4 py-4 ${index < 2 ? 'border-b border-white/[0.07]' : ''}`}>
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[13px] border border-[#58a7ff]/20 bg-[#102943] text-xs font-bold text-[#67aeff]">{number}</span>
                        <div>
                          <h3 className="text-sm font-bold text-[#e1e8ef]">{title}</h3>
                          <p className="mt-1 text-[13px] leading-5 text-[#8494a7]">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}
    </div>
  )
}
