import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Lovely Queen African Market (MVP)',
  description: 'Feature build in progress.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
