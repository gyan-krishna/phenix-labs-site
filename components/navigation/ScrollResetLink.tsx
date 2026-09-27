'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import type {
  AnchorHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react'

type ScrollResetLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
    children: ReactNode
    onClick?: MouseEventHandler<HTMLAnchorElement>
  }

/** Resets the current page for plain internal route links, smoothly for same-route clicks. */
export function ScrollResetLink({
  children,
  href,
  onClick,
  target,
  ...props
}: ScrollResetLinkProps) {
  const pathname = usePathname()

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event)

    const isModifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    const isExternal =
      typeof href === 'string' && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)
    const hasHash = typeof href === 'string' ? href.includes('#') : Boolean(href.hash)
    const destinationPath =
      typeof href === 'string'
        ? new URL(href, window.location.href).pathname
        : href.pathname || pathname
    const isSameRoute = destinationPath === pathname

    if (
      event.defaultPrevented ||
      isModifiedClick ||
      target === '_blank' ||
      isExternal ||
      hasHash
    ) {
      return
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: isSameRoute ? 'smooth' : 'auto',
    })
  }

  return (
    <Link href={href} target={target} {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}
