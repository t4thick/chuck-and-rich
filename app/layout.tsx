import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { isViewerAdmin } from '@/lib/auth/require-admin-page'

export const metadata: Metadata = {
  title: 'Lovely Queen African Market (MVP)',
  description: 'Feature build in progress.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isViewerAdmin()
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ToastProvider>
            <Navbar isAdmin={isAdmin} />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
