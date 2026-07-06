import React from 'react'
import { Tag } from '@/components/atoms'
import type { Skill } from '@/types'

interface SkillCardProps {
  category: string
  skills: Skill[]
  className?: string
}

export function SkillCard({ category, skills, className = '' }: SkillCardProps) {
  return (
    <div
      data-testid="molecule-skill-card"
      className={`p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors duration-300 group ${className}`}
    >
      <h3 className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Tag key={skill.name} variant="muted">
            {skill.name}
          </Tag>
        ))}
      </div>
    </div>
  )
}
