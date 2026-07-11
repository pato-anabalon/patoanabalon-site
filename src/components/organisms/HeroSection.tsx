'use client'

import { useEffect, useState } from 'react'
import { ScrollTrigger } from '@/lib/animations/gsap'
import { HeroSectionDesktop } from './HeroSectionDesktop'
import { HeroSectionMobile } from './HeroSectionMobile'

const MOBILE_QUERY = '(max-width: 767px)'

interface HeroSectionProps {
  initialIsMobile?: boolean
}

export function HeroSection({ initialIsMobile = false }: HeroSectionProps) {
  // Seed from server UA sniff so SSR and first client render agree — no
  // post-hydrate variant swap, which was triggering a removeChild
  // NotFoundError when React tried to unmount Desktop after GSAP had
  // already mutated its DOM.
  const [isMobile, setIsMobile] = useState(initialIsMobile)

  useEffect(() => {
    // Don't reconcile against matchMedia on mount — that would swap the
    // variant right after hydration if UA sniff disagreed with the viewport,
    // reintroducing the exact unmount race we're trying to avoid. Only
    // subscribe to *changes* in the media query (real breakpoint crossings,
    // not the initial value).
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(raf)
  }, [isMobile])

  return isMobile ? <HeroSectionMobile /> : <HeroSectionDesktop />
}
