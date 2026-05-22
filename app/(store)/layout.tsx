import type { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MobileBottomNav } from '@/components/store/MobileBottomNav'
import { MobileCartBar } from '@/components/store/MobileCartBar'
import { CartDrawer } from '@/components/store/CartDrawer'
import { AnnouncementBar } from '@/components/store/AnnouncementBar'
import { MOBILE_BOTTOM_NAV_CLASS } from '@/lib/constants/mobile-nav'
import { cn } from '@/lib/utils'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn('flex min-h-screen flex-col', MOBILE_BOTTOM_NAV_CLASS)}>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileCartBar />
      <MobileBottomNav />
    </div>
  )
}
