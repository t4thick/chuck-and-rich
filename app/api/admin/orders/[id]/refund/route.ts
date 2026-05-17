import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { assertSameOrigin } from '@/lib/security/same-origin'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = assertSameOrigin(req)
  if (!originCheck.ok) return originCheck.response

  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured.' }, { status: 500 })
  }
  const stripe = new Stripe(secret)

  try {
    const { id } = await params
    const { amount, reason } = await req.json()

    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('id, payment_intent_id, total_amount, refunded_at, payment_method')
      .eq('id', id)
      .single()

    if (fetchErr || !order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    if (order.refunded_at) return NextResponse.json({ error: 'Order already refunded.' }, { status: 400 })
    if (order.payment_method !== 'stripe' || !order.payment_intent_id) {
      return NextResponse.json({ error: 'Order has no Stripe payment to refund.' }, { status: 400 })
    }

    const amountCents = Math.round(Number(amount) * 100)
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.json({ error: 'Invalid refund amount.' }, { status: 400 })
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.payment_intent_id,
      amount: amountCents,
      reason: 'requested_by_customer',
    })

    await supabaseAdmin
      .from('orders')
      .update({
        refunded_at: new Date().toISOString(),
        refund_amount: Number(amount),
        refund_stripe_id: refund.id,
      })
      .eq('id', id)

    await supabaseAdmin.from('order_status_logs').insert({
      order_id: id,
      from_status: null,
      to_status: 'cancelled',
      changed_by: 'admin',
      note: `Refunded $${Number(amount).toFixed(2)}${reason ? ` — ${reason}` : ''}`,
    })

    return NextResponse.json({ ok: true, refundId: refund.id })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Refund failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
