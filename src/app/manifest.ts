import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pato Anabalon — Senior Software Engineer',
    short_name: 'Pato Anabalon',
    description:
      '18+ years crafting web experiences. Next.js, React, TypeScript, Node.js, .NET C#.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#0F172A',
    lang: 'en',
    categories: ['portfolio', 'personal', 'business'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
