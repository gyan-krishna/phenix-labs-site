'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { sharedContent } from '@/content/shared'

export interface ToastNoticeData {
  id: number
  type: 'success' | 'error'
  title: string
  message: string
}

interface ToastNoticeProps {
  notice: ToastNoticeData | null
  onDismiss: () => void
  duration?: number
}

/** Accessible animated notification with automatic and manual dismissal. */
export function ToastNotice({
  notice,
  onDismiss,
  duration = 3_000,
}: ToastNoticeProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!notice) return

    const timeout = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timeout)
  }, [duration, notice, onDismiss])

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[160] flex justify-end sm:right-6 sm:top-6">
      <AnimatePresence mode="wait">
        {notice ? (
          <motion.div
            key={notice.id}
            role={notice.type === 'error' ? 'alert' : 'status'}
            aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative w-full max-w-[430px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0b1726]/96 p-4 pr-12 text-white shadow-[0_22px_65px_rgba(4,13,24,0.3)] backdrop-blur-xl sm:p-5 sm:pr-14"
          >
            <div className="flex gap-3.5">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-[13px] ${
                  notice.type === 'success'
                    ? 'bg-[#42c89a]/14 text-[#62ddb1]'
                    : 'bg-[#ff6f76]/14 text-[#ff8b91]'
                }`}
              >
                {notice.type === 'success' ? (
                  <CheckCircle2 aria-hidden="true" size={21} />
                ) : (
                  <CircleAlert aria-hidden="true" size={21} />
                )}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-bold text-[#f4f8fb]">{notice.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#aebccc]">{notice.message}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label={sharedContent.feedback.dismissLabel}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-[#8494a7] transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#62aefc]"
            >
              <X aria-hidden="true" size={17} />
            </button>

            {!shouldReduceMotion ? (
              <motion.span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left ${
                  notice.type === 'success' ? 'bg-[#52d3a6]' : 'bg-[#ff747b]'
                }`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1_000, ease: 'linear' }}
              />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
