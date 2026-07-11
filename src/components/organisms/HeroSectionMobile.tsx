'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/animations/gsap'
import { Icon, VortexBackground } from '@/components/atoms'

export function HeroSectionMobile() {
  const t = useTranslations('hero')
  const sectionRef = useRef<HTMLElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const chipRef = useRef<HTMLDivElement>(null)
  const patoRef = useRef<HTMLSpanElement>(null)
  const anabalonRef = useRef<HTMLSpanElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chip = chipRef.current
    const pato = patoRef.current
    const anabalon = anabalonRef.current
    const tagline = taglineRef.current
    const ctas = ctasRef.current
    if (!chip || !pato || !anabalon || !tagline || !ctas) return

    const ctaItems = ctas.querySelectorAll<HTMLElement>('button, a')
    const scrambleChars = '!<>-_/=+*^?#01'

    const split = new SplitText(tagline, { type: 'words' })

    gsap.set(chip, { autoAlpha: 0, scale: 0.9 })
    gsap.set([pato, anabalon], { autoAlpha: 0 })
    gsap.set(split.words, { y: 40, opacity: 0, color: '#00FF66' })
    gsap.set(ctaItems, { autoAlpha: 0, scale: 0.85, y: 20 })

    let ctx: gsap.Context | undefined
    let ranIntro = false

    const runIntro = () => {
      if (ranIntro) return
      ranIntro = true
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.1 })

        tl.to(chip, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
        })

        tl.set([pato, anabalon], { autoAlpha: 1 }, '+=0.05')
        tl.to(
          pato,
          {
            scrambleText: {
              text: 'Pato',
              chars: scrambleChars,
              speed: 0.5,
              revealDelay: 0.15,
            },
            duration: 1.0,
            ease: 'none',
          },
          '<'
        )
        tl.to(
          anabalon,
          {
            scrambleText: {
              text: 'Anabalon',
              chars: scrambleChars,
              speed: 0.5,
              revealDelay: 0.35,
            },
            duration: 1.1,
            ease: 'none',
          },
          '<'
        )

        tl.to(
          split.words,
          {
            y: 0,
            opacity: 1,
            color: '#94A3B8',
            duration: 0.6,
            stagger: { each: 0.08, from: 'start' },
            ease: 'sine.out',
          },
          '-=0.4'
        )

        tl.to(
          ctaItems,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          },
          '-=0.3'
        )
      }, heroContentRef.current!)

      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 2.5,
        })
      }
    }

    const fallbackId = window.setTimeout(runIntro, 3500)

    if (window.__preloaderDone) {
      runIntro()
    } else {
      window.addEventListener('preloader:done', runIntro, { once: true })
    }

    return () => {
      window.clearTimeout(fallbackId)
      window.removeEventListener('preloader:done', runIntro)
      ctx?.revert()
      split.revert()
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
      className="relative min-h-[100svh] overflow-hidden topographic-backdrop"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <VortexBackground
          className="absolute inset-0"
          position="center"
          bandHeight="100%"
          opacity={0.45}
          colors={['#10B981', '#34D399', '#F59E0B']}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
      </div>

      <div
        ref={heroContentRef}
        className="relative z-10 min-h-[100svh] flex items-center justify-center px-6 pb-24"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            ref={chipRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[rgba(16,185,129,0.06)] text-[var(--color-accent)] text-xs font-mono uppercase tracking-widest mb-8"
            style={{ opacity: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            {t('chip')}
          </div>

          <h1 className="text-[clamp(3rem,14vw,6rem)] font-bold font-heading leading-none tracking-tight text-[var(--color-text-primary)] mb-6">
            <span
              ref={patoRef}
              className="inline-block"
              style={{ opacity: 0 }}
            >
              Pato
            </span>
            <br />
            <span
              ref={anabalonRef}
              className="inline-block text-[var(--color-accent)]"
              style={{ opacity: 0 }}
            >
              Anabalon
            </span>
          </h1>

          <p
            ref={taglineRef}
            className="text-base text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('tagline')}
          </p>

          <div
            ref={ctasRef}
            className="flex flex-col items-stretch gap-3"
          >
            <button
              onClick={scrollToAbout}
              className="px-6 py-3 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-semibold shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300"
            >
              {t('scrollCta')}
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-all duration-300 font-medium"
            >
              Contact me
            </a>
          </div>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        data-testid="hero-scroll-indicator"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-text-muted)] cursor-pointer z-10"
        onClick={scrollToAbout}
      >
        <span className="text-xs font-mono uppercase tracking-widest">
          {t('scrollCta')}
        </span>
        <Icon name="arrow-down" size={16} />
      </div>
    </section>
  )
}
