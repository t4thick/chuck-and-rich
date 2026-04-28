import type { NextConfig } from 'next'
import path from 'path'

// Pin the app root when a parent folder also has a lockfile (avoids wrong module resolution).
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asafointernational.com',
        pathname: '/**',
      },
    ],
  },
}

// Phone on LAN: Next.js dev blocks some cross-origin asset loads unless the host is allowed.
// Add your PC's Wi‑Fi IPv4 to .env.local: DEV_PHONE_HOSTS=192.168.1.105
const phoneHosts =
  process.env.DEV_PHONE_HOSTS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? []

if (process.env.NODE_ENV === 'development') {
  nextConfig.allowedDevOrigins = ['127.0.0.1', ...phoneHosts]
}

export default nextConfig
