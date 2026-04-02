'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 shrink-0 bg-[#101815] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="w-2 h-8 rounded-full bg-[#c8811a]" />
          <div className="leading-tight">
            <p className="text-white font-bold text-sm">Lovely Queen Market</p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-[#1a4731] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-red-300 hover:bg-white/10 text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
