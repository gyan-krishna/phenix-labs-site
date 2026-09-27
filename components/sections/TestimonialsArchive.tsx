'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { LoaderCircle, Quote, Star } from 'lucide-react'
import type {
  Testimonial,
  TestimonialsPage,
} from '@/lib/data/testimonials'
import { testimonialsContent } from '@/content/testimonials'

interface TestimonialsArchiveProps {
  initialPage: TestimonialsPage
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const initials = testimonial.author
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        delay: shouldReduceMotion ? 0 : (index % 12) * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mb-5 break-inside-avoid rounded-[20px] border border-[#c4d0db] bg-white p-7 shadow-[0_12px_45px_rgba(22,34,54,0.06)] transition-shadow hover:shadow-[0_20px_55px_rgba(22,34,54,0.12)] md:p-8"
    >
      <div className="flex items-center justify-between gap-5">
        <Quote
          aria-hidden="true"
          size={36}
          className="text-[#0064d7]"
          fill="#0064d7"
          fillOpacity={0.08}
        />
        <span
          className="flex items-center gap-1 text-sm font-semibold tabular-nums text-[#162236]"
          aria-label={`${testimonial.rating} ${testimonialsContent.archive.ratingSuffix}`}
        >
          {testimonial.rating.toFixed(1)}
          <Star
            aria-hidden="true"
            size={17}
            color="#e6b625"
            fill="#f0c74b"
          />
        </span>
      </div>

      <p className="mt-6 text-[17px] leading-8 text-[#334155]">
        “{testimonial.quote}”
      </p>

      <div className="mt-7 flex items-center gap-3 border-t border-[#e3e9ee] pt-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#162236] text-sm font-bold text-white">
          {initials}
        </span>
        <div>
          <h2 className="font-bold text-[#111827]">{testimonial.author}</h2>
          {(testimonial.role || testimonial.company) && (
            <p className="mt-0.5 text-sm text-[#687789]">
              {[testimonial.role, testimonial.company]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/** Paginated archive; inactive testimonials remain visible here by design. */
export function TestimonialsArchive({
  initialPage,
}: TestimonialsArchiveProps) {
  const [testimonials, setTestimonials] = useState(initialPage.items)
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadMore = async () => {
    if (!nextCursor || isLoading) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/testimonials?cursor=${encodeURIComponent(nextCursor)}`,
      )

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const page = (await response.json()) as TestimonialsPage
      setTestimonials((current) => [...current, ...page.items])
      setNextCursor(page.nextCursor)
    } catch {
      setError(testimonialsContent.archive.loadError)
    } finally {
      setIsLoading(false)
    }
  }

  if (testimonials.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] rounded-[20px] border border-[#c4d0db] bg-white px-6 py-16 text-center">
        <Quote
          aria-hidden="true"
          className="mx-auto text-[#0064d7]"
          size={42}
        />
        <h2 className="mt-5 text-2xl font-bold text-[#162236]">
          {testimonialsContent.archive.emptyTitle}
        </h2>
        <p className="mt-3 text-[#617080]">
          {testimonialsContent.archive.emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-7 text-sm font-medium text-[#617080]" aria-live="polite">
        {testimonialsContent.archive.showingPrefix} {testimonials.length} {testimonialsContent.archive.showingSuffix}
      </p>

      <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center" aria-live="polite">
        {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
        {nextCursor ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="inline-flex h-13 min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#0064d7] px-7 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0054b7] disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading && (
              <LoaderCircle aria-hidden="true" className="animate-spin" size={19} />
            )}
            {isLoading ? testimonialsContent.archive.loading : testimonialsContent.archive.loadMore}
          </button>
        ) : (
          <p className="text-sm font-medium text-[#617080]">
            {testimonialsContent.archive.end}
          </p>
        )}
      </div>
    </div>
  )
}
