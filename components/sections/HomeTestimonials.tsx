'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion'
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Quote,
  Star,
  X,
} from 'lucide-react'
import type { Testimonial } from '@/lib/data/testimonials'
import { homeContent } from '@/content/home'

interface HomeTestimonialsProps {
  testimonials: Testimonial[]
}

const AUTO_ADVANCE_MS = 2200
const TESTIMONIAL_PREVIEW_LENGTH = 175

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

function getTestimonialPreview(quote: string) {
  if (quote.length <= TESTIMONIAL_PREVIEW_LENGTH) {
    return { text: quote, isTruncated: false }
  }

  const shortened = quote.slice(0, TESTIMONIAL_PREVIEW_LENGTH)
  const lastWordBoundary = shortened.lastIndexOf(' ')

  return {
    text:
      lastWordBoundary > 0
        ? shortened.slice(0, lastWordBoundary)
        : shortened,
    isTruncated: true,
  }
}

/** Auto-advancing Home testimonial carousel with explicit pause and full-quote dialog. */
export function HomeTestimonials({ testimonials }: HomeTestimonialsProps) {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)
  const [isFullTestimonialOpen, setIsFullTestimonialOpen] = useState(false)
  const lastWheelTime = useRef(0)
  const canNavigate = testimonials.length > 1
  const isPaused =
    isHovered ||
    isFocusWithin ||
    isManuallyPaused ||
    isFullTestimonialOpen ||
    Boolean(shouldReduceMotion)

  const navigate = useCallback(
    (step: number) => {
      if (!canNavigate) {
        return
      }

      setDirection(step > 0 ? 1 : -1)
      setIsFullTestimonialOpen(false)
      setActiveIndex((current) =>
        wrapIndex(current + step, testimonials.length),
      )
    },
    [canNavigate, testimonials.length],
  )

  useEffect(() => {
    // Schedule one advance at a time so interactions restart a predictable interval.
    if (!canNavigate || isPaused) {
      return
    }

    const timer = window.setTimeout(() => navigate(1), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, canNavigate, isPaused, navigate])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.y) < 45 && Math.abs(info.velocity.y) < 300) {
      return
    }

    navigate(info.offset.y < 0 ? 1 : -1)
  }

  const handleWheel = (event: React.WheelEvent) => {
    // Throttle trackpad input so one gesture cannot skip several testimonials.
    if (Math.abs(event.deltaY) < 12) {
      return
    }

    const now = Date.now()
    if (now - lastWheelTime.current < 650) {
      return
    }

    lastWheelTime.current = now
    navigate(event.deltaY > 0 ? 1 : -1)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      navigate(1)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      navigate(-1)
    }
  }

  const closeFullTestimonial = () => {
    setIsFullTestimonialOpen(false)

    // The dialog restores focus to "Read more". Clear passive pause states
    // after that restoration so a fresh timer can begin unless Pause was used.
    window.setTimeout(() => {
      setIsHovered(false)
      setIsFocusWithin(false)
    }, 0)
  }

  if (testimonials.length === 0) {
    return null
  }

  const testimonial = testimonials[activeIndex]
  const preview = getTestimonialPreview(testimonial.quote)

  return (
    <section data-section-label={homeContent.testimonials.sectionLabel} className="bg-[#e0e8ef] px-5 py-20 md:py-[96px]">
      <div className="mx-auto grid max-w-[1236px] items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0064d7]">
            {homeContent.testimonials.eyebrow}
          </p>
          <h2 className="mt-4 text-[36px] font-bold leading-[1.05] tracking-[-0.035em] text-black md:text-[52px]">
            {homeContent.testimonials.title}
          </h2>
          <p className="mt-6 max-w-[520px] text-[17px] leading-8 text-[#4e4e4e]">
            {homeContent.testimonials.description}
          </p>

          <div className="mt-9 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={!canNavigate}
              aria-label={homeContent.testimonials.previousLabel}
              className="flex size-12 items-center justify-center rounded-full border border-[#9eafbe] bg-white text-[#162236] transition hover:-translate-y-0.5 hover:border-[#0064d7] hover:text-[#0064d7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronUp aria-hidden="true" size={21} />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              disabled={!canNavigate}
              aria-label={homeContent.testimonials.nextLabel}
              className="flex size-12 items-center justify-center rounded-full border border-[#9eafbe] bg-white text-[#162236] transition hover:translate-y-0.5 hover:border-[#0064d7] hover:text-[#0064d7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronDown aria-hidden="true" size={21} />
            </button>
            <button
              type="button"
              onClick={() => setIsManuallyPaused((paused) => !paused)}
              disabled={!canNavigate || Boolean(shouldReduceMotion)}
              aria-label={
                isManuallyPaused
                  ? homeContent.testimonials.resumeLabel
                  : homeContent.testimonials.pauseLabel
              }
              aria-pressed={isManuallyPaused}
              className="ml-1 flex h-12 items-center gap-2 rounded-full border border-[#9eafbe] bg-transparent px-5 text-sm font-semibold text-[#162236] transition hover:border-[#0064d7] hover:text-[#0064d7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isManuallyPaused ? (
                <Play aria-hidden="true" size={17} fill="currentColor" />
              ) : (
                <Pause aria-hidden="true" size={17} fill="currentColor" />
              )}
              {isManuallyPaused ? homeContent.testimonials.play : homeContent.testimonials.pause}
            </button>
          </div>
          <Link
            href="/testimonials"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0064d7] transition-colors hover:text-[#004da7]"
          >
            {homeContent.testimonials.archiveAction}
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={homeContent.testimonials.carouselLabel}
          tabIndex={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocusWithin(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsFocusWithin(false)
            }
          }}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#0064d7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#e0e8ef]"
        >
          <div className="pointer-events-none absolute -inset-x-3 top-5 h-full rounded-[20px] border border-[#baccdb]/70 bg-[#eff4f7] md:-inset-x-5" />
          <div className="relative h-[500px] overflow-hidden rounded-[20px] border border-[#baccdb] bg-white shadow-[0_24px_70px_rgba(22,34,54,0.12)] sm:h-[440px] lg:h-[410px]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.article
                key={testimonial.id}
                custom={direction}
                variants={{
                  enter: (slideDirection: number) => ({
                    y: slideDirection > 0 ? 110 : -110,
                    opacity: 0,
                    scale: 0.97,
                  }),
                  center: { y: 0, opacity: 1, scale: 1 },
                  exit: (slideDirection: number) => ({
                    y: slideDirection > 0 ? -110 : 110,
                    opacity: 0,
                    scale: 0.97,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.52,
                  ease: [0.22, 1, 0.36, 1],
                }}
                drag={canNavigate && !shouldReduceMotion ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
                className="flex h-full cursor-grab touch-pan-x select-none flex-col p-7 active:cursor-grabbing sm:p-10 lg:p-12"
                aria-label={`${homeContent.testimonials.itemLabel} ${activeIndex + 1} of ${testimonials.length}`}
              >
                <div className="flex items-start justify-between gap-5">
                  <Quote
                    aria-hidden="true"
                    className="text-[#0064d7]"
                    size={48}
                    strokeWidth={1.5}
                    fill="#0064d7"
                    fillOpacity={0.1}
                  />
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        aria-hidden="true"
                        size={18}
                        color="#e6b625"
                        fill={
                          index < Math.round(testimonial.rating)
                            ? '#f0c74b'
                            : 'transparent'
                        }
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold tabular-nums text-[#162236]">
                      {testimonial.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="mt-8 min-h-0 flex-1 text-[20px] font-medium leading-[1.55] tracking-[-0.012em] text-[#162236] md:text-[24px]">
                  “{preview.text}
                  {preview.isTruncated ? (
                    <>
                      …”{' '}
                      <button
                        type="button"
                        onClick={() => setIsFullTestimonialOpen(true)}
                        className="font-bold text-[#0064d7] underline decoration-[#0064d7]/30 underline-offset-4 transition-colors hover:text-[#004da7]"
                      >
                        {homeContent.testimonials.readMore}
                      </button>
                    </>
                  ) : (
                    '”'
                  )}
                </p>

                <div className="flex shrink-0 items-end justify-between gap-6 pt-5">
                  <div>
                    <h3 className="text-lg font-bold text-[#111827]">
                      {testimonial.author}
                    </h3>
                    {(testimonial.role || testimonial.company) && (
                      <p className="mt-1 text-sm text-[#617080]">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-medium tabular-nums text-[#617080]">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(testimonials.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {canNavigate && (
            <div className="mt-8 flex justify-center gap-2" aria-label={homeContent.testimonials.chooserLabel}>
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                  }}
                  aria-label={`${homeContent.testimonials.showItemLabel} ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-[#0064d7]'
                      : 'w-2 bg-[#9eafbe] hover:bg-[#617080]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Opening the full quote pauses automation without changing the active item. */}
      <Dialog
        open={isFullTestimonialOpen}
        onClose={closeFullTestimonial}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-[#06101f]/75 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              transition
              className="w-full max-w-[720px] rounded-[20px] bg-white p-7 shadow-2xl transition duration-300 ease-out data-closed:translate-y-5 data-closed:scale-95 data-closed:opacity-0 sm:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0064d7]">
                    {homeContent.testimonials.modalEyebrow}
                  </p>
                  <DialogTitle className="mt-2 text-2xl font-bold text-[#162236]">
                    {testimonial.author}
                  </DialogTitle>
                  {(testimonial.role || testimonial.company) && (
                    <p className="mt-1 text-sm text-[#687789]">
                      {[testimonial.role, testimonial.company]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeFullTestimonial}
                  aria-label={homeContent.testimonials.closeLabel}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#edf2f6] text-[#162236] transition-colors hover:bg-[#dce5ec]"
                >
                  <X aria-hidden="true" size={21} />
                </button>
              </div>

              <div className="mt-8 border-t border-[#e1e8ed] pt-8">
                <Quote
                  aria-hidden="true"
                  className="text-[#0064d7]"
                  size={40}
                  fill="#0064d7"
                  fillOpacity={0.08}
                />
                <p className="mt-5 text-[19px] leading-8 text-[#334155]">
                  “{testimonial.quote}”
                </p>
                <div className="mt-7 flex items-center gap-1" aria-label={`${testimonial.rating} ${homeContent.testimonials.ratingSuffix}`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      size={18}
                      color="#e6b625"
                      fill={
                        index < Math.round(testimonial.rating)
                          ? '#f0c74b'
                          : 'transparent'
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold tabular-nums text-[#162236]">
                    {testimonial.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </section>
  )
}
