'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/animations/gsap'
import { Button, SocialLink } from '@/components/atoms'
import { socialLinks } from '@/lib/data/social'

export function ContactSection() {
  const t = useTranslations('contact')
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')

    // API route for sending email — implement with Resend or EmailJS
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setFormState('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setFormState('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-300 text-sm'

  return (
    <section
      id="contact"
      data-testid="contact-section"
      ref={sectionRef}
      className="py-32 px-6 bg-[var(--color-bg-secondary)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <p data-reveal className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4">
          05 — {t('heading')}
        </p>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left: copy */}
          <div>
            <h2 data-reveal className="text-5xl md:text-6xl font-bold font-heading text-[var(--color-text-primary)] leading-tight mb-6">
              {t('heading')}
            </h2>
            <p data-reveal className="text-[var(--color-accent)] font-medium mb-4">
              {t('subheading')}
            </p>
            <p data-reveal className="text-[var(--color-text-muted)] leading-relaxed text-lg mb-12">
              {t('description')}
            </p>

            {/* Direct email */}
            <a
              data-reveal
              href="mailto:pato.anabalon@gmail.com"
              className="block text-2xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-12"
            >
              pato.anabalon@gmail.com
            </a>

            {/* Social links */}
            <div data-reveal>
              <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-6">
                {t('or')}
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <SocialLink key={link.platform} link={link} size="md" />
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form
            data-testid="contact-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div data-reveal>
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={inputClass}
                data-testid="contact-input-name"
              />
            </div>
            <div data-reveal>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={inputClass}
                data-testid="contact-input-email"
              />
            </div>
            <div data-reveal>
              <textarea
                placeholder={t('messagePlaceholder')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={6}
                className={`${inputClass} resize-none`}
                data-testid="contact-input-message"
              />
            </div>

            <div data-reveal>
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

            {formState === 'success' && (
              <p className="text-[var(--color-accent)] text-sm text-center font-medium">
                {t('successMessage')}
              </p>
            )}
            {formState === 'error' && (
              <p className="text-red-400 text-sm text-center">
                {t('errorMessage')}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
