'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      data-testid="page-error"
      className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-6 py-24 font-mono"
    >
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-sm sm:text-base">
          <span className="text-[var(--color-text-muted)]">
            <span className="text-[var(--color-accent)]">{'$'}</span> {t('prompt').replace(/^\$\s?/, '')}
          </span>
          <span className="text-red-400">{t('error')}</span>
          {error.digest ? (
            <span className="text-xs text-[var(--color-text-muted)]">
              digest: <span className="text-[var(--color-accent-light)]">{error.digest}</span>
            </span>
          ) : null}
        </div>

        <div className="flex items-baseline gap-4">
          <span className="font-heading font-bold text-6xl sm:text-8xl leading-none text-red-400">
            {t('code')}
          </span>
          <span className="h-8 w-2 bg-red-400 animate-pulse" aria-hidden />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] leading-tight">
            {t('title')}
          </h1>
          <p className="text-[var(--color-text-muted)] text-base sm:text-lg leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
          <button
            type="button"
            onClick={reset}
            data-testid="error-retry-button"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-[var(--color-bg-primary)] font-medium hover:bg-[var(--color-accent-light)] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer"
          >
            <span aria-hidden>↻</span> {t('retry')}
          </button>
          <Link
            href="/"
            data-testid="error-home-link"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-6 py-3 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-all duration-300"
          >
            <span aria-hidden>›</span> {t('cta')}
          </Link>
        </div>
      </div>
    </main>
  )
}
