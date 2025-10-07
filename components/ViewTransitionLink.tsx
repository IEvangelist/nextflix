'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, MouseEvent } from 'react'

interface ViewTransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  [key: string]: unknown
}

export function ViewTransitionLink({ 
  href, 
  children, 
  className = '',
  onClick,
  ...props 
}: ViewTransitionLinkProps) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Don't handle if default was prevented or it's a new tab
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) {
      return
    }

    e.preventDefault()

    // Check if View Transition API is supported
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Use View Transition API
      (document as Document & { startViewTransition: (callback: () => void) => void })
        .startViewTransition(() => {
          router.push(href)
        })
    } else {
      // Fallback for browsers that don't support View Transition API
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}
