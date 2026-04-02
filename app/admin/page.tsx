import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  ordered:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-500',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
}

export default async function AdminDashboard() {
  const [
    { count: productsCount },
    { count: ordersCount },
    { data: allOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('total_amount'),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
  ])

  const revenue = (allOrders ?? []).reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
  const pendingCount = (recentOrders ?? []).filter(o => o.status === 'pending' || o.status === 'ordered').length

  const stats = [
    { label: 'Total Products', value: productsCount ?? 0, color: 'bg-orange-50 text-orange-600', href: '/admin/products' },
    { label: 'Total Orders', value: ordersCount ?? 0, color: 'bg-blue-50 text-blue-600', href: '/admin/orders' },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}`, color: 'bg-emerald-50 text-emerald-600', href: '/admin/orders' },
    { label: 'Open Orders', value: pendingCount, color: 'bg-amber-50 text-amber-600', href: '/admin/orders' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Admin Overview</p>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Snapshot of products, orders, and revenue.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[#236641] text-sm font-semibold hover:underline">
            View All
          </Link>
        </div>

        {!recentOrders || recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer_name}</td>
                    <td className="px-6 py-4 text-[#1a4731] font-bold">${order.total_amount?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#236641] font-semibold hover:underline text-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
