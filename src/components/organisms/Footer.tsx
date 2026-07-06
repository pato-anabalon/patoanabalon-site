import React from 'react'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer
      data-testid="footer"
      className="py-10 px-6 bg-[var(--color-bg-primary)] border-t border-[var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <div className="w-6 h-6 rounded bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-primary)] text-xs font-bold">
            PA
          </div>
          <span>Patricio Anabalon</span>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] text-center">
          {t('madeWith')} ♥ {t('by')} — {year}
        </p>

        <p className="text-xs text-[var(--color-text-muted)]">
          © {year} {t('rights')}
        </p>
      </div>
    </footer>
  )
}
