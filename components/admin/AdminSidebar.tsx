'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  ExternalLink,
  LogOut,
  Package,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/shipping', label: 'Shipping', icon: Truck },
  { href: '/admin/customers', label: 'Customers', icon: Users },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <header className="sticky top-0 z-30 border-b border-earth-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-3 text-sm font-semibold text-earth-900">Admin</span>
          <nav className="flex flex-wrap gap-0.5" aria-label="Admin">
            {NAV.map(({ href, label, icon: Icon, ...rest }) => {
              const exact = 'exact' in rest && rest.exact
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium no-underline transition-colors',
                    active
                      ? 'bg-earth-900 text-white'
                      : 'text-earth-600 hover:bg-earth-100 hover:text-earth-900'
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-earth-600 no-underline transition-colors hover:bg-earth-100 hover:text-earth-900"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            View store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-earth-600 transition-colors hover:bg-earth-100 hover:text-earth-900"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
