'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, Check, ListTree, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface PageSection {
  id: string
  label: string
}

const SHOW_AFTER_SCROLL = 480
const FIXED_NAV_OFFSET = 104
const MENU_CLOSE_DELAY = 360

function createSectionId(label: string, index: number) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52)

  return slug ? `section-${slug}` : `page-section-${index + 1}`
}

function getSectionLabel(section: HTMLElement, index: number) {
  const explicitLabel = section.dataset.sectionLabel
  const accessibleLabel = section.getAttribute('aria-label')
  const heading = section.querySelector<HTMLElement>('h1, h2, h3')
  const label = explicitLabel || accessibleLabel || heading?.textContent?.trim()

  return label?.replace(/\s+/g, ' ').trim() || `Section ${index + 1}`
}

/** Floating public-page navigation for section jumps and returning to the page top. */
export function ScrollNavigator() {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionListRef = useRef<HTMLElement>(null)
  const activeFrameRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sections, setSections] = useState<PageSection[]>([])
  const [activeSectionId, setActiveSectionId] = useState('')

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleMenuClose = useCallback(() => {
    cancelScheduledClose()
    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuOpen(false)
      closeTimerRef.current = null
    }, MENU_CLOSE_DELAY)
  }, [cancelScheduledClose])

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    const updateVisibility = () => {
      const visible = window.scrollY >= SHOW_AFTER_SCROLL
      setIsVisible(visible)
      if (!visible) setIsMenuOpen(false)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  useEffect(() => {
    // Wait one frame so every server-rendered page section is present in the DOM.
    const frame = window.requestAnimationFrame(() => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>('main section'),
      )
      const usedIds = new Set<string>()
      const discovered = elements.map((section, index) => {
        const label = getSectionLabel(section, index)
        let id = section.id || createSectionId(label, index)

        // Repeated headings receive a deterministic suffix so every target stays unique.
        if (usedIds.has(id)) id = `${id}-${index + 1}`
        usedIds.add(id)
        section.id = id

        return { id, label }
      })

      setSections(discovered)
      setActiveSectionId(discovered[0]?.id || '')

    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (sections.length === 0) return

    const updateActiveSection = () => {
      if (activeFrameRef.current !== null) return

      activeFrameRef.current = window.requestAnimationFrame(() => {
        const marker = window.scrollY + FIXED_NAV_OFFSET + 32
        let currentSectionId = sections[0].id

        for (const section of sections) {
          const element = document.getElementById(section.id)
          if (!element || element.offsetTop > marker) break
          currentSectionId = section.id
        }

        setActiveSectionId(currentSectionId)
        activeFrameRef.current = null
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
      if (activeFrameRef.current !== null) {
        window.cancelAnimationFrame(activeFrameRef.current)
        activeFrameRef.current = null
      }
    }
  }, [sections])

  useEffect(() => {
    if (!isMenuOpen || !activeSectionId) return

    const frame = window.requestAnimationFrame(() => {
      const list = sectionListRef.current
      const activeItem = Array.from(
        list?.querySelectorAll<HTMLElement>('[data-section-target]') || [],
      ).find((item) => item.dataset.sectionTarget === activeSectionId)
      if (!list || !activeItem) return

      const listBounds = list.getBoundingClientRect()
      const itemBounds = activeItem.getBoundingClientRect()

      if (itemBounds.top < listBounds.top) {
        list.scrollTop -= listBounds.top - itemBounds.top
      } else if (itemBounds.bottom > listBounds.bottom) {
        list.scrollTop += itemBounds.bottom - listBounds.bottom
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeSectionId, isMenuOpen])

  useEffect(() => {
    const closeWhenOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeWhenOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
    setIsMenuOpen(false)
  }, [shouldReduceMotion])

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId)
      if (!target) return

      const top = target.getBoundingClientRect().top + window.scrollY - FIXED_NAV_OFFSET
      window.scrollTo({
        top: Math.max(0, top),
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      })
      setActiveSectionId(sectionId)
      setIsMenuOpen(false)
    },
    [shouldReduceMotion],
  )

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          ref={containerRef}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.25 }}
          className="fixed bottom-5 right-4 z-[130] flex flex-col items-end gap-2 sm:bottom-7 sm:right-7"
          onMouseEnter={() => {
            cancelScheduledClose()
            if (sections.length > 1) setIsMenuOpen(true)
          }}
          onMouseLeave={scheduleMenuClose}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsMenuOpen(false)
            }
          }}
        >
          {sections.length > 1 ? (
            <div
              inert={!isMenuOpen}
              aria-hidden={!isMenuOpen}
              onMouseEnter={cancelScheduledClose}
              onMouseLeave={scheduleMenuClose}
              className={`absolute bottom-[calc(100%+10px)] right-0 w-[min(326px,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-[18px] border border-[#c6d4df] bg-[#f8fbfd]/97 p-3 shadow-[0_24px_70px_rgba(13,31,50,0.22)] backdrop-blur-xl transition duration-200 ${
                isMenuOpen
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0'
              }`}
            >
              <div className="flex items-center justify-between px-3 pb-2 pt-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#718296]">
                  On this page
                </p>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close section navigation"
                  className="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#7a8b9d] hover:bg-[#e7eef4] hover:text-[#21364b]"
                >
                  <X aria-hidden="true" size={15} />
                </button>
              </div>
              <nav
                ref={sectionListRef}
                aria-label="Page sections"
                className="max-h-[min(55vh,390px)] overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable]"
              >
                <ul className="space-y-1">
                  {sections.map((section, index) => {
                    const isActive = section.id === activeSectionId

                    return (
                      <li key={section.id}>
                        <button
                          type="button"
                          data-section-target={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left text-sm transition-[border-color,background-color,color,box-shadow] duration-200 ${
                            isActive
                              ? 'border-[#bddaf3] bg-[#e4f1ff] font-semibold text-[#075fae]'
                              : 'border-transparent text-[#465a6d] hover:border-[#cfdee9] hover:bg-[#eaf2f7] hover:text-[#0d5fa8] hover:shadow-[0_5px_15px_rgba(25,63,94,0.07)]'
                          }`}
                        >
                          <span className="w-5 shrink-0 text-[10px] font-bold tabular-nums text-[#91a0af]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{section.label}</span>
                          {isActive ? <Check aria-hidden="true" size={15} /> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          ) : null}

          <div className="flex items-center gap-2 rounded-full border border-[#c8d5df] bg-[#f8fbfd]/94 p-1.5 shadow-[0_14px_42px_rgba(14,35,55,0.18)] backdrop-blur-xl">
            {sections.length > 1 ? (
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                onFocus={() => setIsMenuOpen(true)}
                aria-label="Navigate page sections"
                aria-expanded={isMenuOpen}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#365069] transition-all hover:bg-[#e5f1fc] hover:text-[#0064d7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1683e7]"
              >
                <ListTree aria-hidden="true" size={19} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#0d65bd] text-white shadow-[0_8px_22px_rgba(0,100,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#0756a4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1683e7]"
            >
              <ArrowUp aria-hidden="true" size={19} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
