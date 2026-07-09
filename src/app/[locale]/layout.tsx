import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Patricio "Pato" Anabalon — Senior Software Engineer',
  description:
    'Senior Software Engineer with 18+ years of experience. Specialising in Next.js, React, TypeScript and scalable web architectures. Based in Santiago, with Auckland, NZ on the horizon.',
  keywords: [
    'Pato Anabalon',
    'Patricio Anabalon',
    'Software Engineer',
    'Senior Developer',
    'Next.js',
    'React',
    'TypeScript',
    'Auckland',
    'New Zealand',
    'Frontend Engineer',
  ],
  authors: [{ name: 'Patricio Anabalon' }],
  openGraph: {
    title: 'Patricio "Pato" Anabalon — Senior Software Engineer',
    description: '18+ years crafting digital experiences. Aiming for Auckland, NZ.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pato_anabalon',
  },
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
