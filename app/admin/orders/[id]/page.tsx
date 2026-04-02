import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PAYMENT_LABEL, type PaymentMethod } from '@/lib/payment-methods'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABEL, ORDER_STATUS_FLOW, getStatusStepIndex, normalizeOrderStatus } from '@/lib/order-status'
import { SHIPPING_METHOD_LABEL, type ShippingMethod } from '@/lib/shipping'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [{ data: order }, { data: items }, logsResult] = await Promise.all([
    supabaseAdmin.from('orders').select('*').eq('id', id).single(),
    supabaseAdmin.from('order_items').select('*').eq('order_id', id),
    supabaseAdmin
      .from('order_status_logs')
      .select('id,from_status,to_status,changed_at,changed_by,note')
      .eq('order_id', id)
      .order('changed_at', { ascending: true }),
  ])

  if (!order) notFound()

  const pm = (order.payment_method as PaymentMethod | null | undefined) ?? 'cod'
  const paymentLabel = PAYMENT_LABEL[pm] ?? pm
  const normalizedStatus = normalizeOrderStatus(order.status)
  const statusIndex = getStatusStepIndex(order.status)
  const shippingMethod = (order.shipping_method as ShippingMethod | null | undefined) ?? 'standard'
  const shippingLabel = SHIPPING_METHOD_LABEL[shippingMethod] ?? shippingMethod
  const statusLogs =
    logsResult.error &&
    /relation .* does not exist|could not find the table/i.test(logsResult.error.message)
      ? []
      : (logsResult.data ?? [])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-gray-400 text-sm hover:text-green-700 mb-1 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Order Detail</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${ORDER_STATUS_COLORS[normalizedStatus] ?? 'bg-gray-100 text-gray-600'}`}>
          {ORDER_STATUS_LABEL[normalizedStatus]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Name</p>
                <p className="font-semibold text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Email</p>
                <p className="font-semibold text-gray-900">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                  <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Order Date</p>
                <p className="font-semibold text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Payment</p>
                <p className="font-semibold text-gray-900">{paymentLabel}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Shipping Method</p>
                <p className="font-semibold text-gray-900">{shippingLabel}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Shipping Zone</p>
                <p className="font-semibold text-gray-900 capitalize">{order.shipping_zone ?? 'n/a'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Tracking Number</p>
                <p className="font-semibold text-gray-900">{order.tracking_number ?? 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-4">Delivery Timeline</h2>
            <div className="space-y-3">
              {ORDER_STATUS_FLOW.map((step, index) => {
                const done = statusIndex >= index
                const tsColumn =
                  step === 'ordered' ? order.ordered_at :
                  step === 'processing' ? order.processing_at :
                  step === 'shipped' ? order.shipped_at :
                  step === 'out_for_delivery' ? order.out_for_delivery_at :
                  order.delivered_at
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                        done ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {done ? '✓' : index + 1}
                    </span>
                    <p className={done ? 'text-gray-900 font-semibold text-sm' : 'text-gray-500 text-sm'}>
                      {ORDER_STATUS_LABEL[step]}
                    </p>
                    {done && tsColumn && (
                      <p className="text-xs text-gray-400">
                        {new Date(tsColumn).toLocaleString()}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {statusLogs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-extrabold text-gray-900 mb-4">Status Change Logs</h2>
              <div className="space-y-3">
                {statusLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-green-200 pl-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {ORDER_STATUS_LABEL[normalizeOrderStatus(log.to_status)]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.changed_at).toLocaleString()}
                      {log.changed_by ? ` · ${log.changed_by}` : ''}
                      {log.note ? ` · ${log.note}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-4">Delivery Address</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {order.address_line}<br />
              {order.city}{order.state ? `, ${order.state}` : ''}<br />
              {order.country}{order.postal_code ? ` ${order.postal_code}` : ''}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900">Items Ordered</h2>
            </div>
            {items && items.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Qty</th>
                    <th className="px-6 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-3 font-medium text-gray-900">{item.product_name}</td>
                      <td className="px-6 py-3 text-right text-gray-500">${item.product_price?.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-3 text-right font-bold text-green-700">${item.subtotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right font-semibold text-gray-700">Subtotal</td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-700">${Number(order.subtotal_amount ?? 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right font-semibold text-gray-700">Shipping</td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-700">${Number(order.shipping_fee ?? 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-extrabold text-gray-900">Total</td>
                    <td className="px-6 py-4 text-right font-extrabold text-green-700 text-lg">${order.total_amount?.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p className="text-gray-400 text-sm px-6 py-4">No items found.</p>
            )}
          </div>
        </div>

        {/* Update Status */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="font-extrabold text-gray-900 mb-5">Update Status</h2>
            <OrderStatusUpdater
              orderId={order.id}
              currentStatus={normalizedStatus}
              trackingNumber={order.tracking_number}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
