import type { ReactNode } from 'react'
import { Montserrat } from 'next/font/google'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext'
import { STORE } from '@/lib/constants/store'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://lovely-queen-market.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: STORE.shortName,
    template: `%s · ${STORE.shortName}`,
  },
  description: STORE.tagline,
  icons: {
    apple: '/brand/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: STORE.name,
    title: STORE.name,
    description: STORE.tagline,
    images: [{ url: '/brand/logo-reference.png', width: 1200, height: 630, alt: STORE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: STORE.name,
    description: STORE.tagline,
    images: ['/brand/logo-reference.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <RecentlyViewedProvider>
            <ToastProvider>{children}</ToastProvider>
          </RecentlyViewedProvider>
        </CartProvider>
      </body>
    </html>
  )
}
