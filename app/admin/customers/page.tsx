import Link from 'next/link'
import { Users } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdminPage } from '@/lib/auth/require-admin-page'

type CustomerRow = {
  id: string
  full_name: string | null
  phone: string | null
  role: string | null
  created_at: string
}

export default async function AdminCustomersPage() {
  await requireAdminPage()
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, phone, role, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  const orderCounts: Record<string, { orders: number; spend: number; email: string | null }> = {}
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('user_id, total_amount, customer_email')

  for (const o of orders ?? []) {
    if (!o.user_id) continue
    const cur = orderCounts[o.user_id] ?? { orders: 0, spend: 0, email: null }
    cur.orders += 1
    cur.spend += Number(o.total_amount ?? 0)
    cur.email = cur.email ?? o.customer_email ?? null
    orderCounts[o.user_id] = cur
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-page-title">Customers</h1>
        <p className="mt-1 text-sm text-earth-500">
          {profiles?.length ?? 0} profiles · sorted by most recent signup
        </p>
      </div>

      {error && <p className="error">{error.message}</p>}

      {!profiles || profiles.length === 0 ? (
        <div className="admin-card flex flex-col items-center text-center">
          <Users className="h-10 w-10 text-earth-300" strokeWidth={1.5} aria-hidden />
          <p className="mt-3 text-sm text-earth-600">No customers yet.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap hidden overflow-x-auto sm:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Total spent</th>
                  <th>Joined</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p: CustomerRow) => {
                  const stat = orderCounts[p.id]
                  const isAdmin = p.role === 'admin'
                  return (
                    <tr key={p.id}>
                      <td className="font-medium text-earth-900">{p.full_name || '—'}</td>
                      <td className="text-earth-600">{stat?.email ?? '—'}</td>
                      <td className="text-earth-600">{p.phone || '—'}</td>
                      <td>
                        <span
                          className={`admin-status-pill ${
                            isAdmin ? 'bg-violet-50 text-violet-700' : 'bg-earth-100 text-earth-700'
                          }`}
                        >
                          {p.role || 'user'}
                        </span>
                      </td>
                      <td className="tabular-nums">{stat?.orders ?? 0}</td>
                      <td className="tabular-nums font-medium text-earth-900">
                        ${(stat?.spend ?? 0).toFixed(2)}
                      </td>
                      <td className="text-earth-600">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        {stat?.email && (
                          <Link
                            href={`/admin/orders?q=${encodeURIComponent(stat.email)}`}
                            className="text-sm font-medium text-brand-700 no-underline hover:text-brand-800"
                          >
                            Orders
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2 sm:hidden">
            {profiles.map((p: CustomerRow) => {
              const stat = orderCounts[p.id]
              return (
                <li key={p.id} className="admin-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-earth-900">{p.full_name || '—'}</p>
                      <p className="truncate text-xs text-earth-500">
                        {stat?.email ?? '—'}
                      </p>
                    </div>
                    <span className="tabular-nums text-sm font-semibold text-earth-900">
                      ${(stat?.spend ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-earth-500">
                    <span>
                      {stat?.orders ?? 0} order{(stat?.orders ?? 0) === 1 ? '' : 's'}
                    </span>
                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                  {stat?.email && (
                    <Link
                      href={`/admin/orders?q=${encodeURIComponent(stat.email)}`}
                      className="mt-3 inline-block text-sm font-medium text-brand-700 no-underline"
                    >
                      View orders →
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
