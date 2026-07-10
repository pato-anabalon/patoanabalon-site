import createMiddleware from 'next-intl/middleware'
import { routing } from '../i18n'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/',
    '/(en|es)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
