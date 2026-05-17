import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_LABEL, normalizeOrderStatus } from '@/lib/order-status'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS).toISOString()

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { count: lowStockCount },
    { data: revenueRows },
    { data: weekRevenueRows },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false),
    supabaseAdmin.from('orders').select('total_amount'),
    supabaseAdmin.from('orders').select('total_amount').gte('created_at', sevenDaysAgo),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const revenue = (revenueRows ?? []).reduce((s, o) => s + (o.total_amount ?? 0), 0)
  const weekRevenue = (weekRevenueRows ?? []).reduce((s, o) => s + (o.total_amount ?? 0), 0)
  const openOrders = (recentOrders ?? []).filter((o) => {
    const st = normalizeOrderStatus(o.status)
    return st === 'ordered' || st === 'processing'
  }).length

  return (
    <div className="stack">
      <h2>Dashboard</h2>

      <table>
        <tbody>
          <tr><th>Products</th><td>{productsCount ?? 0}</td><td><Link href="/admin/products">Manage</Link></td></tr>
          <tr><th>Out of stock</th><td>{lowStockCount ?? 0}</td><td><Link href="/admin/products">Restock</Link></td></tr>
          <tr><th>Orders (all time)</th><td>{ordersCount ?? 0}</td><td><Link href="/admin/orders">View</Link></td></tr>
          <tr><th>Revenue (all time)</th><td>${revenue.toFixed(2)}</td><td></td></tr>
          <tr><th>Revenue (last 7 days)</th><td>${weekRevenue.toFixed(2)}</td><td></td></tr>
          <tr><th>Open orders (need action)</th><td>{openOrders}</td><td><Link href="/admin/orders?status=ordered">Process</Link></td></tr>
          <tr><th>Customers</th><td>{customersCount ?? 0}</td><td><Link href="/admin/customers">View</Link></td></tr>
        </tbody>
      </table>

      <h3>Recent orders</h3>
      {!recentOrders || recentOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.customer_name ?? '—'}</td>
                <td>${Number(order.total_amount ?? 0).toFixed(2)}</td>
                <td>{ORDER_STATUS_LABEL[normalizeOrderStatus(order.status)]}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td><Link href={`/admin/orders/${order.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
