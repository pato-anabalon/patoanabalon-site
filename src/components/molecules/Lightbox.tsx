'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/animations/gsap'
import { Icon } from '@/components/atoms'
import type { OffScreenPhoto } from '@/lib/data/offScreenSets'

interface LightboxProps {
  photos: OffScreenPhoto[]
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const t = useTranslations('offScreen.captions')
  const [index, setIndex] = useState(initialIndex)
  const overlayRef = useRef<HTMLDivElement>(null)
  const photoWrapperRef = useRef<HTMLDivElement>(null)

  const photo = photos[index]

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + photos.length) % photos.length)
  }, [photos.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % photos.length)
  }, [photos.length])

  // Keyboard controls — ESC closes, arrows navigate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, goPrev, goNext])

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Entrance — fade backdrop + scale-in photo
  useEffect(() => {
    const overlay = overlayRef.current
    const wrapper = photoWrapperRef.current
    if (!overlay || !wrapper) return

    gsap.fromTo(
      overlay,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
    )
    gsap.fromTo(
      wrapper,
      { autoAlpha: 0, scale: 0.92 },
      { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out', delay: 0.05 }
    )
  }, [])

  // Photo swap — quick cross-fade when index changes (skip on initial mount)
  const hasMountedRef = useRef(false)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    const wrapper = photoWrapperRef.current
    if (!wrapper) return
    gsap.fromTo(
      wrapper,
      { autoAlpha: 0.4, scale: 0.98 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
    )
  }, [index])

  const handleClose = () => {
    const overlay = overlayRef.current
    if (!overlay) return onClose()
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  const captionText = photo.labelKey
    ? [t(photo.labelKey), photo.year].filter(Boolean).join(', ')
    : photo.year
      ? String(photo.year)
      : ''

  return (
    <div
      ref={overlayRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <span className="lightbox-counter">
        {String(index + 1).padStart(2, '0')} /{' '}
        {String(photos.length).padStart(2, '0')}
      </span>

      <button
        className="lightbox-btn lightbox-close"
        onClick={handleClose}
        aria-label="Close"
      >
        <Icon name="close" size={20} />
      </button>

      <button
        className="lightbox-btn lightbox-prev"
        onClick={goPrev}
        aria-label="Previous photo"
      >
        <Icon name="arrow-left" size={20} />
      </button>

      <button
        className="lightbox-btn lightbox-next"
        onClick={goNext}
        aria-label="Next photo"
      >
        <Icon name="arrow-right" size={20} />
      </button>

      <div ref={photoWrapperRef} className="lightbox-photo">
        <Image
          src={photo.src}
          alt={photo.labelKey ? t(photo.labelKey) : 'Photo'}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
        {captionText && (
          <p className="lightbox-caption">{captionText}</p>
        )}
      </div>
    </div>
  )
}
