'use client'

import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { MOBILE_BOTTOM_NAV_OFFSET } from '@/lib/constants/mobile-nav'
import { formatMoney } from '@/lib/utils'

/** Sticky checkout bar on mobile when cart has items — sits above bottom tab bar. */
export function MobileCartBar() {
  const { totalItems, totalPrice, openCart } = useCart()
  const pathname = usePathname()

  if (totalItems === 0) return null
  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) return null

  return (
    <div
      className="fixed left-0 right-0 z-40 border-t border-earth-200 bg-white/95 p-3 shadow-[0_-8px_32px_rgb(42_28_22/0.12)] backdrop-blur-md md:hidden"
      style={{ bottom: MOBILE_BOTTOM_NAV_OFFSET }}
    >
      <Button
        type="button"
        variant="accent"
        size="lg"
        className="h-12 w-full gap-3 text-base font-semibold"
        onClick={openCart}
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        <span className="flex-1 text-left">
          View cart · {totalItems} item{totalItems === 1 ? '' : 's'}
        </span>
        <span className="font-bold">{formatMoney(totalPrice)}</span>
      </Button>
    </div>
  )
}
