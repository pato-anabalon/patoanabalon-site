export interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string[]
  logoUrl?: string
  tech?: string[]
}

export interface Skill {
  name: string
  category:
    | 'frontend'
    | 'design'
    | 'backend'
    | 'database'
    | 'cloud'
    | 'ai'
    | 'testing'
    | 'devops'
    | 'observability'
    | 'tools'
    | 'creative'
}

export interface SocialLink {
  platform: string
  url: string
  handle: string
}

export interface MediaItem {
  id: string
  title: string
  tool: string
  thumbnailUrl: string
  type: 'video' | 'image'
}

export interface Award {
  title: string
  company: string
  year: string
  description: string
}

export type Locale = 'en' | 'es'

declare global {
  interface Window {
    __preloaderDone?: boolean
  }
  interface WindowEventMap {
    'preloader:done': CustomEvent
  }
}
