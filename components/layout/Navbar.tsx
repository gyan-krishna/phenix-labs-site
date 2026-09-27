'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, MessageCircle, Menu, X } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import type { NavbarData } from '@/types'
import { cn } from '@/lib/utils'
import { sharedContent } from '@/content/shared'

interface NavbarProps {
  data: NavbarData
}

/** Responsive global navigation with expanded-at-top and contracted-on-scroll states. */
export function Navbar({ data }: NavbarProps) {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Separate enter/exit thresholds prevent flicker near the contraction boundary.
    setIsScrolled((current) => {
      if (latest > 34) return true
      if (latest < 12) return false
      return current
    })
  })

  useEffect(() => {
    // Restore scroll-derived state and support closing the mobile menu with Escape.
    const initialScrollFrame = window.requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 34)
    })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(initialScrollFrame)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)
  const isHomePage = pathname === '/'
  const isLinkActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <nav
      className="sticky top-0 z-50 h-[82px] w-full bg-transparent"
      aria-label={sharedContent.navigation.primaryLabel}
    >
      <motion.div
        layout
        initial={false}
        transition={{
          layout: {
            duration: shouldReduceMotion ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        className={`mx-auto overflow-hidden transition-[height,max-width,margin,border-radius,background-color,border-color,box-shadow] ease-out ${
          shouldReduceMotion ? 'duration-0' : 'duration-500'
        } ${
          isScrolled
            ? 'mt-[7px] h-[68px] max-w-[1260px] rounded-[20px] border border-white/70 bg-white/88 shadow-[0_14px_42px_rgba(22,34,54,0.14)] backdrop-blur-xl'
            : `mt-0 h-[82px] max-w-full rounded-none border-x-0 border-b border-t-0 shadow-none ${
                isHomePage
                  ? 'border-transparent bg-[#eaf0f4]'
                  : 'border-[#cfdae3]/65 bg-[#ecf1f5]'
              }`
        }`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[-76px] left-1/2 h-[128px] w-[520px] -translate-x-1/2 rounded-full bg-[#64c8ef]/24 blur-[46px] transition-opacity sm:w-[680px] ${
            shouldReduceMotion ? 'duration-0' : 'duration-500'
          } ${isHomePage && !isScrolled ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1260px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
          <Link
            href={data.logo.href}
            className="flex shrink-0 items-center gap-2.5 rounded-[14px] pr-2 transition-opacity hover:opacity-80"
            aria-label={`${data.logo.text} home`}
          >
            {data.logo.imageSrc && !logoError ? (
              <Image
                src={data.logo.imageSrc}
                alt={data.logo.text}
                width={62}
                height={58}
                className={`object-contain transition-[width,height] ${
                  shouldReduceMotion ? 'duration-0' : 'duration-500'
                } ${isScrolled ? 'h-[50px] w-[54px]' : 'h-[60px] w-[64px]'}`}
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="px-2 text-lg font-bold text-[#111827]">
                {data.logo.text}
              </span>
            )}
          </Link>
          </div>

          <div
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border p-1 transition-all lg:flex ${
              shouldReduceMotion ? 'duration-0' : 'duration-300'
            } ${
              isScrolled
                ? 'border-[#dce4eb] bg-[#eef3f6]'
                : 'border-transparent bg-transparent'
            }`}
          >
          {data.links.map((link) => {
            const isActive = isLinkActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200',
                  isActive
                    ? isScrolled
                      ? 'bg-white text-[#0064d7] shadow-[0_4px_14px_rgba(22,34,54,0.08)]'
                      : 'bg-[#0064d7]/8 text-[#0064d7]'
                    : 'text-[#596777] hover:text-[#111827]'
                )}
              >
                {link.label}
              </Link>
            )
          })}
          </div>

          <div className="flex items-center gap-2">
          {data.contactCta && (
            <Link
              href={data.contactCta.href}
              aria-current={isLinkActive(data.contactCta.href) ? 'page' : undefined}
              className={cn(
                'group hidden h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold shadow-[0_8px_22px_rgba(22,34,54,0.06)] transition-all hover:-translate-y-0.5 lg:inline-flex',
                isLinkActive(data.contactCta.href)
                  ? 'border-[#0064d7]/35 bg-[#e7f2ff] text-[#0064d7]'
                  : 'border-[#b8c8d5] bg-white/55 text-[#26374a] hover:border-[#0064d7]/45 hover:bg-white hover:text-[#0064d7]'
              )}
            >
              {data.contactCta.text}
              <MessageCircle
                aria-hidden="true"
                size={16}
                strokeWidth={1.9}
                className="text-[#278bc2] transition-transform group-hover:-rotate-6 group-hover:scale-105"
              />
            </Link>
          )}

          {data.cta && (
            <Link
              href={data.cta.href}
              target={data.cta.openInNewTab ? '_blank' : undefined}
              rel={data.cta.openInNewTab ? 'noopener noreferrer' : undefined}
              className="group hidden h-11 items-center gap-2 rounded-full bg-[#0064d7] px-5 text-sm font-semibold text-white shadow-[0_9px_24px_rgba(0,100,215,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#0055b8] lg:inline-flex"
            >
              {data.cta.text}
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          )}

          <button
            className="flex size-11 items-center justify-center rounded-[14px] border border-[#d9e2e9] bg-[#eef3f6] text-[#162236] transition-colors hover:border-[#b7c7d4] hover:text-[#0064d7] lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? sharedContent.navigation.closeMenuLabel : sharedContent.navigation.openMenuLabel}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            key="mobile-menu"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute left-3 right-3 overflow-hidden rounded-[20px] border border-white/80 bg-white/96 p-3 shadow-[0_24px_70px_rgba(22,34,54,0.18)] backdrop-blur-xl transition-[top] sm:left-5 sm:right-5 lg:hidden ${
              shouldReduceMotion ? 'duration-0' : 'duration-300'
            } ${isScrolled ? 'top-[78px]' : 'top-[84px]'}`}
          >
            <div className="flex flex-col gap-1">
              {data.links.map((link) => {
                const isActive = isLinkActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded-[14px] px-4 py-3.5 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-[#e8f2ff] text-[#0064d7]'
                        : 'text-[#445264] hover:bg-[#f0f4f7] hover:text-[#111827]'
                    )}
                  >
                    {link.label}
                    {isActive && <span className="size-2 rounded-full bg-[#0064d7]" />}
                  </Link>
                )
              })}
              {data.contactCta && (
                <Link
                  href={data.contactCta.href}
                  onClick={closeMenu}
                  aria-current={isLinkActive(data.contactCta.href) ? 'page' : undefined}
                  className={cn(
                    'mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border px-5 text-sm font-semibold transition-colors',
                    isLinkActive(data.contactCta.href)
                      ? 'border-[#acd0f1] bg-[#e8f2ff] text-[#0064d7]'
                      : 'border-[#c7d4de] bg-[#f7fafc] text-[#26374a] hover:border-[#0064d7]/40 hover:text-[#0064d7]'
                  )}
                >
                  {data.contactCta.text}
                  <MessageCircle aria-hidden="true" size={16} strokeWidth={1.9} className="text-[#278bc2]" />
                </Link>
              )}
              {data.cta && (
                <Link
                  href={data.cta.href}
                  target={data.cta.openInNewTab ? '_blank' : undefined}
                  rel={data.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={closeMenu}
                  className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#0064d7] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0055b8]"
                >
                  {data.cta.text}
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
