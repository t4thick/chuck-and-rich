import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin — Lovely Queen African Market' }

// Avoid running supabaseAdmin during `next build` static prerender (needs env + DB at request time).
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
