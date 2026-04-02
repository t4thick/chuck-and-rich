import type { NextConfig } from 'next'
import path from 'path'

// Pin the app root when a parent folder also has a lockfile (avoids wrong module resolution).
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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

if (process.env.NODE_ENV === 'development' && phoneHosts.length > 0) {
  nextConfig.allowedDevOrigins = ['127.0.0.1', ...phoneHosts]
}

export default nextConfig
