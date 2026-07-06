'use client'

import React from 'react'

interface NavItemProps {
  label: string
  href: string
  onClick?: () => void
  className?: string
}

export function NavItem({ label, href, onClick, className = '' }: NavItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClick?.()
    const target = document.querySelector(href)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <a
      data-testid="molecule-nav-item"
      href={href}
      onClick={handleClick}
      className={`group relative inline-flex items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-300 ${className}`}
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full" />
    </a>
  )
}
