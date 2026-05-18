import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminOrderNotifier } from '@/components/admin/AdminOrderNotifier'

export const metadata = { title: 'Admin' }
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Per-page admin gate (defense in depth) lives in each admin page via
  // `requireAdminPage()` — we can't put it here because this layout also wraps
  // `/admin/login`, which would create a redirect loop for unauthenticated users.
  return (
    <div>
      <AdminSidebar />
      <AdminOrderNotifier />
      {children}
    </div>
  )
}
