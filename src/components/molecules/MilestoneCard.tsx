import React from 'react';

interface MilestoneCardProps {
  slug: string;
  big: string;
  year: string;
  text: string;
  label: string;
}

export function MilestoneCard({ slug, big, year, text, label }: MilestoneCardProps) {
  return (
    <article
      data-testid={`molecule-milestone-card-${slug}`}
      className="relative flex-shrink-0 w-[320px] sm:w-[340px] h-[530px] sm:h-[575px] rounded-3xl border border-[rgba(16,185,129,0.2)] bg-gradient-to-br from-[rgba(16,185,129,0.08)] via-[var(--color-bg-secondary)] to-[var(--color-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      {/* Corner accents */}
      <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        {label}
      </div>

      {/* Year label */}
      <p className="mt-8 text-[15px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">{year}</p>

      {/* Big statement */}
      <p
        data-milestone-big
        className="text-[2.5rem] sm:text-[3.2rem] leading-[0.95] font-heading font-bold text-[var(--color-accent)] tracking-tight break-words"
      >
        {big}
      </p>

      {/* Body */}
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{text}</p>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40" />
    </article>
  );
}
