import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

/**
 * Poll after returning from Stripe: payment confirmed on Stripe + order row exists after webhook.
 */
export async function GET(req: NextRequest) {
  const supabaseUser = await createClient()
  const {
    data: { user },
  } = await supabaseUser.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
  }

  const sessionId = req.nextUrl.searchParams.get('session_id')?.trim()
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        status: 'unpaid',
        paymentStatus: session.payment_status,
      })
    }

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('stripe_checkout_session_id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (order?.id) {
      return NextResponse.json({
        status: 'complete',
        orderId: order.id,
      })
    }

    return NextResponse.json({
      status: 'processing',
      message: 'Payment received — finalizing your order…',
    })
  } catch (e) {
    console.error('[checkout/status]', e)
    return NextResponse.json({ error: 'Could not load payment status.' }, { status: 500 })
  }
}
