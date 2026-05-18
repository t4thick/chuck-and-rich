import type { Metadata } from 'next'
import './globals.css'
import type { ReactNode } from 'react'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: 'Lovely Queen African Market (MVP)',
  description: 'Feature build in progress.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ToastProvider>{children}</ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
