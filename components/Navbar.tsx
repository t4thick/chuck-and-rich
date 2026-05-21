'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, Store, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { NavbarAuth } from '@/components/NavbarAuth'
import { ShopSearchBar } from '@/components/store/ShopSearchBar'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/track-order', label: 'Track order' },
  { href: '/account', label: 'Account' },
] as const

export function Navbar() {
  const { totalItems, openCart } = useCart()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-earth-200/60 bg-white/90 shadow-[var(--shadow-card)] backdrop-blur-xl'
          : 'border-transparent bg-cream/80 backdrop-blur-md'
      )}
    >
      <div className="store-container">
        <div className={cn('flex items-center justify-between gap-3 transition-all', scrolled ? 'h-14' : 'h-16')}>
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 no-underline"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-white shadow-sm">
              <Store className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-earth-950 sm:text-xl">
              <span className="hidden sm:inline">{STORE.shortName}</span>
              <span className="sm:hidden">Lovely Queen</span>
            </span>
          </Link>

          <div className="hidden flex-1 px-4 md:block md:max-w-md lg:max-w-lg">
            <ShopSearchBar compact />
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium no-underline transition-colors',
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-earth-700 hover:bg-earth-100 hover:text-brand-950'
                )}
              >
                {label}
              </Link>
            ))}
            <NavbarAuth className="ml-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative ml-2 gap-1.5 rounded-full border-earth-200"
              onClick={openCart}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              Cart
              {totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-xs font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Cart, ${totalItems} items`}
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-0.5 text-[10px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <ShopSearchBar compact />
        </div>

        {open && (
          <nav
            id="mobile-nav"
            className="border-t border-earth-100 pb-4 pt-3 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'rounded-xl px-4 py-3 text-base font-medium no-underline',
                    pathname === href ? 'bg-brand-100 text-brand-800' : 'text-earth-800 hover:bg-earth-100'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-earth-100 px-2 pt-3">
                <NavbarAuth onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
