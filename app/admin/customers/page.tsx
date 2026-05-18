import Link from 'next/link'
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

  // Compute order counts per user
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
    <div className="stack">
      <h2>Customers</h2>
      <p className="muted">{profiles?.length ?? 0} profiles · sorted by most recent signup</p>

      {error && <p className="error">{error.message}</p>}

      {!profiles || profiles.length === 0 ? (
        <p>No customers yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p: CustomerRow) => {
              const stat = orderCounts[p.id]
              return (
                <tr key={p.id}>
                  <td>{p.full_name || '—'}</td>
                  <td>{stat?.email ?? '—'}</td>
                  <td>{p.phone || '—'}</td>
                  <td>{p.role || 'user'}</td>
                  <td>{stat?.orders ?? 0}</td>
                  <td>${(stat?.spend ?? 0).toFixed(2)}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    {stat?.email && (
                      <Link href={`/admin/orders?q=${encodeURIComponent(stat.email)}`}>Orders</Link>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
