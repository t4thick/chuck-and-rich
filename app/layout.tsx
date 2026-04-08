import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Lovely Queen African Market',
  description: 'Authentic African fabrics, food, spices, and beauty products delivered to your door.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f9f9f9]">
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
