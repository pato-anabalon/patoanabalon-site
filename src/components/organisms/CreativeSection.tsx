'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/animations/gsap'
import { Tag } from '@/components/atoms'

const creativeTools = [
  { name: 'After Effects', icon: '🎬', description: 'Motion graphics & visual effects' },
  { name: 'DaVinci Resolve', icon: '🎞️', description: 'Color grading & video editing' },
  { name: 'Adobe Premiere', icon: '🎥', description: 'Professional video production' },
  { name: 'Photoshop', icon: '🖼️', description: 'Image editing & compositing' },
]

export function CreativeSection() {
  const t = useTranslations('creative')
  const sectionRef = useRef<HTMLElement>(null)

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

      // Parallax on tool cards
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('[data-parallax]'),
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      )
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="creative"
      data-testid="creative-section"
      ref={sectionRef}
      className="py-32 px-6 bg-[var(--color-bg-primary)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <p data-reveal className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4">
          04 — {t('heading')}
        </p>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: text */}
          <div>
            <h2 data-reveal className="text-5xl md:text-6xl font-bold font-heading text-[var(--color-text-primary)] leading-tight mb-8">
              {t('heading')}
            </h2>
            <p data-reveal className="text-[var(--color-text-muted)] leading-relaxed text-lg mb-8">
              {t('description')}
            </p>

            {/* Instagram CTA */}
            <a
              data-reveal
              href="https://www.instagram.com/pato.anabalon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 font-medium group"
              data-testid="creative-instagram-cta"
            >
              <span>📷</span>
              {t('viewOnInstagram')}
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>

          {/* Right: tool cards */}
          <div className="grid grid-cols-2 gap-4">
            {creativeTools.map((tool) => (
              <div
                key={tool.name}
                data-parallax
                className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] hover:bg-[rgba(16,185,129,0.05)] transition-all duration-300 group cursor-default"
                data-testid={`creative-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {tool.icon}
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Work samples placeholder grid */}
        <div className="mt-20">
          <p data-reveal className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-8 text-center">
            Featured work — coming soon
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                data-parallax
                className="aspect-square rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-accent)] transition-colors duration-300 group"
                data-testid={`creative-media-placeholder-${i}`}
              >
                <Tag variant="muted" className="group-hover:text-[var(--color-accent)]">
                  Media {i}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
