import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <main
      data-testid="page-not-found"
      className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-6 py-24 font-mono"
    >
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-sm sm:text-base">
          <span className="text-[var(--color-text-muted)]">
            <span className="text-[var(--color-accent)]">{'$'}</span> {t('prompt').replace(/^\$\s?/, '')}
          </span>
          <span className="text-[var(--color-accent-light)]">{t('error')}</span>
        </div>

        <div className="flex items-baseline gap-4">
          <span className="font-heading font-bold text-6xl sm:text-8xl leading-none text-[var(--color-accent)]">
            {t('code')}
          </span>
          <span className="h-8 w-2 bg-[var(--color-accent)] animate-pulse" aria-hidden />
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
          <Link
            href="/"
            data-testid="not-found-home-link"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-[var(--color-bg-primary)] font-medium hover:bg-[var(--color-accent-light)] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
          >
            <span aria-hidden>›</span> {t('cta')}
          </Link>
          <span className="text-xs text-[var(--color-text-muted)]">{t('hint')}</span>
        </div>
      </div>
    </main>
  )
}
