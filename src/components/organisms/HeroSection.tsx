'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { gsap, ScrollTrigger } from '@/lib/animations/gsap'
import { Icon } from '@/components/atoms'
import { TileSkeleton } from '@/components/molecules'

const ParticleField = dynamic(
  () => import('@/lib/three/ParticleField').then((m) => m.ParticleField),
  { ssr: false }
)

const HERO_END_SCALE = 0.36
// Index maps to grid area t1..t6. Order is layout-driven (not translation-key order):
// [0]=t1 top-left, [1]=t2 top-center, [2]=t3 spans right(rows 1-2),
// [3]=t4 spans left(rows 2-3), [4]=t5 bottom-center, [5]=t6 bottom-right
const TILE_KEYS = ['tile1', 'tile2', 'tile5', 'tile4', 'tile3', 'tile6'] as const

// Photos in public/images/hero/ — keyed by translation slug, independent of grid position.
type TileImageConfig = { src: string; position?: string }
const TILE_IMAGES: Record<(typeof TILE_KEYS)[number], TileImageConfig> = {
  tile1: { src: '/images/hero/workspace.jpeg', position: 'top' },
  tile2: { src: '/images/hero/team.jpeg' },
  tile3: { src: '/images/hero/creative.jpeg', position: 'top' },
  tile4: { src: '/images/hero/chile-nz.jpeg' },
  tile5: { src: '/images/hero/family.jpeg' },
  tile6: { src: '/images/hero/award.jpg' },
}

export function HeroSection() {
  const t = useTranslations('hero')
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroContentRef.current) return

    const elements = heroContentRef.current.querySelectorAll('[data-animate]')
    const ctx = gsap.context(() => {
      // Initial hero text stagger reveal
      gsap.fromTo(
        elements,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      )

      // Scroll indicator bob animation
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 1.5,
        })
      }
    }, heroContentRef.current)

    return () => ctx.revert()
  }, [])

  // Pinned zoom-out transition
  useEffect(() => {
    if (!sectionRef.current || !heroCardRef.current || !tilesRef.current) return

    const section = sectionRef.current
    const heroCard = heroCardRef.current
    const tilesContainer = tilesRef.current
    const tiles = tilesContainer.querySelectorAll('[data-tile]')
    const scrollIndicator = scrollIndicatorRef.current

    // Set initial tile state (hidden + scaled up slightly + offset)
    gsap.set(tiles, {
      opacity: 0,
      scale: 1.08,
      y: (i) => (i < 3 ? -40 : 40),
    })

    // Parallax offsets applied ON TOP of the section's natural upward scroll.
    // Small values (0.3–1.0 of vh) — the section already moves 100vh naturally during exit,
    // so tiles just need extra upward drift for depth.
    // Indexes match grid positions (not content): 2-row tiles get the slowest drift.
    // [0]top-left [1]top-center [2]right(2-row) [3]left(2-row) [4]bottom-center [5]bottom-right
    const parallaxSpeed = [0.55, 0.95, 0.4, 0.35, 0.8, 0.65]

    const ctx = gsap.context(() => {
      // ── Pin timeline: hero zoom-out + tiles reveal ───────────────────────
      // Pin runs only for the zoom phase; after this releases, the natural
      // scroll carries hero + tiles up while About enters from below.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(
        heroCard,
        {
          scale: HERO_END_SCALE,
          borderRadius: 24,
          ease: 'power2.inOut',
        },
        0
      )

      if (scrollIndicator) {
        tl.to(scrollIndicator, { opacity: 0, y: 20, duration: 0.4 }, 0)
      }

      tl.to(
        tiles,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'power2.out',
        },
        0.15
      )

      // ── Natural-scroll parallax exit ─────────────────────────────────────
      // Triggered by the pinSpacer's bottom moving through the viewport:
      //   'bottom bottom' fires the moment pin releases (About peeks in at bottom)
      //   'bottom top'    fires when About top reaches viewport top
      // GSAP auto-computes the scroll range, so no empty gap is possible.
      const vh = window.innerHeight

      // Hero card fades and drifts up during the first half of the exit scroll
      gsap.to(heroCard, {
        opacity: 0,
        y: -vh * 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom 55%',
          scrub: 1,
        },
      })

      // Each tile drifts up at its own rate (parallax depth)
      tiles.forEach((tile, i) => {
        gsap.to(tile, {
          y: -vh * parallaxSpeed[i],
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      data-testid="hero-section"
      ref={sectionRef}
      className="relative"
    >
      {/* Pinned viewport — contains hero card + tile grid */}
      <div
        ref={pinRef}
        data-testid="hero-pin-container"
        className="relative h-dvh overflow-hidden topographic-backdrop"
      >
        {/* Photo tile grid — revealed as hero shrinks (behind hero card)
            Layout:
              [Workspace ][Team    ][Family   ]
              [Chile→NZ  ][ hero  ][Family   ]  ← Family spans rows 1-2, Chile→NZ spans rows 2-3
              [Chile→NZ  ][Creative][Community]
        */}
        <div
          ref={tilesRef}
          data-testid="hero-tiles-grid"
          className="absolute inset-4 sm:inset-6 md:inset-8 grid gap-3 sm:gap-4 md:gap-6"
          style={{
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            gridTemplateAreas: `
              "t1 t2 t3"
              "t4 .  t3"
              "t4 t5 t6"
            `,
          }}
          aria-hidden="true"
        >
          {TILE_KEYS.map((key, i) => (
            <div
              key={key}
              data-tile={i}
              style={{ gridArea: `t${i + 1}` }}
              className="h-full w-full"
            >
              <TileSkeleton
                index={i}
                label={t(`tiles.${key}.label`)}
                hint={t(`tiles.${key}.hint`)}
                imageSrc={TILE_IMAGES[key].src}
                imagePosition={TILE_IMAGES[key].position}
                imageAlt={t(`tiles.${key}.label`)}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>

        {/* Hero card — fills viewport initially, scales down with scroll */}
        <div
          ref={heroCardRef}
          data-testid="hero-card"
          className="absolute inset-0 z-10 origin-center overflow-hidden will-change-transform"
          style={{ transformOrigin: 'center center' }}
        >
          {/* Three.js particle background */}
          <div className="absolute inset-0" aria-hidden="true">
            <ParticleField />
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
          </div>

          {/* Hero content */}
          <div
            ref={heroContentRef}
            className="relative z-10 h-full flex items-center justify-center px-6"
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* Pre-title */}
              <div
                data-animate
                className="opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[rgba(16,185,129,0.06)] text-[var(--color-accent)] text-xs font-mono uppercase tracking-widest mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                Senior Software Engineer
              </div>

              {/* Name */}
              <h1
                data-animate
                className="opacity-0 text-[clamp(3rem,10vw,8rem)] font-bold font-heading leading-none tracking-tight text-[var(--color-text-primary)] mb-6"
              >
                Patricio
                <br />
                <span className="text-[var(--color-accent)]">Anabalon</span>
              </h1>

              {/* Tagline */}
              <p
                data-animate
                className="opacity-0 text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                {t('tagline')}
              </p>

              {/* CTAs */}
              <div
                data-animate
                className="opacity-0 flex flex-wrap items-center justify-center gap-4"
              >
                <button
                  onClick={scrollToAbout}
                  className="px-8 py-4 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-semibold hover:bg-[var(--color-accent-light)] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300"
                >
                  {t('scrollCta')}
                </button>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-8 py-4 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 font-medium"
                >
                  Contact me
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            ref={scrollIndicatorRef}
            data-testid="hero-scroll-indicator"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-text-muted)] cursor-pointer group hover:text-[var(--color-accent)] transition-colors duration-300"
            onClick={scrollToAbout}
          >
            <span className="text-xs font-mono uppercase tracking-widest">
              {t('scrollCta')}
            </span>
            <Icon
              name="arrow-down"
              size={16}
              className="group-hover:text-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
