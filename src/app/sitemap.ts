import type { MetadataRoute } from 'next'

const SITE_URL = 'https://patoanabalon.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          es: `${SITE_URL}/es`,
        },
      },
    },
    {
      url: `${SITE_URL}/es`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          es: `${SITE_URL}/es`,
        },
      },
    },
  ]
}
