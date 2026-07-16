import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'instagram.com'
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com'
      }
    ]
  },
  allowedDevOrigins: ['192.168.1.22', '192.168.1.19', '192.168.1.25']
};

export default withNextIntl(nextConfig);
