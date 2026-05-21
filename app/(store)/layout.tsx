import type { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MobileCartBar } from '@/components/store/MobileCartBar'

/**
 * Storefront chrome only — admin routes live outside this route group so they
 * never render Home / Shop / Cart links next to the staff dashboard.
 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileCartBar />
    </>
  )
}
