import type { ReactNode } from 'react'
import { Montserrat } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext'
import { STORE } from '@/lib/constants/store'

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
