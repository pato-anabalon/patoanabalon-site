'use client'

import React, { useMemo } from 'react'

interface MenuItemProps {
  index: number
  label: string
  href: string
  isActive?: boolean
  onHover?: (index: number) => void
  onClick?: (href: string) => void
}

interface Particle {
  id: number
  left: string
  top: string
  size: number
  driftX: string
  driftY: string
  duration: string
  delay: string
}

function generateParticles(seed: number): Particle[] {
  // Deterministic pseudo-random so SSR and CSR match
  let s = seed * 9301 + 49297
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }

  return Array.from({ length: 22 }, (_, i) => {
    const size = rand() * 2.5 + 1
    const drift = rand() * 60 - 30
    return {
      id: i,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size,
      driftX: `${drift}px`,
      driftY: `${-(rand() * 60 + 20)}px`,
      duration: `${rand() * 4 + 3}s`,
      delay: `${rand() * 3}s`,
    }
  })
}

export function MenuItem({
  index,
  label,
  href,
  isActive = false,
  onHover,
  onClick,
}: MenuItemProps) {
  const particles = useMemo(() => generateParticles(index + 1), [index])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClick?.(href)
  }

  return (
    <a
      data-testid={`molecule-menu-item-${href.replace('#', '')}`}
      href={href}
      onClick={handleClick}
      onMouseEnter={() => onHover?.(index)}
      onFocus={() => onHover?.(index)}
      className="group relative block outline-none overflow-hidden"
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Animated particle background — visible on hover */}
      <span
        aria-hidden="true"
        data-testid={`menu-item-particles-${href.replace('#', '')}`}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      >
        {particles.map((p) => (
          <span
            key={p.id}
            className="menu-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              // Custom properties used by the keyframe
              ['--drift-x' as string]: p.driftX,
              ['--drift-y' as string]: p.driftY,
              ['--duration' as string]: p.duration,
              ['--delay' as string]: p.delay,
            } as React.CSSProperties}
          />
        ))}
      </span>

      {/* Subtle radial glow follows hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-baseline gap-4 sm:gap-8 py-2 sm:py-3">
        {/* Number prefix */}
        <span
          data-testid={`menu-item-number-${index}`}
          className={`text-xs font-mono tracking-widest transition-colors duration-500 ${
            isActive
              ? 'text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]'
          }`}
        >
          0{index + 1}
        </span>

        {/* Label with sliding underline */}
        <span className="relative overflow-hidden inline-block">
          <span
            data-testid={`menu-item-label-${href.replace('#', '')}`}
            className={`inline-block text-[13vw] sm:text-[9vw] md:text-[7vw] lg:text-[6.5vw] leading-[0.9] font-heading font-bold transition-colors duration-500 ease-out ${
              isActive
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]'
            }`}
          >
            {label}
          </span>

          {/* Underline animation */}
          <span
            data-testid={`menu-item-underline-${href.replace('#', '')}`}
            className={`absolute bottom-2 left-0 h-[2px] bg-[var(--color-accent)] transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
            aria-hidden="true"
          />
        </span>

        {/* Arrow indicator */}
        <span
          className={`hidden md:inline-block text-2xl transition-all duration-500 ${
            isActive
              ? 'opacity-100 translate-x-0 text-[var(--color-accent)]'
              : 'opacity-0 -translate-x-4 text-[var(--color-accent)] group-hover:opacity-100 group-hover:translate-x-0'
          }`}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </a>
  )
}
