export interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string[]
  logoUrl?: string
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'cloud' | 'ai' | 'tools' | 'creative'
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
