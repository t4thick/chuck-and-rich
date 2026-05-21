import type { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MobileCartBar } from '@/components/store/MobileCartBar'
import { CartDrawer } from '@/components/store/CartDrawer'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileCartBar />
    </>
  )
}
