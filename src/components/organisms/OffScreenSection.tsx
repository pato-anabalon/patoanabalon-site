'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/animations/gsap'
import { Icon } from '@/components/atoms'
import { Lightbox } from '@/components/molecules'
import { OFF_SCREEN_SETS } from '@/lib/data/offScreenSets'

const STORAGE_KEY = 'offScreenSetIndex'

export function OffScreenSection() {
  const t = useTranslations('offScreen')
  const tCaptions = useTranslations('offScreen.captions')

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const bentoRef = useRef<HTMLDivElement>(null)
  const shuffleBtnRef = useRef<HTMLButtonElement>(null)

  // Always start at Set 1 on both server and initial client render so
  // hydration matches; the persisted set is restored post-mount via
  // requestAnimationFrame (async to satisfy the react-hooks/set-state-in-effect
  // rule while still fixing the hydration mismatch).
  const [setIndex, setSetIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)

  // Restore the persisted set after mount (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const idx = parseInt(stored, 10)
    if (
      Number.isNaN(idx) ||
      idx < 0 ||
      idx >= OFF_SCREEN_SETS.length ||
      idx === 0
    ) {
      return
    }
    const id = requestAnimationFrame(() => setSetIndex(idx))
    return () => cancelAnimationFrame(id)
  }, [])

  // Persist the current set index for the session.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, setIndex.toString())
    }
  }, [setIndex])

  const activeSet = OFF_SCREEN_SETS[setIndex]

  // ── Entrance animations ────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let splitHeading: SplitText | undefined
    let splitSub: SplitText | undefined
    const scrambleChars = '!<>-_/=+*^?#01'

    const ctx = gsap.context(() => {
      // Label — scramble decode (signature technique)
      if (labelRef.current) {
        const original = labelRef.current.textContent ?? ''
        gsap.to(labelRef.current, {
          scrambleText: { text: original, chars: scrambleChars, speed: 0.5 },
          duration: 0.7,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        })
      }

      // H2 — char stagger with `from: 'random'` — memories emerge in no order
      if (headingRef.current) {
        splitHeading = new SplitText(headingRef.current, { type: 'chars' })
        gsap.set(splitHeading.chars, { autoAlpha: 0, y: 40, rotationZ: -10 })
        gsap.to(splitHeading.chars, {
          autoAlpha: 1,
          y: 0,
          rotationZ: 0,
          duration: 0.7,
          stagger: { from: 'random', amount: 0.6 },
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%', once: true },
        })
      }

      // Subheading — word blur wave
      if (subheadingRef.current) {
        splitSub = new SplitText(subheadingRef.current, { type: 'words' })
        gsap.set(splitSub.words, { autoAlpha: 0, filter: 'blur(6px)', y: 12 })
        gsap.to(splitSub.words, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
          scrollTrigger: { trigger: subheadingRef.current, start: 'top 82%', once: true },
        })
      }

      // Bento cards — explode from center outward
      if (bentoRef.current) {
        const cards = bentoRef.current.querySelectorAll<HTMLElement>('[data-bento-card]')
        gsap.set(cards, { autoAlpha: 0, scale: 0.85 })
        gsap.to(cards, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          stagger: { grid: [5, 4], from: 'center', amount: 0.6 },
          ease: 'back.out(1.2)',
          scrollTrigger: { trigger: bentoRef.current, start: 'top 78%', once: true },
        })
      }

      // Shuffle button — fade in last
      if (shuffleBtnRef.current) {
        gsap.fromTo(
          shuffleBtnRef.current,
          { autoAlpha: 0, y: 15 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: shuffleBtnRef.current, start: 'top 90%', once: true },
          }
        )
      }
    }, section)

    return () => {
      ctx.revert()
      splitHeading?.revert()
      splitSub?.revert()
    }
  }, [])

  // ── Shuffle transition ─────────────────────────────────────────
  // key is stable per slot, so React reuses the DOM nodes and only swaps the
  // src/labelKey props — GSAP tweens on those elements stay valid across
  // the state change. No flushSync or re-query needed.
  const handleShuffle = useCallback(() => {
    if (isShuffling || OFF_SCREEN_SETS.length <= 1) return
    setIsShuffling(true)

    const cards = bentoRef.current?.querySelectorAll<HTMLElement>('[data-bento-card]')
    if (!cards || !cards.length) {
      setIsShuffling(false)
      return
    }

    // Exit — collapse from edges to center
    gsap.to(cards, {
      autoAlpha: 0,
      scale: 0.9,
      duration: 0.25,
      stagger: { grid: [5, 4], from: 'edges', amount: 0.2 },
      ease: 'power2.in',
      onComplete: () => {
        // Swap set — same DOM nodes, new images inside
        setSetIndex((prev) => (prev + 1) % OFF_SCREEN_SETS.length)

        // Next frame: React has committed new src props, animate the same cards back in
        requestAnimationFrame(() => {
          gsap.to(cards, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.6,
            stagger: { grid: [5, 4], from: 'center', amount: 0.5 },
            ease: 'back.out(1.2)',
            onComplete: () => setIsShuffling(false),
          })
        })
      },
    })
  }, [isShuffling])

  return (
    <section
      id="offscreen"
      data-testid="offscreen-section"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-[var(--color-bg-primary)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header — label + H2 + subheading (subheading right on md+) */}
        <p
          ref={labelRef}
          className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4"
        >
          06 — {t('heading')}
        </p>
        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between mb-12">
          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--color-text-primary)] leading-tight max-w-xl"
          >
            {t('heading')}
          </h2>
          <p
            ref={subheadingRef}
            className="text-[var(--color-text-muted)] max-w-sm text-sm leading-relaxed md:text-right"
          >
            {t('subheading')}
          </p>
        </div>

        {/* Bento grid */}
        <div ref={bentoRef} className="bento-grid">
          {activeSet.photos.map((photo, i) => (
            <div
              key={photo.slot}
              data-bento-card
              className={`bento-slot bento-${photo.slot.toLowerCase()}`}
              role="button"
              tabIndex={0}
              aria-label={photo.labelKey ? tCaptions(photo.labelKey) : 'Photo'}
              onClick={() => setLightboxIndex(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLightboxIndex(i)
                }
              }}
            >
              <Image
                src={photo.src}
                alt={photo.labelKey ? tCaptions(photo.labelKey) : ''}
                fill
                sizes="(max-width: 767px) 82vw, (max-width: 1023px) 33vw, 25vw"
                className="object-cover"
                priority={i < 3}
              />
              {photo.labelKey && (
                <div className="bento-caption">
                  {tCaptions(photo.labelKey)}
                  {photo.year ? `, ${photo.year}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Shuffle button */}
        <div className="mt-10 flex justify-center">
          <button
            ref={shuffleBtnRef}
            type="button"
            className="offscreen-shuffle"
            onClick={handleShuffle}
            disabled={isShuffling}
            data-shuffling={isShuffling}
            data-testid="offscreen-shuffle"
            aria-label={t('shuffleLabel')}
          >
            <span className="offscreen-shuffle-icon" aria-hidden="true">
              <Icon name="shuffle" size={18} />
            </span>
            <span>
              {t('shuffleLabel')} · {setIndex + 1}/{OFF_SCREEN_SETS.length}
            </span>
          </button>
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={activeSet.photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  )
}
