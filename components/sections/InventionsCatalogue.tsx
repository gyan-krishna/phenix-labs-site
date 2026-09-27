'use client'

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownAZ,
  ArrowUpRight,
  ArrowUpAZ,
  CalendarDays,
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type {
  Invention,
  InventionsPage,
  InventionSort,
} from '@/lib/data/inventions'
import { productsContent } from '@/content/products'

interface InventionsCatalogueProps {
  initialPage: InventionsPage
  initialSelectedInvention: Invention | null
}

/** Sort choices supported by both the control and cursor API. */
const sortOptions: Array<{
  value: InventionSort
  label: string
  icon: typeof CalendarArrowDown
}> = [
  { value: 'latest', label: productsContent.catalogue.sortOptions.latest, icon: CalendarArrowDown },
  { value: 'oldest', label: productsContent.catalogue.sortOptions.oldest, icon: CalendarArrowUp },
  { value: 'title-asc', label: productsContent.catalogue.sortOptions['title-asc'], icon: ArrowDownAZ },
  { value: 'title-desc', label: productsContent.catalogue.sortOptions['title-desc'], icon: ArrowUpAZ },
]

function formatCreatedAt(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

function formatInventionPeriod(invention: Invention) {
  if (invention.startDate && invention.endDate) {
    return `${formatFullDate(invention.startDate)} – ${formatFullDate(invention.endDate)}`
  }
  if (invention.startDate) return `${productsContent.catalogue.dateLabels.started} ${formatFullDate(invention.startDate)}`
  if (invention.endDate) return `${productsContent.catalogue.dateLabels.completed} ${formatFullDate(invention.endDate)}`
  return `${productsContent.catalogue.dateLabels.added} ${formatFullDate(invention.createdAt)}`
}

/** Compact catalogue card with an image carousel independent from the detail dialog. */
function InventionCard({
  invention,
  index,
  onOpen,
}: {
  invention: Invention
  index: number
  onOpen: () => void
}) {
  const shouldReduceMotion = useReducedMotion()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imageDirection, setImageDirection] = useState(1)
  const images = invention.images
  const activeImage = images[activeImageIndex]

  const showImage = (nextIndex: number) => {
    // Wrap at both ends so card image navigation remains continuous.
    if (images.length < 2) return
    setImageDirection(nextIndex > activeImageIndex ? 1 : -1)
    setActiveImageIndex((nextIndex + images.length) % images.length)
  }

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.55,
        delay: shouldReduceMotion ? 0 : (index % 9) * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[#c1ced8] bg-white text-left shadow-[0_12px_38px_rgba(22,34,54,0.07)] outline-none transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#82a9c8] hover:shadow-[0_22px_55px_rgba(22,34,54,0.13)] focus-visible:ring-2 focus-visible:ring-[#0c70df] focus-visible:ring-offset-4 focus-visible:ring-offset-[#eaf0f4]"
    >
      <div className="relative aspect-4/3 overflow-hidden border-b border-[#d0dae2] bg-[#e3ebf0]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(67,104,136,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(67,104,136,.2)_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <div aria-hidden="true" className="absolute -right-16 -top-20 size-64 rounded-full bg-[#69b8ec]/16 blur-3xl" />

        {activeImage ? (
          <AnimatePresence initial={false} custom={imageDirection} mode="popLayout">
            <motion.div
              key={`${activeImage.url}-${activeImageIndex}`}
              custom={imageDirection}
              initial={shouldReduceMotion ? false : { opacity: 0, x: imageDirection * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: imageDirection * -24 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt || invention.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-28 rounded-full border border-dashed border-[#6e91ae] bg-white/25 shadow-[0_0_0_22px_rgba(255,255,255,0.12)]" />
          </div>
        )}

        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`${productsContent.catalogue.openDetailsPrefix} ${invention.title}`}
        />

        <div className="pointer-events-none absolute right-4 top-4 z-20 flex size-10 translate-y-1 items-center justify-center rounded-full border border-white/75 bg-white/85 text-[#0c70df] opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:shadow-md">
          <ArrowUpRight aria-hidden="true" size={19} />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => showImage(activeImageIndex - 1)}
              aria-label={`${productsContent.catalogue.previousImagePrefix} ${invention.title}`}
              className="absolute left-3 top-1/2 z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-white/85 text-[#203348] shadow-sm backdrop-blur-md transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              onClick={() => showImage(activeImageIndex + 1)}
              aria-label={`${productsContent.catalogue.nextImagePrefix} ${invention.title}`}
              className="absolute right-3 top-1/2 z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-white/85 text-[#203348] shadow-sm backdrop-blur-md transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/60 bg-[#07101c]/55 px-2.5 py-2 backdrop-blur-md">
              {images.map((image, imageIndex) => (
                <button
                  key={`${image.url}-${imageIndex}`}
                  type="button"
                  onClick={() => showImage(imageIndex)}
                  aria-label={`${productsContent.catalogue.showImagePrefix} ${imageIndex + 1} ${productsContent.catalogue.imageOfLabel} ${invention.title}`}
                  aria-current={imageIndex === activeImageIndex}
                  className={`rounded-full transition-all ${
                    imageIndex === activeImageIndex
                      ? 'h-1.5 w-4 bg-white'
                      : 'size-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 cursor-pointer flex-col p-5 text-left md:p-6"
        aria-label={`${productsContent.catalogue.openDetailsPrefix} ${invention.title}`}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0c70df]">
            {productsContent.catalogue.cardEyebrow} {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs font-medium text-[#7a8997]">
            {formatCreatedAt(invention.effectiveDate)}
          </span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-[21px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101b2d] md:text-[23px]">
          {invention.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667789] md:text-[15px]">
          {invention.description || productsContent.catalogue.cardFallback}
        </p>
      </button>
    </motion.article>
  )
}

/** Full product-image workspace with thumbnails and desktop pointer magnification. */
function InventionDetailGallery({ invention }: { invention: Invention }) {
  const shouldReduceMotion = useReducedMotion()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imageDirection, setImageDirection] = useState(1)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null)
  const images = invention.images
  const activeImage = images[activeImageIndex]

  useEffect(() => {
    // Keep the active thumbnail visible in galleries wider than their scroll rail.
    activeThumbnailRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeImageIndex, shouldReduceMotion])

  const showImage = (nextIndex: number) => {
    if (images.length < 2) return
    setIsZooming(false)
    setImageDirection(nextIndex > activeImageIndex ? 1 : -1)
    setActiveImageIndex((nextIndex + images.length) % images.length)
  }

  const updateZoomPosition = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isZooming) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const rawX = ((event.clientX - bounds.left) / bounds.width) * 100
    const rawY = ((event.clientY - bounds.top) / bounds.height) * 100

    setZoomPosition({
      x: Math.min(86, Math.max(14, rawX)),
      y: Math.min(86, Math.max(14, rawY)),
    })
  }

  const beginZoom = () => {
    // Touch devices keep the normal gallery; hover zoom is enabled only with a mouse/trackpad.
    if (window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) {
      setIsZooming(true)
    }
  }

  return (
    <div className="flex h-[390px] flex-col overflow-hidden border-b border-[#c9d6df] bg-[#e8eff3] sm:h-[520px] lg:h-full lg:border-b-0 lg:border-r">
      {/* Main image stage remains unobstructed by the thumbnail navigation. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,.98),transparent_38%),radial-gradient(circle_at_82%_88%,rgba(71,160,216,.16),transparent_42%),linear-gradient(145deg,#f2f6f8_0%,#e4edf2_52%,#dce8ee_100%)]"
        />
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[64%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 blur-3xl" />

        {activeImage ? (
          <AnimatePresence initial={false} custom={imageDirection} mode="popLayout">
            <motion.div
              key={`${activeImage.url}-${activeImageIndex}`}
              custom={imageDirection}
              initial={shouldReduceMotion ? false : { opacity: 0, x: imageDirection * 42 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: imageDirection * -42 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 cursor-zoom-in"
              onMouseEnter={beginZoom}
              onMouseMove={updateZoomPosition}
              onMouseLeave={() => setIsZooming(false)}
            >
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{
                  transform: isZooming ? 'scale(1.75)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transitionDuration: shouldReduceMotion ? '0ms' : '200ms',
                }}
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt || invention.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-5 sm:p-8 lg:p-12"
                  priority
                />
              </div>
              {isZooming && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-20 hidden aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-[#0c70df]/75 bg-[#5da9ed]/10 shadow-[0_0_0_1px_rgba(255,255,255,.55),0_10px_35px_rgba(12,112,223,.13)] lg:block"
                  style={{ left: `${zoomPosition.x}%`, top: `${zoomPosition.y}%` }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles aria-hidden="true" size={54} className="text-[#6d91ad]" />
          </div>
        )}

        <span className="absolute left-4 top-4 z-20 rounded-full border border-white/75 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#40566b] shadow-sm backdrop-blur-md sm:left-5 sm:top-5">
          {productsContent.catalogue.visualRecordLabel}
        </span>

        {/* Navigator mirrors the focused portion of the magnified desktop image. */}
        {activeImage && isZooming && (
          <div className="pointer-events-none absolute right-6 top-6 z-30 hidden w-36 overflow-hidden rounded-[14px] border border-white/80 bg-[#f6f9fa]/92 p-2 shadow-[0_14px_38px_rgba(24,53,78,.18)] backdrop-blur-md lg:block xl:w-40">
            <div className="relative aspect-4/3 overflow-hidden rounded-[9px] bg-[#dfe8ed]">
              <Image src={activeImage.url} alt="" fill sizes="160px" className="object-contain p-1" />
              <span
                aria-hidden="true"
                className="absolute aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border-2 border-[#0c70df] bg-[#5da9ed]/15 shadow-[0_0_0_1px_rgba(255,255,255,.7)]"
                style={{ left: `${zoomPosition.x}%`, top: `${zoomPosition.y}%` }}
              />
            </div>
            <p className="mt-1.5 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-[#53687a]">
              {productsContent.catalogue.zoomNavigatorLabel}
            </p>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => showImage(activeImageIndex - 1)}
              aria-label={`${productsContent.catalogue.previousImagePrefix} ${invention.title}`}
              className="absolute left-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/85 text-[#203348] shadow-md backdrop-blur-md transition hover:bg-white lg:left-6"
            >
              <ChevronLeft aria-hidden="true" size={21} />
            </button>
            <button
              type="button"
              onClick={() => showImage(activeImageIndex + 1)}
              aria-label={`${productsContent.catalogue.nextImagePrefix} ${invention.title}`}
              className="absolute right-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/85 text-[#203348] shadow-md backdrop-blur-md transition hover:bg-white lg:right-6"
            >
              <ChevronRight aria-hidden="true" size={21} />
            </button>
          </>
        )}
      </div>

      {/* Separate scrollable thumbnail region for arbitrarily sized galleries. */}
      {images.length > 1 && (
        <div className="shrink-0 border-t border-[#c7d4dd] bg-[#f4f7f9] px-3 py-2.5 sm:px-4">
          <div className="mx-auto flex w-full max-w-[760px] min-w-0 items-center gap-2.5">
            <span className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#16283a] px-2 text-[10px] font-bold tabular-nums text-white">
              {activeImageIndex + 1}/{images.length}
            </span>
            <div className="invention-thumbnail-strip flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto pb-1">
              {images.map((image, imageIndex) => (
                <button
                  key={`${image.url}-${imageIndex}`}
                  ref={imageIndex === activeImageIndex ? activeThumbnailRef : null}
                  type="button"
                  onClick={() => showImage(imageIndex)}
                  aria-label={`${productsContent.catalogue.showImagePrefix} ${imageIndex + 1} ${productsContent.catalogue.imageOfLabel} ${invention.title}`}
                  aria-current={imageIndex === activeImageIndex}
                  className={`relative size-12 shrink-0 snap-center overflow-hidden rounded-[10px] border-2 transition sm:size-14 ${
                    imageIndex === activeImageIndex
                      ? 'border-[#0c70df] shadow-[0_0_0_2px_rgba(12,112,223,.12)]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={image.url} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function InventionsCatalogue({
  initialPage,
  initialSelectedInvention,
}: InventionsCatalogueProps) {
  // Search, sort, cursor, and dialog state are intentionally owned by the catalogue.
  const [inventions, setInventions] = useState(initialPage.items)
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor)
  const [total, setTotal] = useState(initialPage.total)
  const [query, setQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [sort, setSort] = useState<InventionSort>('latest')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [selectedInvention, setSelectedInvention] = useState<Invention | null>(
    initialSelectedInvention,
  )
  const selectedIndex = selectedInvention
    ? inventions.findIndex((item) => item.id === selectedInvention.id)
    : -1

  useEffect(() => {
    // Browser back/forward actions must reopen or close the deep-linked detail item.
    const handleHistoryNavigation = () => {
      const inventionId = new URL(window.location.href).searchParams.get(
        'invention',
      )

      if (!inventionId) {
        setSelectedInvention(null)
        return
      }

      const loadedInvention = inventions.find((item) => item.id === inventionId)
      if (loadedInvention) setSelectedInvention(loadedInvention)
    }

    window.addEventListener('popstate', handleHistoryNavigation)
    return () => window.removeEventListener('popstate', handleHistoryNavigation)
  }, [inventions])

  const requestPage = async ({
    cursor,
    search,
    nextSort,
  }: {
    cursor?: string
    search: string
    nextSort: InventionSort
  }) => {
    // Centralized API URL creation keeps all collection refresh paths equivalent.
    const params = new URLSearchParams({ sort: nextSort })
    if (search) params.set('search', search)
    if (cursor) params.set('cursor', cursor)

    const response = await fetch(`/api/inventions?${params.toString()}`)
    if (!response.ok) throw new Error('Request failed')
    return (await response.json()) as InventionsPage
  }

  const refreshCollection = async (search: string, nextSort: InventionSort) => {
    // Starting a new result set invalidates the currently selected catalogue context.
    setSelectedInvention(null)
    setIsRefreshing(true)
    setError('')

    try {
      const page = await requestPage({ search, nextSort })
      setInventions(page.items)
      setNextCursor(page.nextCursor)
      setTotal(page.total)
      setActiveSearch(search)
    } catch {
      setError(productsContent.catalogue.updateError)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void refreshCollection(query.trim(), sort)
  }

  const clearSearch = () => {
    setQuery('')
    void refreshCollection('', sort)
  }

  const handleSort = (nextSort: InventionSort) => {
    setSort(nextSort)
    void refreshCollection(activeSearch, nextSort)
  }

  const loadMore = async () => {
    // Cursor pages append without discarding items already rendered.
    if (!nextCursor || isLoadingMore) return

    setIsLoadingMore(true)
    setError('')

    try {
      const page = await requestPage({
        cursor: nextCursor,
        search: activeSearch,
        nextSort: sort,
      })
      setInventions((current) => [...current, ...page.items])
      setNextCursor(page.nextCursor)
      setTotal(page.total)
    } catch {
      setError(productsContent.catalogue.loadError)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const showAdjacentInvention = (offset: number) => {
    const nextIndex = selectedIndex + offset
    if (nextIndex < 0 || nextIndex >= inventions.length) return
    const invention = inventions[nextIndex]
    setSelectedInvention(invention)
    // Replace history while browsing inside the dialog to avoid one entry per item.
    window.history.replaceState(
      null,
      '',
      `/products?invention=${encodeURIComponent(invention.id)}`,
    )
  }

  const openInvention = (invention: Invention) => {
    setSelectedInvention(invention)
    // Opening from the catalogue creates a shareable, back-button-aware deep link.
    window.history.pushState(
      null,
      '',
      `/products?invention=${encodeURIComponent(invention.id)}`,
    )
  }

  const closeInvention = () => {
    setSelectedInvention(null)
    window.history.replaceState(null, '', '/products')
  }

  return (
    <div>
      {/* Search and stable project-date sorting controls. */}
      <div className="rounded-[20px] border border-[#c7d4df] bg-white/80 p-3 shadow-[0_16px_50px_rgba(22,34,54,0.08)] backdrop-blur-md md:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={handleSearch} className="relative flex min-w-0 flex-1">
            <Search
              aria-hidden="true"
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#718091]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={productsContent.catalogue.searchPlaceholder}
              aria-label={productsContent.catalogue.searchLabel}
              className="h-13 min-w-0 flex-1 rounded-full border border-[#d2dce4] bg-[#f4f7f9] pl-12 pr-12 text-sm text-[#162236] outline-none transition focus:border-[#4f98df] focus:bg-white focus:ring-4 focus:ring-[#0064d7]/8"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={productsContent.catalogue.clearSearchLabel}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#718091] transition hover:bg-[#e5ebf0] hover:text-[#162236]"
              >
                <X aria-hidden="true" size={16} />
              </button>
            )}
          </form>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void refreshCollection(query.trim(), sort)}
              disabled={isRefreshing}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#0c70df] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#075fbe] disabled:cursor-wait disabled:opacity-65 lg:hidden"
            >
              {isRefreshing && <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />}
              {productsContent.catalogue.searchAction}
            </button>

            <label className="relative flex h-13 min-w-[190px] items-center rounded-full border border-[#d2dce4] bg-[#f4f7f9] px-4">
              {(() => {
                const SortIcon = sortOptions.find((option) => option.value === sort)?.icon || CalendarArrowDown
                return <SortIcon aria-hidden="true" size={18} className="shrink-0 text-[#0064d7]" />
              })()}
              <span className="sr-only">{productsContent.catalogue.sortLabel}</span>
              <select
                value={sort}
                onChange={(event) => handleSort(event.target.value as InventionSort)}
                className="h-full w-full cursor-pointer appearance-none bg-transparent pl-3 pr-5 text-sm font-semibold text-[#26374a] outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-4 text-xs text-[#718091]">
                ⌄
              </span>
            </label>

            <button
              type="button"
              onClick={() => void refreshCollection(query.trim(), sort)}
              disabled={isRefreshing}
              className="hidden h-13 items-center justify-center gap-2 rounded-full bg-[#0c70df] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#075fbe] disabled:cursor-wait disabled:opacity-65 lg:inline-flex"
            >
              {isRefreshing && <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />}
              {productsContent.catalogue.searchAction}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-[#5d6d7e]" aria-live="polite">
          {isRefreshing
            ? productsContent.catalogue.updating
            : `${total} ${total === 1 ? productsContent.catalogue.resultNoun : productsContent.catalogue.resultNounPlural}${activeSearch ? ` ${productsContent.catalogue.matchingLabel} “${activeSearch}”` : ''}`}
        </p>
        <p className="text-xs uppercase tracking-[0.14em] text-[#83909d]">
          {productsContent.catalogue.showingLabel} {inventions.length} {productsContent.catalogue.ofLabel} {total}
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Responsive results, empty state, and retry behavior. */}
      {inventions.length > 0 ? (
        <div className={`mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 ${isRefreshing ? 'pointer-events-none opacity-45' : ''}`}>
          {inventions.map((invention, index) => (
            <InventionCard
              key={invention.id}
              invention={invention}
              index={index}
              onOpen={() => openInvention(invention)}
            />
          ))}
        </div>
      ) : !isRefreshing ? (
        <div className="mt-8 rounded-[20px] border border-[#c7d4df] bg-white px-6 py-20 text-center">
          <Sparkles aria-hidden="true" size={42} className="mx-auto text-[#0064d7]" />
          <h2 className="mt-5 text-2xl font-bold text-[#162236]">
            {activeSearch ? productsContent.catalogue.noSearchTitle : productsContent.catalogue.emptyTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[#617080]">
            {activeSearch
              ? productsContent.catalogue.noSearchDescription
              : productsContent.catalogue.emptyDescription}
          </p>
          {activeSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="mt-7 inline-flex h-12 items-center rounded-full bg-[#0064d7] px-6 text-sm font-semibold text-white"
            >
              {productsContent.catalogue.clearSearchAction}
            </button>
          )}
        </div>
      ) : null}

      {inventions.length > 0 && (
        <div className="mt-14 flex flex-col items-center" aria-live="polite">
          {nextCursor ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore || isRefreshing}
              className="inline-flex h-13 min-w-[210px] items-center justify-center gap-2 rounded-full border border-[#9eb7cc] bg-white px-7 font-semibold text-[#24364a] shadow-[0_10px_30px_rgba(22,34,54,0.07)] transition hover:-translate-y-0.5 hover:border-[#0064d7]/55 hover:text-[#0064d7] disabled:cursor-wait disabled:opacity-65"
            >
              {isLoadingMore && <LoaderCircle aria-hidden="true" size={19} className="animate-spin" />}
              {isLoadingMore ? productsContent.catalogue.loadingMore : productsContent.catalogue.loadMore}
            </button>
          ) : (
            <p className="text-sm font-medium text-[#687789]">
              {productsContent.catalogue.end}
            </p>
          )}
        </div>
      )}

      {/* Deep-linkable bottom sheet on mobile and full workspace on desktop. */}
      <Dialog
        open={Boolean(selectedInvention)}
        onClose={closeInvention}
        className="relative z-[110]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-[#06101f]/72 backdrop-blur-[3px] transition duration-300 data-closed:opacity-0 sm:top-[82px]"
        />
        <div className="fixed inset-0 flex items-end overflow-hidden pt-10 sm:top-[82px] sm:items-stretch sm:p-4">
          {selectedInvention && (
            <DialogPanel
              transition
              className="mx-auto flex h-full w-full flex-col overflow-hidden rounded-t-[20px] border border-white/80 bg-[#f4f7f9] shadow-[0_28px_90px_rgba(3,10,20,0.34)] transition duration-300 ease-out data-closed:translate-y-full sm:rounded-[20px] sm:data-closed:translate-y-4 sm:data-closed:scale-[0.985] sm:data-closed:opacity-0"
            >
              <header className="relative z-20 flex min-h-[72px] shrink-0 items-center justify-between gap-4 border-b border-[#d3dde5] bg-[#f8fafb] px-5 sm:px-7">
                <span aria-hidden="true" className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#b7c4cf] sm:hidden" />
                <div className="flex items-center gap-2">
                  <div className="mr-2 hidden sm:block">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7b8997]">
                      {productsContent.catalogue.workspaceEyebrow}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[#263b4e]">
                      {productsContent.catalogue.workspaceTitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showAdjacentInvention(-1)}
                    disabled={selectedIndex <= 0}
                    aria-label={productsContent.catalogue.previousLabel}
                    className="flex size-10 items-center justify-center rounded-[13px] border border-[#d0dae2] bg-white text-[#33485c] transition hover:border-[#8eb0cb] hover:text-[#0c70df] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronLeft aria-hidden="true" size={19} />
                  </button>
                  <button
                    type="button"
                    onClick={() => showAdjacentInvention(1)}
                    disabled={selectedIndex < 0 || selectedIndex >= inventions.length - 1}
                    aria-label={productsContent.catalogue.nextLabel}
                    className="flex size-10 items-center justify-center rounded-[13px] border border-[#d0dae2] bg-white text-[#33485c] transition hover:border-[#8eb0cb] hover:text-[#0c70df] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronRight aria-hidden="true" size={19} />
                  </button>
                  <span className="ml-1 hidden text-xs font-semibold tabular-nums text-[#758493] md:block">
                    {selectedIndex >= 0
                      ? `${selectedIndex + 1} of ${inventions.length}`
                      : productsContent.catalogue.featuredLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeInvention}
                  aria-label={productsContent.catalogue.closeLabel}
                  className="flex size-10 items-center justify-center rounded-[13px] bg-[#e7edf2] text-[#24384b] transition hover:bg-[#d9e4eb]"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto overscroll-contain lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)] lg:overflow-hidden">
                <InventionDetailGallery
                  key={selectedInvention.id}
                  invention={selectedInvention}
                />

                <div className="p-6 sm:p-9 sm:pb-12 lg:overflow-y-auto lg:p-10 xl:p-14">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0c70df]">
                      {productsContent.catalogue.detailsEyebrow}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#778696]">
                      <CalendarDays aria-hidden="true" size={15} />
                      {formatInventionPeriod(selectedInvention)}
                    </span>
                  </div>
                  <DialogTitle className="mt-4 max-w-[650px] text-[32px] font-bold leading-[1.04] tracking-[-0.045em] text-[#101b2d] sm:text-[44px] xl:text-[52px]">
                    {selectedInvention.title}
                  </DialogTitle>

                  <div className="relative mt-9 border-t border-[#d3dde5] pt-8 sm:pl-7">
                    <span aria-hidden="true" className="absolute bottom-0 left-0 top-8 hidden w-[3px] rounded-full bg-linear-to-b from-[#0c70df] via-[#55a9df] to-transparent sm:block" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-[#405468]">
                      {productsContent.catalogue.aboutTitle}
                    </h3>
                    <p className="mt-4 whitespace-pre-line text-[16px] leading-8 text-[#516476]">
                      {selectedInvention.description || productsContent.catalogue.detailFallback}
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          )}
        </div>
      </Dialog>
    </div>
  )
}
