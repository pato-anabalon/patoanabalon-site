'use client'

import React from 'react'

interface MenuIconProps {
  isOpen: boolean
  onClick: () => void
  label?: string
}

export function MenuIcon({ isOpen, onClick, label = 'Menu' }: MenuIconProps) {
  return (
    <button
      data-testid="atom-menu-icon"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className="group relative flex items-center gap-3 cursor-pointer select-none"
    >
      {/* Label text */}
      <span
        data-testid="atom-menu-icon-label"
        className={`hidden sm:inline-block text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${
          isOpen
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]'
        }`}
      >
        {isOpen ? 'Close' : label}
      </span>

      {/* Animated icon container */}
      <div
        data-testid="atom-menu-icon-lines"
        className="relative w-10 h-10 rounded-full border border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-all duration-500 flex items-center justify-center overflow-hidden"
      >
        {/* Background glow on hover */}
        <span
          className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          aria-hidden="true"
        />

        {/* Circle sweep on hover */}
        <span
          className="absolute inset-0 rounded-full bg-[var(--color-accent)] scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-[0.08] transition-transform duration-700 ease-out origin-center"
          aria-hidden="true"
        />

        {/* Two lines forming hamburger/X */}
        <div className="relative w-4 h-4 flex flex-col items-center justify-center">
          <span
            className={`absolute h-[1.5px] bg-current rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isOpen
                ? 'w-4 rotate-45 translate-y-0 text-[var(--color-accent)]'
                : 'w-4 rotate-0 -translate-y-1 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] group-hover:w-4'
            }`}
          />
          <span
            className={`absolute h-[1.5px] bg-current rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isOpen
                ? 'w-4 -rotate-45 translate-y-0 text-[var(--color-accent)]'
                : 'w-3 rotate-0 translate-y-1 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] group-hover:w-4'
            }`}
          />
        </div>
      </div>
    </button>
  )
}
