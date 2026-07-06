import React from 'react'
import Image from 'next/image'

interface TileSkeletonProps {
  index: number
  label: string
  hint?: string
  imageSrc?: string
  imageAlt?: string
  /** CSS object-position value for the image, e.g. "top", "center 20%". Default "center". */
  imagePosition?: string
  className?: string
  style?: React.CSSProperties
}

export function TileSkeleton({
  index,
  label,
  hint,
  imageSrc,
  imageAlt,
  imagePosition,
  className = '',
  style,
}: TileSkeletonProps) {
  const hasImage = Boolean(imageSrc)

  return (
    <div
      data-testid={`molecule-tile-skeleton-${index}`}
      data-tile-index={index}
      className={`relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] ${hasImage ? 'tile-hover-target' : ''} ${className}`}
      style={style}
    >
      {hasImage ? (
        <>
          <Image
            src={imageSrc!}
            alt={imageAlt || label}
            fill
            sizes="(max-width: 768px) 33vw, 500px"
            className="object-cover"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
          {/* Gradient overlay for text legibility */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40 pointer-events-none"
            aria-hidden="true"
          />
          {/* Emerald sweep on hover — plays once per mouseenter */}
          <div
            className="absolute inset-0 tile-shimmer"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {/* Shimmer while placeholder */}
          <div
            className="absolute inset-0 tile-skeleton-shimmer pointer-events-none"
            aria-hidden="true"
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </>
      )}

      {/* Content overlay */}
      <div className="relative h-full w-full flex flex-col items-start justify-between p-4 sm:p-5">
        {/* Top: index badge */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          <span
            className={`text-[10px] font-mono uppercase tracking-widest ${
              hasImage ? 'text-white/85' : 'text-[var(--color-text-muted)]'
            }`}
          >
            {String(index + 1).padStart(2, '0')} · Photo
          </span>
        </div>

        {/* Bottom: label + hint */}
        <div>
          <p
            className={`text-sm sm:text-base font-heading font-semibold leading-tight ${
              hasImage ? 'text-white drop-shadow-md' : 'text-[var(--color-text-primary)]'
            }`}
          >
            {label}
          </p>
          {hint && (
            <p
              className={`mt-1 text-[10px] font-mono uppercase tracking-widest ${
                hasImage ? 'text-white/75' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {hint}
            </p>
          )}
        </div>
      </div>

      {/* Corner marker */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none" aria-hidden="true">
        <span className="absolute top-3 right-3 w-2 h-[1px] bg-[var(--color-accent)] opacity-70" />
        <span className="absolute top-3 right-3 w-[1px] h-2 bg-[var(--color-accent)] opacity-70" />
      </div>
    </div>
  )
}
