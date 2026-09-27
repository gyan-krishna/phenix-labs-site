'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Keeps route transitions at the top while leaving hash-based section links intact. */
export function RouteScrollManager() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hash) return

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [pathname])

  return null
}
