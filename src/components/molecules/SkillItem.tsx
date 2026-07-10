import React, { memo } from 'react'
import { skillIcons } from '@/lib/data/skillIcons'

interface SkillItemProps {
  name: string
}

function SkillItemImpl({ name }: SkillItemProps) {
  const config = skillIcons[name]

  return (
    <div
      data-testid={`molecule-skill-item-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      className="group flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(30,41,59,0.85)] p-4 sm:p-5 transition-all duration-500 hover:border-[var(--color-accent)] hover:bg-[rgba(16,185,129,0.06)]"
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(15,23,42,0.85)] border border-white/[0.06] transition-transform duration-500 group-hover:scale-110"
        aria-hidden="true"
      >
        {config ? (
          <config.Icon size={22} color={config.color} />
        ) : (
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="text-sm sm:text-base font-medium text-[var(--color-text-primary)] leading-tight">
        {name}
      </span>
    </div>
  )
}

// Memoize to keep the 40+ items from re-rendering when SkillsSection's
// activeIndex state changes (which happens on every deck-stack scrub slide).
export const SkillItem = memo(SkillItemImpl)
