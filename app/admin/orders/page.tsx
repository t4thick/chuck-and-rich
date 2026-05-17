import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_LABEL, ORDER_STATUSES, normalizeOrderStatus } from '@/lib/order-status'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status: rawStatus, q } = await searchParams
  const activeStatus = rawStatus ? normalizeOrderStatus(rawStatus) : undefined

  let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })
  if (q?.trim()) {
    const term = q.trim()
    query = query.or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,id.eq.${term}`)
  }
  const { data: orders } = await query

  const filtered = activeStatus
    ? (orders ?? []).filter((o) => normalizeOrderStatus(o.status) === activeStatus)
    : (orders ?? [])

  const counts = ORDER_STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = (orders ?? []).filter((o) => normalizeOrderStatus(o.status) === status).length
    return acc
  }, {})

  return (
    <div className="stack">
      <h2>Orders</h2>
      <p className="muted">{filtered.length} shown · {orders?.length ?? 0} total</p>

      <form method="GET" className="row">
        <label>
          Search:{' '}
          <input type="search" name="q" defaultValue={q ?? ''} placeholder="Name, email, or order ID" style={{ width: '20em' }} />
        </label>
        {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
        <button type="submit">Search</button>
      </form>

      <p>
        Filter:{' '}
        <Link href={q ? `/admin/orders?q=${encodeURIComponent(q)}` : '/admin/orders'}>
          {!activeStatus ? <strong>All ({orders?.length ?? 0})</strong> : `All (${orders?.length ?? 0})`}
        </Link>
        {ORDER_STATUSES.map((status) => {
          const href = `/admin/orders?status=${status}${q ? `&q=${encodeURIComponent(q)}` : ''}`
          return (
            <span key={status}>
              {' · '}
              <Link href={href}>
                {activeStatus === status
                  ? <strong>{ORDER_STATUS_LABEL[status]} ({counts[status] ?? 0})</strong>
                  : `${ORDER_STATUS_LABEL[status]} (${counts[status] ?? 0})`}
              </Link>
            </span>
          )
        })}
      </p>

      {filtered.length === 0 ? (
        <p>No orders in this view.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>City</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>{order.customer_name}</td>
                <td>{order.customer_email}</td>
                <td>{order.city ?? '—'}</td>
                <td>${Number(order.total_amount ?? 0).toFixed(2)}</td>
                <td>{ORDER_STATUS_LABEL[normalizeOrderStatus(order.status)]}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td><Link href={`/admin/orders/${order.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
