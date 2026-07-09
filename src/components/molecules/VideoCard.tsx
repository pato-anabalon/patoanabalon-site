'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
})

interface VideoCardProps {
  slug: string
  playbackId: string
  aspectRatio?: '16/9' | '9/16' | '1/1'
}

export function VideoCard({ slug, playbackId, aspectRatio = '16/9' }: VideoCardProps) {
  const t = useTranslations('creative')
  const [playing, setPlaying] = useState(false)

  const title = t(`videos.${slug}.title`)
  const description = t(`videos.${slug}.description`)
  const poster = `https://image.mux.com/${playbackId}/thumbnail.webp?width=960&fit_mode=preserve`

  return (
    <figure
      data-testid={`creative-video-${slug}`}
      className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors duration-300"
    >
      <div className="relative w-full" style={{ aspectRatio }}>
        {playing ? (
          <MuxPlayer
            playbackId={playbackId}
            streamType="on-demand"
            autoPlay
            accentColor="#10B981"
            metadata={{ video_title: title }}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t('playVideo')}
            className="absolute inset-0 w-full h-full cursor-pointer"
            data-testid={`creative-video-play-${slug}`}
          >
            <Image
              src={poster}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-accent)] text-black shadow-[0_10px_30px_-5px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 ml-1"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
          {title}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          {description}
        </p>
      </figcaption>
    </figure>
  )
}
