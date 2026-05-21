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
      className="glass-nav fixed bottom-0 left-0 right-0 z-50 border-t border-earth-200/60 shadow-[0_-4px_24px_rgb(0_0_0/0.06)] md:hidden"
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
                  'group relative flex h-full flex-col items-center justify-center gap-0.5 px-1 no-underline transition-colors',
                  active ? 'text-brand-700' : 'text-earth-500 hover:text-earth-800'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <span
                    className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand-700"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300',
                    active ? 'bg-brand-50' : 'group-active:scale-90'
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5 transition', active && 'stroke-[2.25]')}
                    aria-hidden
                  />
                  {isCart && totalItems > 0 && (
                    <span
                      key={totalItems}
                      className="animate-bounce-in absolute -right-1 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-0.5 text-[9px] font-bold leading-none text-white shadow-sm"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-semibold leading-none tracking-tight transition',
                    active && 'text-brand-800'
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
