'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, ScrollTrigger } from '@/lib/animations/gsap'
import { CompanyCard, MilestoneCard, TileSkeleton } from '@/components/molecules'
import { experiences, companyLogos } from '@/lib/data/cv'
import { trackItems } from '@/lib/data/experienceTrack'
import type { Experience } from '@/types'

export function ExperienceSection() {
  const t = useTranslations('experience')
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !pinRef.current) return

    const section = sectionRef.current
    const track = trackRef.current
    const progress = progressRef.current

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current!.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        }
      )

      // Compute scroll distance for the horizontal track.
      // ScrollTrigger recalculates when window resizes via invalidateOnRefresh.
      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 96)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(
        track,
        {
          x: () => -getScrollDistance(),
          ease: 'none',
        },
        0
      )

      // Progress bar in sync with track
      if (progress) {
        tl.to(
          progress,
          {
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'left center',
          },
          0
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const experienceMap: Record<string, Experience> = experiences.reduce(
    (acc, e) => ({ ...acc, [e.id]: e }),
    {}
  )

  return (
    <section
      id="experience"
      data-testid="experience-section"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        // Warm, deeper dark — distinct from hero and about
        background:
          'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 60%), #0A0F1C',
      }}
    >
      {/* Aurora orbs — animated depth backdrop */}
      <div
        aria-hidden="true"
        data-testid="experience-aurora"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="exp-orb exp-orb-1" />
        <div className="exp-orb exp-orb-2" />
        <div className="exp-orb exp-orb-3" />
      </div>

      {/* Subtle grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div ref={pinRef} className="h-dvh flex flex-col">
        {/* Header */}
        <div
          ref={headerRef}
          className="pt-28 md:pt-32 pb-8 px-6 relative z-10"
        >
          <div className="max-w-7xl mx-auto">
            <p
              data-reveal
              className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4"
            >
              02 — {t('heading')}
            </p>
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <h2
                data-reveal
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--color-text-primary)] leading-tight max-w-xl"
              >
                {t('heading')}
              </h2>
              <p
                data-reveal
                className="text-[var(--color-text-muted)] max-w-sm text-sm leading-relaxed"
              >
                {t('subheading')}
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div
          className="flex-1 flex items-center relative"
          data-testid="experience-track-viewport"
        >
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-8 pl-[75vw] pr-[20vw] will-change-transform"
            style={{ width: 'max-content' }}
          >
            {trackItems.map((item, i) => {
              if (item.kind === 'company') {
                const exp = experienceMap[item.id]
                if (!exp) return null
                return (
                  <CompanyCard
                    key={`company-${item.id}-${i}`}
                    experience={exp}
                    logoSrc={companyLogos[item.id]}
                    isPresent={exp.id === 'latam'}
                  />
                )
              }

              if (item.kind === 'milestone') {
                return (
                  <MilestoneCard
                    key={`milestone-${item.slug}-${i}`}
                    slug={item.slug}
                    big={item.big}
                    year={item.year}
                    text={t(`milestones.${item.slug}`)}
                  />
                )
              }

              // photo tile skeleton — user will drop real photos later
              return (
                <div
                  key={`photo-${item.slug}-${i}`}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] h-[520px] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]"
                >
                  <TileSkeleton
                    index={item.index}
                    label={t(`photos.${item.slug}`)}
                    hint="Photo · coming soon"
                    className="h-full w-full"
                  />
                </div>
              )
            })}

            {/* End card — closing marker + hint to continue scrolling */}
            <div
              data-testid="experience-track-end"
              className="flex-shrink-0 w-[240px] sm:w-[280px] h-[520px] rounded-3xl border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                End of timeline
              </span>
              <p className="text-lg font-heading text-[var(--color-text-primary)]">
                More chapters ahead ↓
              </p>
              <span className="text-xs text-[var(--color-text-muted)]">
                Keep scrolling
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar + hint */}
        <div className="px-6 sm:px-10 lg:px-16 pb-10 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap">
              {t('trackLabel')}
            </span>
            <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)] relative overflow-hidden">
              <div
                ref={progressRef}
                className="absolute inset-0 bg-[var(--color-accent)] scale-x-0"
                style={{ transformOrigin: 'left center' }}
              />
            </div>
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap">
              {t('scrollHint')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
