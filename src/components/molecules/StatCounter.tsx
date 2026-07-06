'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/animations/gsap'

interface StatCounterProps {
  value: number
  suffix?: string
  label: string
}

export function StatCounter({ value, suffix = '', label }: StatCounterProps) {
  const countRef = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (started || !countRef.current || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          const counter = { val: 0 }
          gsap.to(counter, {
            val: value,
            duration: 2,
            ease: 'power2.out',
            onUpdate() {
              if (countRef.current) {
                countRef.current.textContent = Math.round(counter.val).toString()
              }
            },
          })
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [value, started])

  return (
    <div data-testid="molecule-stat-counter" ref={containerRef} className="text-center">
      <div className="text-5xl md:text-6xl font-bold font-heading text-[var(--color-text-primary)] mb-2">
        <span ref={countRef}>0</span>
        <span className="text-[var(--color-accent)]">{suffix}</span>
      </div>
      <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest font-mono">
        {label}
      </p>
    </div>
  )
}
