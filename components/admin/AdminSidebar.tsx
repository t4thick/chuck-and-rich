'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="store-container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg font-bold text-brand-900">Admin</span>
          <nav className="flex flex-wrap gap-1" aria-label="Admin">
            {NAV.map(({ href, label, ...rest }) => {
              const exact = 'exact' in rest && rest.exact
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition-colors',
                    active
                      ? 'bg-brand-100 text-brand-800'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="no-underline">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              View store
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
