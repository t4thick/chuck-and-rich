'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { NavbarAuth } from '@/components/NavbarAuth'
import { Button } from '@/components/ui/button'
import { STORE } from '@/lib/constants/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/track-order', label: 'Track order' },
  { href: '/account', label: 'Account' },
] as const

export function Navbar() {
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="store-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-brand-900 no-underline sm:text-2xl"
            onClick={() => setOpen(false)}
          >
            {STORE.shortName}
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors',
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? 'bg-brand-50 text-brand-800'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                )}
              >
                {label}
              </Link>
            ))}
            <NavbarAuth className="ml-1" />
            <Link href="/cart" className="no-underline">
              <Button variant="outline" size="sm" className="relative ml-1 gap-1.5">
                <ShoppingBag className="h-4 w-4" aria-hidden />
                Cart
                {totalItems > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-xs font-bold text-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/cart" className="relative no-underline" aria-label={`Cart, ${totalItems} items`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-0.5 text-[10px] font-bold text-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
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

        {open && (
          <nav
            id="mobile-nav"
            className="border-t border-stone-100 pb-4 pt-3 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 no-underline hover:bg-stone-100"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium no-underline',
                    pathname === href ? 'bg-brand-50 text-brand-800' : 'text-stone-700 hover:bg-stone-100'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 flex flex-wrap gap-2 border-t border-stone-100 px-3 pt-3">
                <NavbarAuth onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
