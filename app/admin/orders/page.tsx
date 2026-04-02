import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABEL, ORDER_STATUSES, normalizeOrderStatus } from '@/lib/order-status'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: rawStatus } = await searchParams
  const activeStatus = rawStatus ? normalizeOrderStatus(rawStatus) : undefined

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const filteredOrders = activeStatus
    ? (orders ?? []).filter((o) => normalizeOrderStatus(o.status) === activeStatus)
    : (orders ?? [])
  const counts = ORDER_STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = (orders ?? []).filter((o) => normalizeOrderStatus(o.status) === status).length
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
        <p className="text-gray-400 text-sm mt-1">
          {filteredOrders.length} shown · {orders?.length ?? 0} total orders
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
            !activeStatus ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          All ({orders?.length ?? 0})
        </Link>
        {ORDER_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              activeStatus === status
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {ORDER_STATUS_LABEL[status]} ({counts[status] ?? 0})
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-semibold">No orders in this status yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Contact</th>
                  <th className="px-6 py-3 text-left">City</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.customer_name}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{order.customer_email}</td>
                    <td className="px-6 py-4 text-gray-500">{order.city}</td>
                    <td className="px-6 py-4 font-bold text-green-700">${order.total_amount?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[normalizeOrderStatus(order.status)] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ORDER_STATUS_LABEL[normalizeOrderStatus(order.status)]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`}
                        className="text-green-700 font-semibold hover:underline text-xs">
                        View →
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
