'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/animations/gsap'
import { StatCounter } from '@/components/molecules'

export function AboutSection() {
  const t = useTranslations('about')
  const sectionRef = useRef<HTMLElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const statsCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const label = labelRef.current
    const heading = headingRef.current
    const pill = pillRef.current
    const image = imageRef.current
    const statsCard = statsCardRef.current
    if (!section || !label || !heading || !pill || !image || !statsCard) return

    const bios = Array.from(section.querySelectorAll<HTMLElement>('[data-bio]'))
    const pillArrow = pill.querySelector<HTMLElement>('[data-arrow]')
    const originalLabel = label.textContent ?? ''
    const scrambleChars = '!<>-_/=+*^?#01'

    const headingSplit = new SplitText(heading, {
      type: 'lines',
      mask: 'lines',
    })
    const bioSplits = bios.map(
      (bio) => new SplitText(bio, { type: 'words' })
    )

    // Initial hidden states
    gsap.set(headingSplit.lines, { yPercent: 110 })
    bioSplits.forEach((s) => {
      gsap.set(s.words, { filter: 'blur(8px)', opacity: 0, y: 20 })
    })
    gsap.set(pill, { autoAlpha: 0, scale: 0.95 })
    if (pillArrow) {
      gsap.set(pillArrow, {
        display: 'inline-block',
        clipPath: 'inset(0 100% 0 0)',
      })
    }
    gsap.set(image, { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(statsCard, { autoAlpha: 0, scale: 0.9 })

    const ctx = gsap.context(() => {
      // Label: scramble decode
      gsap.to(label, {
        scrambleText: {
          text: originalLabel,
          chars: scrambleChars,
          speed: 0.5,
        },
        duration: 0.7,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      })

      // H2: lines slide up from behind masks
      gsap.to(headingSplit.lines, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
      })

      // Bios: each paragraph blurs its words in — own scroll trigger,
      // so as user reads down, the next bio reveals just in time.
      bioSplits.forEach((s, i) => {
        gsap.to(s.words, {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: { trigger: bios[i], start: 'top 82%', once: true },
        })
      })

      // Pill: fade + scale, then the arrow draws in from left to right
      const pillTl = gsap.timeline({
        scrollTrigger: { trigger: pill, start: 'top 85%', once: true },
      })
      pillTl.to(pill, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      })
      if (pillArrow) {
        pillTl.to(
          pillArrow,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.55,
            ease: 'power2.inOut',
          },
          '-=0.2'
        )
      }

      // Photo: clip-path reveal from bottom to top
      gsap.to(image, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: image, start: 'top 82%', once: true },
      })

      // Stats card: scale spring — counters inside self-trigger on intersect
      gsap.to(statsCard, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: statsCard, start: 'top 85%', once: true },
      })
    }, section)

    return () => {
      ctx.revert()
      headingSplit.revert()
      bioSplits.forEach((s) => s.revert())
    }
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
        <p ref={labelRef} className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4">
          01 — {t('heading')}
        </p>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: text */}
          <div ref={textBlockRef}>
            <h2 ref={headingRef} className="text-5xl md:text-6xl font-bold font-heading text-[var(--color-text-primary)] mb-10 leading-tight">
              {t('heading')}
            </h2>

            <div className="space-y-6">
              <p data-bio className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                {t('bio1')}
              </p>
              <p data-bio className="text-[var(--color-text-muted)] leading-relaxed">
                {t('bio2')}
              </p>
              <p data-bio className="text-[var(--color-text-muted)] leading-relaxed">
                {t('bio3')}
              </p>
            </div>

            {/* Location pill */}
            <div ref={pillRef} className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <span className="text-base">🇳🇿</span>
              <span className="text-sm text-[var(--color-text-muted)]">
                Santiago, Chile <span data-arrow className="text-[var(--color-accent)]">→</span> Auckland, New Zealand
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
              <Image
                src="/images/about-me/me.jpeg"
                alt="Pato Anabalon"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority={false}
              />
              {/* Accent corner */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
            </div>

            {/* Stats */}
            <div ref={statsCardRef} className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
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
