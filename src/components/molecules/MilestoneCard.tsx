import React from 'react'

interface MilestoneCardProps {
  slug: string
  big: string
  year: string
  text: string
}

export function MilestoneCard({ slug, big, year, text }: MilestoneCardProps) {
  return (
    <article
      data-testid={`molecule-milestone-card-${slug}`}
      className="relative flex-shrink-0 w-[300px] sm:w-[340px] h-[520px] rounded-3xl border border-[rgba(16,185,129,0.2)] bg-gradient-to-br from-[rgba(16,185,129,0.08)] via-[var(--color-bg-secondary)] to-[var(--color-bg-secondary)] p-8 flex flex-col justify-between shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      {/* Corner accents */}
      <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        Milestone
      </div>

      {/* Year label */}
      <p className="mt-8 text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
        {year}
      </p>

      {/* Big statement */}
      <p className="text-[3.5rem] leading-[0.95] font-heading font-bold text-[var(--color-accent)] tracking-tight break-words">
        {big}
      </p>

      {/* Body */}
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        {text}
      </p>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40" />
    </article>
  )
}
