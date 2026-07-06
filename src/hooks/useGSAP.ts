'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/animations/gsap'

export function useScrollReveal<T extends Element>(
  selector: string,
  options?: Parameters<typeof import('@/lib/animations/gsap').revealOnScroll>[1]
) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = container.querySelectorAll(selector)
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: options?.y ?? 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: options?.stagger ?? 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: options?.start ?? 'top 85%',
            once: true,
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, [selector, options?.y, options?.stagger, options?.start])

  return containerRef
}

export { gsap, ScrollTrigger }
