'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PackageSearch, ShoppingBag, Store, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { MOBILE_BOTTOM_NAV_OFFSET } from '@/lib/constants/mobile-nav'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', label: 'Home', icon: Home, match: (path: string) => path === '/' },
  {
    href: '/shop',
    label: 'Shop',
    icon: Store,
    match: (path: string) => path === '/shop' || path.startsWith('/products/'),
  },
  {
    href: '/cart',
    label: 'Cart',
    icon: ShoppingBag,
    match: (path: string) => path === '/cart' || path.startsWith('/checkout'),
  },
  {
    href: '/track-order',
    label: 'Track',
    icon: PackageSearch,
    match: (path: string) => path === '/track-order' || path.startsWith('/order-confirmation'),
  },
  {
    href: '/account',
    label: 'Account',
    icon: User,
    match: (path: string) => path.startsWith('/account') || path === '/login' || path === '/signup',
  },
] as const

const HIDE_ON_PREFIXES = ['/checkout']

export function MobileBottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  if (HIDE_ON_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-earth-200 bg-white/95 shadow-[0_-4px_24px_rgb(42_28_22/0.08)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile navigation"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          const isCart = href === '/cart'

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'relative flex h-full flex-col items-center justify-center gap-0.5 px-1 no-underline transition-colors',
                  active ? 'text-brand-800' : 'text-earth-500 hover:text-earth-800'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Icon
                    className={cn('h-[22px] w-[22px]', active && 'stroke-[2.25]')}
                    aria-hidden
                  />
                  {isCart && totalItems > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-0.5 text-[9px] font-bold leading-none text-white">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-semibold leading-none tracking-tight',
                    active && 'text-brand-800'
                  )}
                >
                  {label}
                </span>
                {active && (
                  <span
                    className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-brand-700"
                    aria-hidden
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
