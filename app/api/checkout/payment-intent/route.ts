import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sanitizeCartItems } from '@/lib/order-pricing'
import {
  CHECKOUT_PRODUCT_SELECT,
  computeCheckoutTotals,
  type ProductWithCategory,
} from '@/lib/checkout-totals'
import { normalizeShippingCountry, normalizeShippingRegion } from '@/lib/shipping'
import type { CartItem } from '@/types'
import { getStripe } from '@/lib/stripe'
import type { CheckoutSnapshotPayload } from '@/lib/orders/checkout-snapshot'
import { assertSameOrigin } from '@/lib/security/same-origin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const originCheck = assertSameOrigin(req)
  if (!originCheck.ok) return originCheck.response

  try {
    const supabaseUser = await createClient()
    const {
      data: { user },
    } = await supabaseUser.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please sign in before checking out.' }, { status: 401 })
    }

    const accountEmail = user.email?.trim().toLowerCase()
    if (!accountEmail) {
      return NextResponse.json({ error: 'Your account is missing an email address.' }, { status: 400 })
    }

    const body = await req.json()
    const {
      name,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      items,
      shippingMethod: rawShippingMethod,
    } = body

    if (!name || !address || !city || !country || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const cartItems = (Array.isArray(items) ? items : []) as CartItem[]
    const phoneTrim = typeof phone === 'string' ? phone.trim() : ''
    if (!phoneTrim) {
      return NextResponse.json(
        { error: 'Phone number is required so we can confirm your order.' },
        { status: 400 }
      )
    }

    const sanitizedItems = sanitizeCartItems(cartItems)
    if (sanitizedItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty or invalid.' }, { status: 400 })
    }

    const candidateProductIds = Array.from(new Set(sanitizedItems.map((item) => item.productId)))
    const { data: productRows, error: productError } = await supabaseAdmin
      .from('products')
      .select(CHECKOUT_PRODUCT_SELECT)
      .in('id', candidateProductIds)

    if (productError) {
      console.error('Product lookup error:', productError)
      return NextResponse.json({ error: 'Could not verify cart items.' }, { status: 500 })
    }

    const productMap = new Map<string, ProductWithCategory>(
      (productRows ?? []).map((product) => [product.id, product as ProductWithCategory])
    )

    if (productMap.size !== candidateProductIds.length) {
      return NextResponse.json(
        { error: 'One or more items are no longer available. Please review your cart.' },
        { status: 400 }
      )
    }

    const unavailable = sanitizedItems
      .map((item) => productMap.get(item.productId))
      .filter((product): product is ProductWithCategory => !!product && !product.in_stock)

    if (unavailable.length > 0) {
      return NextResponse.json(
        {
          error: `These items are currently unavailable: ${unavailable.map((p) => p.name).join(', ')}.`,
        },
        { status: 400 }
      )
    }

    const normalizedCountry = normalizeShippingCountry(country)
    const normalizedState = normalizeShippingRegion(state)
    const totals = computeCheckoutTotals({
      items: sanitizedItems,
      productMap,
      country: normalizedCountry,
      state: normalizedState,
      shippingMethod: rawShippingMethod,
    })
    const { subtotal, shipping, tax } = totals
    const shipping_method = shipping.method

    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!stripeKey) {
      console.error('[checkout] STRIPE_SECRET_KEY is not set in the deployment environment.')
      return NextResponse.json(
        { error: 'Online payments are temporarily unavailable. Please contact the store to complete your order.' },
        { status: 503 },
      )
    }

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
    if (!publishableKey) {
      return NextResponse.json(
        { error: 'Payments are not configured: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. Set it in .env.local and on Vercel.' },
        { status: 503 },
      )
    }

    // Both keys must come from the same Stripe account. Modern Stripe keys
    // (issued since ~2020) embed a 17-char account ID immediately after the
    // mode prefix, e.g. `sk_test_51TJNzEJHvbwKGXut<rest>` — the `51TJNzEJHvbwKGXut`
    // part is identical between the secret and publishable keys of the same account.
    // Older keys without a visible account ID won't match this pattern; in that
    // case we silently skip the check (Stripe will surface the real error).
    const accountIdFrom = (key: string): string | null => {
      const m = key.match(/^(?:sk|pk|rk)_(?:test|live)_([A-Za-z0-9]{17})/)
      return m ? m[1] : null
    }
    const secretAcct = accountIdFrom(stripeKey)
    const publishableAcct = accountIdFrom(publishableKey)
    if (secretAcct && publishableAcct && secretAcct !== publishableAcct) {
      return NextResponse.json(
        {
          error:
            'Stripe key mismatch: STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are from different Stripe accounts. ' +
            'Copy both keys from the SAME account at dashboard.stripe.com/test/apikeys.',
        },
        { status: 503 },
      )
    }

    const payload: CheckoutSnapshotPayload = {
      items: sanitizedItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      customer_name: String(name).trim(),
      customer_phone: phoneTrim,
      address_line: String(address).trim(),
      city: String(city).trim(),
      state: normalizedState || null,
      country: normalizedCountry,
      postal_code: typeof postalCode === 'string' ? postalCode.trim() : null,
      shipping_method,
      shipping_zone: shipping.zone,
      account_email: accountEmail,
    }

    const { data: snap, error: snapErr } = await supabaseAdmin
      .from('checkout_snapshots')
      .insert({
        user_id: user.id,
        payload,
      })
      .select('id')
      .single()

    if (snapErr || !snap) {
      console.error('[checkout] snapshot insert', snapErr)
      return NextResponse.json({ error: 'Could not prepare checkout.' }, { status: 500 })
    }

    const amountCents = Math.round(totals.total * 100)
    if (amountCents < 50) {
      await supabaseAdmin.from('checkout_snapshots').delete().eq('id', snap.id)
      return NextResponse.json({ error: 'Order total is too small.' }, { status: 400 })
    }

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: user.id,
        checkout_snapshot_id: snap.id,
      },
      receipt_email: accountEmail,
    })

    if (!paymentIntent.client_secret) {
      await supabaseAdmin.from('checkout_snapshots').delete().eq('id', snap.id)
      return NextResponse.json({ error: 'Could not start payment.' }, { status: 500 })
    }

    await supabaseAdmin
      .from('checkout_snapshots')
      .update({ payment_intent_id: paymentIntent.id })
      .eq('id', snap.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subtotal,
      shippingFee: shipping.fee,
      taxAmount: tax.taxAmount,
      taxApplies: tax.applies,
      total: totals.total,
    })
  } catch (err) {
    console.error('payment-intent error:', err)
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
  }
}
