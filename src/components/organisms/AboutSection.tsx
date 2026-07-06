'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, ScrollTrigger } from '@/lib/animations/gsap'
import { StatCounter } from '@/components/molecules'

export function AboutSection() {
  const t = useTranslations('about')
  const sectionRef = useRef<HTMLElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )

      // Image parallax
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      data-testid="about-section"
      ref={sectionRef}
      className="py-32 px-6 bg-[var(--color-bg-light)]"
      style={
        {
          // Rebind design tokens for the light-theme surface — everything inside
          // that reads --color-text-primary etc. adapts automatically.
          '--color-text-primary': 'var(--color-text-on-light)',
          '--color-text-muted': 'var(--color-text-on-light-muted)',
          '--color-bg-secondary': 'var(--color-bg-light-alt)',
          '--color-border': 'var(--color-border-on-light)',
          '--color-accent': 'var(--color-accent-on-light)',
        } as React.CSSProperties
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <p data-reveal className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4">
          01 — {t('heading')}
        </p>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: text */}
          <div ref={textBlockRef}>
            <h2 data-reveal className="text-5xl md:text-6xl font-bold font-heading text-[var(--color-text-primary)] mb-10 leading-tight">
              {t('heading')}
            </h2>

            <div className="space-y-6">
              <p data-reveal className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                {t('bio1')}
              </p>
              <p data-reveal className="text-[var(--color-text-muted)] leading-relaxed">
                {t('bio2')}
              </p>
              <p data-reveal className="text-[var(--color-text-muted)] leading-relaxed">
                {t('bio3')}
              </p>
            </div>

            {/* Location pill */}
            <div data-reveal className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <span className="text-base">🇳🇿</span>
              <span className="text-sm text-[var(--color-text-muted)]">
                Santiago, Chile <span className="text-[var(--color-accent)]">→</span> Auckland, New Zealand
              </span>
            </div>
          </div>

          {/* Right: photo placeholder + stats */}
          <div className="space-y-8">
            {/* Photo */}
            <div
              ref={imageRef}
              className="relative rounded-3xl overflow-hidden aspect-square bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
              data-testid="about-photo"
            >
              {/* Photo placeholder — replace src with actual photo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-[var(--color-text-muted)]">
                  <div className="w-20 h-20 rounded-full bg-[var(--color-accent)] opacity-20 mx-auto mb-4" />
                  <p className="text-sm font-mono">patricio.jpg</p>
                </div>
              </div>
              {/* Accent corner */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
            </div>

            {/* Stats */}
            <div data-reveal className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <StatCounter value={18} suffix="+" label={t('yearsLabel')} />
              <StatCounter value={5} suffix="+" label={t('companiesLabel')} />
              <StatCounter value={2} label={t('awardsLabel')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
