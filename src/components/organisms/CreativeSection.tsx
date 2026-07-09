'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/animations/gsap'
import { VideoCard } from '@/components/molecules'
import { Icon } from '@/components/atoms'
import { creativeVideos } from '@/lib/data/creativeVideos'
import { skillIcons } from '@/lib/data/skillIcons'

const creativeTools = [
  { name: 'After Effects', description: 'Motion graphics & visual effects' },
  { name: 'DaVinci Resolve', description: 'Color grading & video editing' },
  { name: 'Adobe Premiere', description: 'Professional video production' },
  { name: 'Photoshop', description: 'Image editing & compositing' },
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
              <Icon name="instagram" size={18} />
              {t('viewOnInstagram')}
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>

          {/* Right: tool cards */}
          <div className="grid grid-cols-2 gap-4">
            {creativeTools.map((tool) => {
              const iconConfig = skillIcons[tool.name]
              const ToolIcon = iconConfig?.Icon
              return (
                <div
                  key={tool.name}
                  data-parallax
                  className="relative overflow-hidden p-6 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[rgba(30,41,59,0.6)] via-[var(--color-bg-secondary)] to-[rgba(16,185,129,0.05)] backdrop-blur-sm hover:border-[var(--color-accent)] hover:to-[rgba(16,185,129,0.12)] transition-all duration-300 group cursor-default"
                  data-testid={`creative-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div
                    className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(15,23,42,0.85)] border border-white/[0.06] mb-4 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    {ToolIcon && <ToolIcon size={22} color={iconConfig.color} />}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {tool.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Work samples */}
        <div className="mt-20">
          <p data-reveal className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-8 text-center">
            {t('featuredWork')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creativeVideos.map((video) => (
              <div key={video.slug} data-parallax>
                <VideoCard
                  slug={video.slug}
                  playbackId={video.playbackId}
                  aspectRatio={video.aspectRatio}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
