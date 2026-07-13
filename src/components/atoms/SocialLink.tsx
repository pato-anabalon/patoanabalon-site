import React from 'react'
import { Icon } from './Icon'
import type { SocialLink as SocialLinkType } from '@/types'

type SocialPlatform = 'linkedin' | 'github' | 'instagram' | 'twitter' | 'whatsapp'

interface SocialLinkProps {
  link: SocialLinkType
  showHandle?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SocialLink({ link, showHandle = false, size = 'md', className = '' }: SocialLinkProps) {
  const iconSizes = { sm: 16, md: 20, lg: 24 }
  const platform = link.platform as SocialPlatform

  return (
    <a
      data-testid={`atom-social-link-${platform}`}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${platform} — ${link.handle}`}
      className={`group inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 ${className}`}
    >
      <span className="p-2 rounded-full border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[rgba(16,185,129,0.1)] transition-all duration-300">
        <Icon name={platform} size={iconSizes[size]} />
      </span>
      {showHandle && (
        <span className="text-sm font-mono">{link.handle}</span>
      )}
    </a>
  )
}
