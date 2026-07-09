import { track as vercelTrack } from '@vercel/analytics'

type EventProperties = Record<string, string | number | boolean | null>

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export function trackEvent(name: string, properties?: EventProperties) {
  vercelTrack(name, properties)
  if (typeof window !== 'undefined') {
    window.gtag?.('event', name, properties)
  }
}
