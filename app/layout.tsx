import type { ReactNode } from 'react'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { STORE } from '@/lib/constants/store'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
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
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <ToastProvider>{children}</ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
