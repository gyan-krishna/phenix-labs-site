'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { homeContent } from '@/content/home'


/** Responsive Home hero with animated robotic-hand artwork and reduced-motion support. */
export function HomeHero() {
  const shouldReduceMotion = useReducedMotion()
  const duration = shouldReduceMotion ? 0 : 0.75

  return (
    <section data-section-label={homeContent.hero.sectionLabel} className="relative min-h-[720px] overflow-hidden bg-[#eaf0f4] px-5 pb-[190px] pt-[108px] md:min-h-[710px] md:pb-[180px] md:pt-[116px] xl:min-h-[680px] xl:pb-20">
      {/* Background grid and central atmospheric glow. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(22,34,54,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(22,34,54,.11)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[45%] size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#64c8ef]/16 blur-[90px] md:size-[720px]"
      />
      {/* Wide-screen left hand. */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, x: 0 }
            : { opacity: 1, x: 0, y: [0, -7, 0] }
        }
        transition={{
          opacity: { duration: 0.8 },
          x: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 5.5, ease: 'easeInOut', repeat: Infinity },
        }}
        className="absolute -left-[30px] -top-[40px] z-[2] hidden w-[650px] xl:block"
      >
        <Image
          src="/images/home/robotic-hand.png"
          alt=""
          priority
          width={700}
          height={600}
          className="h-auto w-full rotate-[-40deg]"
          sizes="610px"
        />
      </motion.div>

      {/* Wide-screen right hand. */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, x: 0 }
            : { opacity: 1, x: 0, y: [0, 8, 0] }
        }
        transition={{
          opacity: { duration: 0.8, delay: 0.12 },
          x: { duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 6, ease: 'easeInOut', repeat: Infinity },
        }}
        className="absolute -right-[10px] top-[190px] z-[2] hidden w-[650px] xl:block"
      >
        <Image
          src="/images/home/robotic-hand.png"
          alt=""
          priority
          width={700}
          height={600}
          className="h-auto w-full rotate-[150deg]"
          sizes="650px"
        />
      </motion.div>

      {/* Hero message, calls to action, and compact capability summary. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border border-[#abc3d5]/80 bg-[#edf4f7]/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#005ec7] shadow-[0_8px_30px_rgba(22,34,54,0.06)] backdrop-blur-md sm:text-xs"
        >
          {homeContent.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[900px] text-[46px] font-bold leading-[0.96] tracking-[-0.05em] text-[#08111f] sm:text-[58px] md:mt-7 md:text-[72px] lg:text-[80px] xl:max-w-[820px]"
        >
          {homeContent.hero.title}{' '}
          <span className="bg-linear-to-r from-[#0064d7] to-[#39a8d2] bg-clip-text text-transparent">
            {homeContent.hero.highlightedTitle}
          </span>
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[660px] text-[16px] leading-7 text-[#465566] md:mt-7 md:text-[19px] md:leading-8"
        >
          {homeContent.hero.quote}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            href={homeContent.hero.primaryAction.href}
            className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0064d7] px-7 font-semibold text-white shadow-[0_14px_35px_rgba(0,100,215,0.23)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0055b8] hover:shadow-[0_18px_42px_rgba(0,100,215,0.3)] sm:w-auto"
          >
            {homeContent.hero.primaryAction.label}
            <ArrowUpRight
              aria-hidden="true"
              size={18}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href={homeContent.hero.secondaryAction.href}
            className="inline-flex h-14 w-full items-center justify-center rounded-full border border-[#9fb3c2] bg-[#edf4f7]/65 px-7 font-semibold text-[#162236] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0064d7] hover:bg-[#f4f8fa] hover:text-[#0064d7] sm:w-auto"
          >
            {homeContent.hero.secondaryAction.label}
          </Link>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#5c6d7d] md:mt-12 md:gap-x-7 md:text-sm"
        >
          {homeContent.hero.capabilities.map((capability, index) => (
            <span key={capability} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${index === 0 ? 'bg-[#0064d7]' : index === 1 ? 'bg-[#ff9a43]' : 'bg-[#a984ff]'}`}
              />
              {capability}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Compact-screen artwork layer is kept below the interactive content. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] h-[205px] xl:hidden">
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
          className="absolute -left-[70px] top-[5px] w-[430px] sm:-left-[75px] sm:-top-[5px] sm:w-[490px] md:-left-[80px] md:-top-[18px] md:w-[540px]"
        >
          <Image
            src="/images/home/robotic-hand.png"
            alt=""
            width={659}
            height={515}
            className="h-auto w-full rotate-[-9deg]"
            sizes="(max-width: 640px) 430px, 540px"
          />
        </motion.div>
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
          className="absolute -right-[75px] -top-[120px] w-[450px] sm:-right-[80px] sm:-top-[150px] sm:w-[515px] md:-right-[90px] md:-top-[180px] md:w-[570px]"
        >
          <Image
            src="/images/home/robotic-hand.png"
            alt=""
            width={659}
            height={515}
            className="h-auto w-full rotate-[170deg]"
            sizes="(max-width: 640px) 450px, 570px"
          />
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-[3] h-12 bg-linear-to-t from-[#ecf1f5] to-transparent"
      />
    </section>
  )
}
