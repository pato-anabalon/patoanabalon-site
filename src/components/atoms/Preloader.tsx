'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const LINE_KEYS = ['init', 'fonts', 'vortex', 'tiles', 'ready'] as const
const LINE_INTERVAL_MS = 130
const READY_HOLD_MS = 240
const FADE_OUT_MS = 500

type Phase = 'boot' | 'fading' | 'gone'

interface PreloaderProps {
  onComplete?: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const t = useTranslations('preloader')
  const [visibleLines, setVisibleLines] = useState(0)
  const [fontsReady, setFontsReady] = useState(
    () => typeof document === 'undefined' || !document.fonts
  )
  const [phase, setPhase] = useState<Phase>('boot')

  useEffect(() => {
    if (fontsReady) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [fontsReady])

  useEffect(() => {
    if (phase !== 'boot' || visibleLines >= LINE_KEYS.length) return
    const id = window.setTimeout(() => {
      setVisibleLines((n) => n + 1)
    }, LINE_INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [visibleLines, phase])

  useEffect(() => {
    if (phase !== 'boot' || visibleLines < LINE_KEYS.length || !fontsReady) return
    const id = window.setTimeout(() => setPhase('fading'), READY_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [visibleLines, fontsReady, phase])

  useEffect(() => {
    if (phase !== 'fading') return
    const id = window.setTimeout(() => {
      setPhase('gone')
      window.__preloaderDone = true
      window.dispatchEvent(new CustomEvent('preloader:done'))
      onComplete?.()
    }, FADE_OUT_MS)
    return () => window.clearTimeout(id)
  }, [phase, onComplete])

  useEffect(() => {
    if (phase === 'gone') return
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
    }
  }, [phase])

  if (phase === 'gone') return null

  const progress = Math.round((visibleLines / LINE_KEYS.length) * 100)
  const isFading = phase === 'fading'

  return (
    <div
      data-testid="atom-preloader"
      role="status"
      aria-live="polite"
      aria-hidden={isFading}
      className={`fixed inset-0 z-[999] flex items-center justify-center topographic-backdrop transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(16,185,129,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md px-6 font-mono text-sm">
        <div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="tracking-tight">patoanabalon@portfolio:~$</span>
        </div>

        <ul className="space-y-2 text-[var(--color-text-primary)]">
          {LINE_KEYS.map((key, i) => {
            const shown = i < visibleLines
            return (
              <li
                key={key}
                className={`flex items-center gap-3 transition-opacity duration-150 ${
                  shown ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-[var(--color-accent)] select-none">&gt;</span>
                <span className="flex-1 text-[var(--color-text-primary)]">
                  {t(`steps.${key}`)}
                </span>
                <span
                  className="text-[10px] tracking-widest uppercase text-[var(--color-accent)]"
                  aria-hidden="true"
                >
                  [ok]
                </span>
              </li>
            )
          })}
        </ul>

        {visibleLines >= LINE_KEYS.length && (
          <div className="mt-3 flex items-center gap-3 text-[var(--color-text-muted)]">
            <span className="text-[var(--color-accent)] select-none">&gt;</span>
            <span
              className="inline-block w-2 h-4 bg-[var(--color-accent)] preloader-cursor"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="mt-8">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-[var(--color-bg-secondary)]">
            <div
              className="h-full bg-[var(--color-accent)] transition-[width] duration-200 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(16,185,129,0.5)',
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>{t('bootingLabel')}</span>
            <span>{progress.toString().padStart(3, ' ')}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
