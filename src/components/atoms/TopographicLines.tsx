'use client'

import React, { useId } from 'react'

/**
 * A single contour line inside a topographic pattern.
 * `d` is the standard SVG path spec; `opacity` is optional per-line.
 */
export interface TopoPath {
  d: string
  opacity?: number
}

interface TopographicLinesProps {
  /** Ordered list of path definitions. */
  paths: TopoPath[]
  /** Stroke color (any CSS color). Defaults to emerald-500. */
  stroke?: string
  /** Stroke width in viewBox units. */
  strokeWidth?: number
  /** SVG viewBox — width should be 2× tileWidth so the duplicate lands exactly one tile out. */
  viewBox?: string
  /** Width of one tile in viewBox units; the `<use>` copy is placed at x={tileWidth}. */
  tileWidth?: number
  /** Extra classes — parent typically supplies the CSS animation class here. */
  className?: string
  /** Stroke endpoint shape. */
  strokeLinecap?: 'butt' | 'round' | 'square'
  /** SVG preserveAspectRatio — usually "none" so the pattern stretches with its container. */
  preserveAspectRatio?: string
  /**
   * Optional explicit group id. If omitted, one is auto-generated with React's useId
   * so multiple instances on the same page don't collide.
   */
  groupId?: string
}

/**
 * A stroke-only SVG "topographic" pattern that tiles horizontally.
 *
 * The paths are drawn once inside a `<g id>`; a `<use>` element duplicates them
 * at `x={tileWidth}`. When the parent element is 200% viewport wide and gets
 * animated with `translateX(-50%)`, the duplicate lines up exactly with where
 * the original was — infinite loop with no visible seam.
 *
 * Reusable for any section that wants an ambient contour-map look. Tweak
 * stroke color/width, path density and viewBox to differentiate.
 */
export function TopographicLines({
  paths,
  stroke = '#10B981',
  strokeWidth = 1.2,
  viewBox = '0 0 2400 900',
  tileWidth = 1200,
  className = '',
  strokeLinecap = 'round',
  preserveAspectRatio = 'none',
  groupId,
}: TopographicLinesProps) {
  const rawId = useId()
  // React's useId can contain ":" characters which are legal in HTML but noisy
  // in SVG href references — strip them.
  const id = groupId ?? `topo-${rawId.replace(/:/g, '')}`

  return (
    <svg
      data-testid={`atom-topographic-lines-${id}`}
      className={className}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id={id}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      >
        {paths.map((p, i) => (
          <path key={i} d={p.d} opacity={p.opacity} />
        ))}
      </g>
      <use href={`#${id}`} x={tileWidth} />
    </svg>
  )
}
