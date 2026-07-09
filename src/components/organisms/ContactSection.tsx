'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/animations/gsap'
import { Button, SocialLink } from '@/components/atoms'
import { socialLinks } from '@/lib/data/social'
import { companyLogos } from '@/lib/data/cv'

const ParticleField = dynamic(
  () => import('@/lib/three/ParticleField').then((m) => m.ParticleField),
  { ssr: false }
)

const COMPANY_LOGO_ROW = [
  { key: 'latam', alt: 'LATAM Airlines', width: 140 },
  { key: 'globant', alt: 'Globant', width: 120 },
  { key: 'amicar', alt: 'Amicar', width: 100 },
  { key: 'mink', alt: 'Mink', width: 90 },
  { key: 'indexa', alt: 'Indexa', width: 110 },
] as const

const NAV_SECTIONS = [
  { id: 'hero', key: 'home' },
  { id: 'about', key: 'about' },
  { id: 'experience', key: 'experience' },
  { id: 'skills', key: 'skills' },
  { id: 'creative', key: 'creative' },
  { id: 'offscreen', key: 'offScreen' },
] as const

// Field length limits — chosen for standard DB VARCHAR sizes + spam prevention
const NAME_MAX = 100
const EMAIL_MAX = 254 // RFC 5321
const MESSAGE_MAX = 2000

// Detects common HTML/script injection patterns
const INJECTION_RE =
  /<script|<\/script|<iframe|<svg[^>]*on\w+|javascript:|data:text\/html|on(error|load|click|mouseover)\s*=/i

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = 'idle' | 'sending' | 'success' | 'error'
type FieldErrors = Partial<Record<'name' | 'email' | 'message' | 'form', string>>

export function ContactSection() {
  const t = useTranslations('contact')
  const tNav = useTranslations('nav')
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const signOffRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const navListRef = useRef<HTMLUListElement>(null)
  const followListRef = useRef<HTMLUListElement>(null)
  const companiesRowRef = useRef<HTMLDivElement>(null)
  const emailCtaRef = useRef<HTMLAnchorElement>(null)

  // Counter animation targets
  const counterElRef = useRef<HTMLSpanElement>(null)
  const counterObjRef = useRef({ val: 0 })
  const counterWrapperRef = useRef<HTMLSpanElement>(null)

  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FieldErrors>({})

  // ── Entrance animations ─────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scrambleChars = '!<>-_/=+*^?#01'
    let splitHeading: SplitText | undefined
    let splitSub: SplitText | undefined
    let splitDesc: SplitText | undefined

    const ctx = gsap.context(() => {
      // Label scramble
      if (labelRef.current) {
        const original = labelRef.current.textContent ?? ''
        gsap.to(labelRef.current, {
          scrambleText: { text: original, chars: scrambleChars, speed: 0.5 },
          duration: 0.7,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        })
      }

      // H2 chars mask reveal, cascade from center
      if (headingRef.current) {
        splitHeading = new SplitText(headingRef.current, {
          type: 'chars',
          mask: 'chars',
        })
        gsap.set(splitHeading.chars, { yPercent: 110 })
        gsap.to(splitHeading.chars, {
          yPercent: 0,
          duration: 0.9,
          stagger: { from: 'center', amount: 0.5 },
          ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%', once: true },
        })
      }

      // Subheading — word wave with color shift (like Hero tagline)
      if (subheadingRef.current) {
        splitSub = new SplitText(subheadingRef.current, { type: 'words' })
        gsap.set(splitSub.words, {
          y: 30,
          opacity: 0,
          color: '#00FF66',
        })
        gsap.to(splitSub.words, {
          y: 0,
          opacity: 1,
          color: 'var(--color-accent)',
          duration: 0.6,
          stagger: { each: 0.06, from: 'start' },
          ease: 'sine.out',
          scrollTrigger: { trigger: subheadingRef.current, start: 'top 85%', once: true },
        })
      }

      // Description — word blur (like About bios)
      if (descRef.current) {
        splitDesc = new SplitText(descRef.current, { type: 'words' })
        gsap.set(splitDesc.words, {
          filter: 'blur(6px)',
          opacity: 0,
          y: 15,
        })
        gsap.to(splitDesc.words, {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: { trigger: descRef.current, start: 'top 85%', once: true },
        })
      }

      // Sign-off
      if (signOffRef.current) {
        gsap.fromTo(
          signOffRef.current,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: signOffRef.current, start: 'top 88%', once: true },
          }
        )
      }

      // Form fields — cascade from below
      if (formRef.current) {
        const fields = formRef.current.querySelectorAll<HTMLElement>('[data-form-field]')
        gsap.fromTo(
          fields,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: formRef.current, start: 'top 80%', once: true },
          }
        )
      }

      // Navigate items — slide in from LEFT
      if (navListRef.current) {
        const items = navListRef.current.querySelectorAll<HTMLElement>('li')
        gsap.fromTo(
          items,
          { autoAlpha: 0, x: -30 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: navListRef.current, start: 'top 82%', once: true },
          }
        )
      }

      // Follow items — slide in from RIGHT
      if (followListRef.current) {
        const items = followListRef.current.querySelectorAll<HTMLElement>('li')
        gsap.fromTo(
          items,
          { autoAlpha: 0, x: 30 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: followListRef.current, start: 'top 82%', once: true },
          }
        )
      }

      // Email CTA — fade + subtle scale
      if (emailCtaRef.current) {
        gsap.fromTo(
          emailCtaRef.current,
          { autoAlpha: 0, y: 20, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: emailCtaRef.current, start: 'top 90%', once: true },
          }
        )
      }

      // Companies row — logos stagger in, then release inline styles so
      // the .finale-company-logo class controls hover state cleanly.
      // Wrapper animates to autoAlpha: 1; the visible 0.6 dimming lives
      // on the child <img> via CSS, so hover can lift it to 1 cleanly.
      if (companiesRowRef.current) {
        const logos = companiesRowRef.current.querySelectorAll<HTMLElement>('[data-company-logo]')
        gsap.fromTo(
          logos,
          { autoAlpha: 0, y: 20, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: { trigger: companiesRowRef.current, start: 'top 90%', once: true },
          }
        )
      }

      // Accent bar — no entrance animation. The bar sits at the section's
      // bottom edge inside `overflow-hidden`, which combined with a scroll
      // trigger created an unreachable start position and left it hidden.
      // The bar is chrome (© · CTA · attribution) — always visible is fine.
    }, section)

    return () => {
      ctx.revert()
      splitHeading?.revert()
      splitSub?.revert()
      splitDesc?.revert()
    }
  }, [])

  // ── Character counter animation ─────────────────────────────────
  useEffect(() => {
    const target = form.message.length
    gsap.to(counterObjRef.current, {
      val: target,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterElRef.current) {
          counterElRef.current.textContent = Math.round(
            counterObjRef.current.val
          ).toString()
        }
      },
    })
    if (counterWrapperRef.current) {
      gsap.fromTo(
        counterWrapperRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)', overwrite: true }
      )
    }
  }, [form.message.length])

  // Counter color as user approaches the limit
  const counterColorClass = useMemo(() => {
    const ratio = form.message.length / MESSAGE_MAX
    if (ratio >= 0.9) return 'text-red-400'
    if (ratio >= 0.7) return 'text-amber-400'
    return 'text-[var(--color-text-muted)]'
  }, [form.message.length])

  // ── Field handlers ──────────────────────────────────────────────
  const handleChange = (
    field: 'name' | 'email' | 'message',
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field] || errors.form) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    }
  }

  const validateEmailField = () => {
    if (!form.email) return
    if (!EMAIL_RE.test(form.email)) {
      setErrors((prev) => ({ ...prev, email: t('errors.invalidEmail') }))
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Injection guard on all fields
    if (
      INJECTION_RE.test(form.name) ||
      INJECTION_RE.test(form.email) ||
      INJECTION_RE.test(form.message)
    ) {
      setErrors({ form: t('errors.invalidChars') })
      return
    }

    // Email format guard
    if (!EMAIL_RE.test(form.email)) {
      setErrors({ email: t('errors.invalidEmail') })
      return
    }

    setErrors({})
    setFormState('sending')

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-300 text-sm'
  const inputErrorClass =
    'border-red-400/60 focus:border-red-400 focus:ring-red-400/40'

  const year = new Date().getFullYear()

  const showForm = formState !== 'success'

  return (
    <section
      id="contact"
      data-testid="contact-section"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-bg-secondary)]"
    >
      {/* Ambient particle field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <ParticleField />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-24 md:pt-32 px-6">
        <p
          ref={labelRef}
          className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4"
        >
          06 — {t('heading')}
        </p>

        {/* HERO MOMENT — big statement only, no photo/signature */}
        <div className="relative flex flex-col items-center pb-12 md:pb-20">
          <h2
            ref={headingRef}
            className="text-[18vw] md:text-[16vw] lg:text-[15vw] leading-[0.9] font-heading font-bold text-center tracking-tight"
          >
            <span className="text-[var(--color-text-primary)]">Let&apos;s</span>{' '}
            <span className="text-[var(--color-accent)]">Talk</span>
          </h2>
        </div>

        {/* MIDDLE — 3 columns */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-10 lg:gap-16">
          {/* LEFT: Navigate */}
          <nav aria-label={t('navigate')} className="order-2 lg:order-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-5">
              {t('navigate')}
            </p>
            <ul
              ref={navListRef}
              className="space-y-2.5 text-lg md:text-xl font-heading font-bold uppercase tracking-tight"
            >
              {NAV_SECTIONS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document
                        .querySelector(`#${item.id}`)
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="finale-link"
                  >
                    <span className="finale-link-dash" aria-hidden="true" />
                    <span className="finale-link-text">
                      {item.key === 'home' ? 'Home' : tNav(item.key)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CENTER: subheading + description + form/success */}
          <div className="order-1 lg:order-2">
            <p
              ref={subheadingRef}
              className="text-[var(--color-accent)] font-medium mb-3"
            >
              {t('subheading')}
            </p>
            <p
              ref={descRef}
              className="text-[var(--color-text-muted)] leading-relaxed mb-2"
            >
              {t('description')}
            </p>
            <p
              ref={signOffRef}
              className="text-[var(--color-text-muted)] font-mono text-sm mb-8"
            >
              {t('signOff')}
            </p>

            {showForm ? (
              <form
                ref={formRef}
                data-testid="contact-form"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-3"
              >
                <div data-form-field>
                  <input
                    type="text"
                    placeholder={t('namePlaceholder')}
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    maxLength={NAME_MAX}
                    className={inputClass}
                    data-testid="contact-input-name"
                    disabled={formState === 'sending'}
                  />
                </div>

                <div data-form-field>
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={validateEmailField}
                    required
                    maxLength={EMAIL_MAX}
                    className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                    data-testid="contact-input-email"
                    disabled={formState === 'sending'}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1.5 text-xs text-red-400 font-mono"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div data-form-field>
                  <textarea
                    placeholder={t('messagePlaceholder')}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    rows={5}
                    maxLength={MESSAGE_MAX}
                    className={`${inputClass} resize-none`}
                    data-testid="contact-input-message"
                    disabled={formState === 'sending'}
                  />
                  <div className="mt-1.5 flex justify-end text-[10px] font-mono uppercase tracking-widest">
                    <span
                      ref={counterWrapperRef}
                      className={`inline-flex items-baseline gap-1 tabular-nums transition-colors duration-200 ${counterColorClass}`}
                    >
                      <span ref={counterElRef}>0</span>
                      <span className="opacity-60">/ {MESSAGE_MAX}</span>
                      <span className="ml-1 opacity-60">{t('counter')}</span>
                    </span>
                  </div>
                </div>

                <div data-form-field>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={formState === 'sending'}
                    className="w-full"
                    data-testid="contact-submit-button"
                  >
                    {formState === 'sending' ? t('sending') : t('sendButton')}
                  </Button>
                </div>

                {errors.form && (
                  <p className="text-red-400 text-sm text-center font-mono">
                    {errors.form}
                  </p>
                )}
                {formState === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    {t('errorMessage')}
                  </p>
                )}
              </form>
            ) : (
              <div
                data-testid="contact-success"
                className="rounded-2xl border border-[var(--color-accent)] bg-[rgba(16,185,129,0.06)] p-6 text-center"
                role="status"
                aria-live="polite"
              >
                <p className="text-[var(--color-accent)] font-medium mb-2">
                  {t('successMessage')}
                </p>
                <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest">
                  {t('successReload')}
                </p>
              </div>
            )}

            <a
              ref={emailCtaRef}
              href="mailto:pato.anabalon@gmail.com"
              className="block mt-8 text-center text-lg md:text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-300"
            >
              pato.anabalon@gmail.com
            </a>
          </div>

          {/* RIGHT: Follow */}
          <div className="order-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-5">
              {t('follow')}
            </p>
            <ul
              ref={followListRef}
              className="space-y-2.5 text-lg md:text-xl font-heading font-bold uppercase tracking-tight"
            >
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="finale-link"
                  >
                    <span className="finale-link-dash" aria-hidden="true" />
                    <span className="finale-link-text">{link.platform}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2 lg:hidden">
              {socialLinks.map((link) => (
                <SocialLink
                  key={`icon-${link.platform}`}
                  link={link}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* COMPANIES ROW */}
        <div
          ref={companiesRowRef}
          className="mt-20 md:mt-24 border-t border-[var(--color-border)] pt-10 pb-16"
        >
          <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-8">
            {t('companiesLabel')}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-around gap-8 md:gap-6">
            {COMPANY_LOGO_ROW.map((logo) => (
              <div
                key={logo.key}
                data-company-logo
                className="finale-company-logo relative h-8 md:h-10"
                style={{ width: `${logo.width}px` }}
              >
                <Image
                  src={companyLogos[logo.key]}
                  alt={logo.alt}
                  fill
                  sizes={`${logo.width}px`}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCENT BOTTOM BAR — full-bleed */}
      <div
        data-testid="finale-accent-bar"
        className="finale-accent-bar relative z-10 py-3 px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-widest"
      >
        <span>© {year} Pato Anabalon</span>
        <a
          href="mailto:pato.anabalon@gmail.com"
          className="flex items-center gap-2 font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-primary)] animate-pulse" />
          {t('openToWork')} →
        </a>
        <span>{t('madeWith')}</span>
      </div>
    </section>
  )
}
