'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
]

export function AdminSidebar() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <nav>
      <strong>Admin</strong>{' '}
      {NAV.map((item) => (
        <span key={item.href}>
          <Link href={item.href}>{item.label}</Link>{' · '}
        </span>
      ))}
      <Link href="/" target="_blank">View store</Link>{' · '}
      <button type="button" onClick={handleLogout}>Logout</button>
      <hr />
    </nav>
  )
}
