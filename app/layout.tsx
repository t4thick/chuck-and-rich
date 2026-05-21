import type { ReactNode } from 'react'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext'
import { STORE } from '@/lib/constants/store'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: STORE.shortName,
    template: `%s · ${STORE.shortName}`,
  },
  description: STORE.tagline,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
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
