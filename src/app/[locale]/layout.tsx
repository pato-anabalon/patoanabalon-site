import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@/components/atoms'
import { routing } from '../../../i18n'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const SITE_URL = 'https://patoanabalon.dev'

const TITLE = 'Patricio "Pato" Anabalon — Senior Software Engineer'
const DESCRIPTION =
  'Senior Software Engineer with 18+ years of experience. Next.js, React, TypeScript, Node.js and .NET C#. Based in Santiago, aiming for Auckland, NZ.'

export const viewport: Viewport = {
  themeColor: '#0F172A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const path = `/${locale}`

  return {
    metadataBase: new URL(SITE_URL),
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      'Pato Anabalon',
      'Patricio Anabalon',
      'Software Engineer',
      'Senior Developer',
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      '.NET',
      'Auckland',
      'New Zealand',
    ],
    authors: [{ name: 'Patricio Anabalon', url: SITE_URL }],
    creator: 'Patricio Anabalon',
    alternates: {
      canonical: path,
      languages: {
        en: '/en',
        es: '/es',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'website',
      url: path,
      siteName: 'Pato Anabalon',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      creator: '@pato_anabalon',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Required for static rendering + tells next-intl which locale is active in this request scope
  setRequestLocale(locale)

  const messages = await getMessages({ locale })

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
