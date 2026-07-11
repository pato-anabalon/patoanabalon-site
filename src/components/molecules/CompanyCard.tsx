import React from 'react';
import Image from 'next/image';
import type { Experience } from '@/types';

interface CompanyCardProps {
  experience: Experience;
  logoSrc: string;
  isPresent?: boolean;
  nowLabel: string;
}

export function CompanyCard({ experience, logoSrc, isPresent, nowLabel }: CompanyCardProps) {
  return (
    <article
      data-testid={`molecule-company-card-${experience.id}`}
      className="relative flex-shrink-0 w-[380px] sm:w-[420px] h-[520px] rounded-3xl border border-[rgba(16,185,129,0.12)] bg-[var(--color-bg-secondary)] p-8 flex flex-col shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]"
    >
      {/* Present badge */}
      {isPresent && (
        <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)] bg-[rgba(16,185,129,0.1)] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          {nowLabel}
        </span>
      )}

      {/* Logo — sitting on a subtle backdrop pill so brand color reads on the dark section */}
      <div className="h-16 flex items-center mb-6">
        <div
          className="inline-flex items-center h-14 rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.12] to-white/[0.25] backdrop-blur-sm px-4 py-2"
          data-testid={`company-card-logo-${experience.id}`}
        >
          <div className="relative h-9 w-32">
            <Image
              src={logoSrc}
              alt={`${experience.company} logo`}
              fill
              sizes="128px"
              className="object-contain object-left"
            />
          </div>
        </div>
      </div>

      {/* Period */}
      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] mb-3">
        {experience.period}
      </p>

      {/* Company */}
      <h3 className="text-2xl font-heading font-bold text-[var(--color-text-primary)] leading-tight">
        {experience.company}
      </h3>

      {/* Role */}
      <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-6">{experience.role}</p>

      {/* Divider */}
      <div className="h-px w-12 bg-[var(--color-accent)] mb-6" />

      {/* Achievements */}
      <ul className="space-y-3 overflow-hidden">
        {experience.description.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
