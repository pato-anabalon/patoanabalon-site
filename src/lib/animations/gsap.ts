import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

export function revealOnScroll(
  targets: string | Element | Element[],
  options?: {
    y?: number
    duration?: number
    stagger?: number
    start?: string
  }
) {
  const { y = 60, duration = 0.9, stagger = 0.12, start = 'top 85%' } = options ?? {}

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: typeof targets === 'string' ? targets : undefined,
        start,
        once: true,
      },
    }
  )
}

export function staggerReveal(
  targets: string | Element | Element[],
  options?: {
    delay?: number
    stagger?: number
    duration?: number
  }
) {
  const { delay = 0, stagger = 0.1, duration = 0.8 } = options ?? {}

  return gsap.fromTo(
    targets,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
    }
  )
}
