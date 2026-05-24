import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendOrderStatusEmail } from '@/lib/email/send-order-emails'
import { normalizeOrderStatus, ORDER_STATUS_TIMESTAMP_COLUMN } from '@/lib/order-status'
import type { ShippoLabelResult } from '@/lib/shipping/shippo-client'

export async function applyLabelToOrder(
  orderId: string,
  label: ShippoLabelResult
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: order, error: fetchErr } = await supabaseAdmin
    .from('orders')
    .select(
      'id, status, order_number, customer_name, customer_email, total_amount, shipping_method'
    )
    .eq('id', orderId)
    .single()

  if (fetchErr || !order) {
    return { ok: false, error: 'Order not found.' }
  }

  if (order.shipping_method === 'pickup') {
    return { ok: false, error: 'Pickup orders do not need a shipping label.' }
  }

  const fromStatus = normalizeOrderStatus(order.status)
  const toStatus = fromStatus === 'ordered' || fromStatus === 'processing' ? 'shipped' : fromStatus
  const nowIso = new Date().toISOString()

  const updatePayload: Record<string, unknown> = {
    tracking_number: label.trackingNumber,
    shipping_label_url: label.labelUrl,
    shipping_carrier: label.carrier,
    shipping_service: label.serviceName,
    label_purchased_at: nowIso,
    status: toStatus,
  }
  updatePayload[ORDER_STATUS_TIMESTAMP_COLUMN[toStatus]] = nowIso

  let updateResult = await supabaseAdmin
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId)
    .select()
    .single()

  if (
    updateResult.error &&
    (/column .* does not exist/i.test(updateResult.error.message) ||
      /could not find the .* column/i.test(updateResult.error.message))
  ) {
    updateResult = await supabaseAdmin
      .from('orders')
      .update({
        tracking_number: label.trackingNumber,
        status: toStatus,
      })
      .eq('id', orderId)
      .select()
      .single()
  }

  if (updateResult.error) {
    return { ok: false, error: updateResult.error.message }
  }

  const note = `${label.carrier} ${label.serviceName} — label $${label.amount.toFixed(2)} · Tracking: ${label.trackingNumber}`

  await supabaseAdmin.from('order_status_logs').insert({
    order_id: orderId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by: 'admin',
    note,
  })

  if (fromStatus !== toStatus && order.customer_email) {
    try {
      await sendOrderStatusEmail(
        {
          id: orderId,
          order_number: order.order_number ?? null,
          customer_name: order.customer_name ?? 'there',
          customer_email: order.customer_email,
          total_amount: Number(order.total_amount ?? 0),
          tracking_number: label.trackingNumber,
        },
        toStatus,
        note
      )
    } catch (e) {
      console.error('[applyLabelToOrder] status email failed:', e)
    }
  }

  return { ok: true }
}
