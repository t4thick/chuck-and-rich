import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, getStatusStepIndex, normalizeOrderStatus } from '@/lib/order-status'
import { normalizePaymentMethod } from '@/lib/payment-methods'
import { SHIPPING_METHOD_LABEL, type ShippingMethod } from '@/lib/shipping'

export const dynamic = 'force-dynamic'

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const supabase = await createClientOptional()
  if (!supabase) redirect('/login?next=/order-confirmation&error=configuration')
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/order-confirmation')

  const { id } = await searchParams

  let order: {
    id: string
    status: string
    shipping_method: string | null
    shipping_fee: number | null
    total_amount: number | null
    subtotal_amount: number | null
    tracking_number: string | null
    payment_method: string | null
  } | null = null

  if (id) {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('id,status,shipping_method,shipping_fee,total_amount,subtotal_amount,tracking_number,payment_method')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    order = data
  }

  const normalizedStatus = normalizeOrderStatus(order?.status)
  const statusIndex = getStatusStepIndex(order?.status)
  const shippingMethod = (order?.shipping_method as ShippingMethod | null | undefined) ?? 'standard'
  const paymentMethod = order ? normalizePaymentMethod(order.payment_method) : null

  return (
    <div className="stack">
      <h2>Order placed</h2>
      <p>Thank you for shopping with Lovely Queen African Market.</p>

      {paymentMethod === 'stripe' && <p className="success">Payment received via Stripe. Confirmation email on the way.</p>}
      {paymentMethod === 'cod' && <p>Cash on delivery — pay when your order arrives.</p>}

      {id && <p><strong>Order reference:</strong> <code>{id}</code></p>}

      {!order && id && <p className="error">We couldn&apos;t find that order under your account.</p>}

      {order && (
        <>
          <h3>Delivery progress</h3>
          <ol>
            {ORDER_STATUS_FLOW.map((step, index) => {
              const done = statusIndex >= index
              return (
                <li key={step}>
                  {done ? '✓ ' : '○ '}
                  {done ? <strong>{ORDER_STATUS_LABEL[step]}</strong> : ORDER_STATUS_LABEL[step]}
                </li>
              )
            })}
          </ol>
          <table>
            <tbody>
              <tr><th>Current status</th><td>{ORDER_STATUS_LABEL[normalizedStatus]}</td></tr>
              <tr><th>Shipping method</th><td>{SHIPPING_METHOD_LABEL[shippingMethod]}</td></tr>
              <tr><th>Shipping fee</th><td>${Number(order.shipping_fee ?? 0).toFixed(2)}</td></tr>
              <tr><th>Total</th><td>${Number(order.total_amount ?? 0).toFixed(2)}</td></tr>
              {order.tracking_number && <tr><th>Tracking #</th><td>{order.tracking_number}</td></tr>}
            </tbody>
          </table>
        </>
      )}

      <p>
        {order && <Link href={`/track-order?id=${encodeURIComponent(order.id)}`}>Track this order</Link>}
        {' · '}
        <Link href="/account">My account</Link>
        {' · '}
        <Link href="/shop">Continue shopping</Link>
      </p>
    </div>
  )
}
