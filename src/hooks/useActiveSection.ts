'use client'

import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const visibleMap = new Map<string, number>()

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibleMap.set(id, entry.intersectionRatio)
          })

          let bestId = sectionIds[0]
          let bestRatio = 0
          for (const [key, ratio] of visibleMap.entries()) {
            if (ratio > bestRatio) {
              bestRatio = ratio
              bestId = key
            }
          }
          if (bestRatio > 0) setActive(bestId)
        },
        { threshold: [0.15, 0.35, 0.55, 0.75] }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sectionIds])

  return active
}
