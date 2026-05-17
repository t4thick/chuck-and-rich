import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PAYMENT_LABEL, type PaymentMethod } from '@/lib/payment-methods'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'
import { RefundButton } from '@/components/admin/RefundButton'
import { ORDER_STATUS_LABEL, ORDER_STATUS_FLOW, getStatusStepIndex, normalizeOrderStatus } from '@/lib/order-status'
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
    logsResult.error && /relation .* does not exist|could not find the table/i.test(logsResult.error.message)
      ? []
      : (logsResult.data ?? [])

  return (
    <div className="stack">
      <p><Link href="/admin/orders">← Back to orders</Link></p>

      <h2>Order detail</h2>
      <p className="muted">{order.id}</p>
      <p><strong>Status:</strong> {ORDER_STATUS_LABEL[normalizedStatus]}</p>

      <h3>Customer</h3>
      <table>
        <tbody>
          <tr><th>Name</th><td>{order.customer_name}</td></tr>
          <tr><th>Email</th><td>{order.customer_email}</td></tr>
          {order.customer_phone && <tr><th>Phone</th><td>{order.customer_phone}</td></tr>}
          <tr><th>Placed</th><td>{new Date(order.created_at).toLocaleString()}</td></tr>
          <tr><th>Payment</th><td>{paymentLabel}</td></tr>
          <tr><th>Shipping</th><td>{shippingLabel} (zone: {order.shipping_zone ?? 'n/a'})</td></tr>
          <tr><th>Tracking #</th><td>{order.tracking_number ?? '—'}</td></tr>
          {order.refunded_at && (
            <tr><th>Refunded</th><td>{new Date(order.refunded_at).toLocaleString()} (${Number(order.refund_amount ?? 0).toFixed(2)})</td></tr>
          )}
        </tbody>
      </table>

      <h3>Delivery address</h3>
      <p>
        {order.address_line}<br />
        {order.city}{order.state ? `, ${order.state}` : ''}{order.postal_code ? ` ${order.postal_code}` : ''}<br />
        {order.country}
      </p>

      <h3>Delivery timeline</h3>
      <ol>
        {ORDER_STATUS_FLOW.map((step, index) => {
          const done = statusIndex >= index
          const tsColumn =
            step === 'ordered' ? order.ordered_at :
            step === 'processing' ? order.processing_at :
            step === 'shipped' ? order.shipped_at :
            step === 'out_for_delivery' ? order.out_for_delivery_at :
            order.delivered_at
          return (
            <li key={step}>
              {done ? '✓ ' : '○ '}
              {done ? <strong>{ORDER_STATUS_LABEL[step]}</strong> : ORDER_STATUS_LABEL[step]}
              {done && tsColumn && <> — <span className="muted">{new Date(tsColumn).toLocaleString()}</span></>}
            </li>
          )
        })}
      </ol>

      {statusLogs.length > 0 && (
        <>
          <h3>Status logs</h3>
          <table>
            <thead><tr><th>When</th><th>From</th><th>To</th><th>By</th><th>Note</th></tr></thead>
            <tbody>
              {statusLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.changed_at).toLocaleString()}</td>
                  <td>{log.from_status ? ORDER_STATUS_LABEL[normalizeOrderStatus(log.from_status)] : '—'}</td>
                  <td>{ORDER_STATUS_LABEL[normalizeOrderStatus(log.to_status)]}</td>
                  <td>{log.changed_by ?? '—'}</td>
                  <td>{log.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Items</h3>
      {items && items.length > 0 ? (
        <table>
          <thead>
            <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>${Number(item.product_price ?? 0).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${Number(item.subtotal ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3}>Subtotal</td><td>${Number(order.subtotal_amount ?? 0).toFixed(2)}</td></tr>
            <tr><td colSpan={3}>Shipping</td><td>${Number(order.shipping_fee ?? 0).toFixed(2)}</td></tr>
            <tr><td colSpan={3}><strong>Total</strong></td><td><strong>${Number(order.total_amount ?? 0).toFixed(2)}</strong></td></tr>
          </tfoot>
        </table>
      ) : (
        <p>No items.</p>
      )}

      <hr />

      <h3>Update status</h3>
      <OrderStatusUpdater
        orderId={order.id}
        currentStatus={normalizedStatus}
        trackingNumber={order.tracking_number}
      />

      {pm === 'stripe' && !order.refunded_at && (
        <>
          <h3>Refund</h3>
          <RefundButton
            orderId={order.id}
            maxAmount={Number(order.total_amount ?? 0)}
          />
        </>
      )}
    </div>
  )
}
