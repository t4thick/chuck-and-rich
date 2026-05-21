'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'

/** Sticky checkout bar on mobile when cart has items (hidden on cart/checkout). */
export function MobileCartBar() {
  const { totalItems, totalPrice } = useCart()
  const pathname = usePathname()

  if (totalItems === 0) return null
  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 p-3 shadow-[0_-4px_24px_rgb(0_0_0/0.08)] backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <ShoppingBag className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-900">
              {totalItems} item{totalItems === 1 ? '' : 's'} · {formatMoney(totalPrice)}
            </p>
            <p className="text-xs text-stone-500">Ready to checkout</p>
          </div>
        </div>
        <Link href="/cart" className="shrink-0 no-underline">
          <Button variant="accent" size="sm">
            View cart
          </Button>
        </Link>
      </div>
    </div>
  )
}
