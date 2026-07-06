import React from 'react'

interface TagProps {
  children: React.ReactNode
  variant?: 'accent' | 'muted' | 'outline'
  className?: string
}

export function Tag({ children, variant = 'muted', className = '' }: TagProps) {
  const variants = {
    accent:
      'bg-[rgba(16,185,129,0.15)] text-[var(--color-accent)] border border-[var(--color-border)]',
    muted:
      'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-transparent',
    outline:
      'border border-[var(--color-border)] text-[var(--color-text-muted)]',
  }

  return (
    <span
      data-testid="atom-tag"
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
