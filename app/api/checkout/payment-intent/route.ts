import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  buildAuthoritativeOrderItems,
  sanitizeCartItems,
  type AuthoritativeProduct,
} from '@/lib/order-pricing'
import {
  calculateShipping,
  normalizeShippingCountry,
  normalizeShippingMethod,
  normalizeShippingRegion,
} from '@/lib/shipping'
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
      .select('id,name,price,in_stock')
      .in('id', candidateProductIds)

    if (productError) {
      console.error('Product lookup error:', productError)
      return NextResponse.json({ error: 'Could not verify cart items.' }, { status: 500 })
    }

    const productMap = new Map<string, AuthoritativeProduct>(
      (productRows ?? []).map((product) => [product.id, product as AuthoritativeProduct])
    )

    if (productMap.size !== candidateProductIds.length) {
      return NextResponse.json(
        { error: 'One or more items are no longer available. Please review your cart.' },
        { status: 400 }
      )
    }

    const unavailable = sanitizedItems
      .map((item) => productMap.get(item.productId))
      .filter((product): product is AuthoritativeProduct => !!product && !product.in_stock)

    if (unavailable.length > 0) {
      return NextResponse.json(
        {
          error: `These items are currently unavailable: ${unavailable.map((p) => p.name).join(', ')}.`,
        },
        { status: 400 }
      )
    }

    const shipping_method = normalizeShippingMethod(rawShippingMethod)
    const normalizedCountry = normalizeShippingCountry(country)
    const normalizedState = normalizeShippingRegion(state)
    const { subtotal } = buildAuthoritativeOrderItems(sanitizedItems, productMap)
    const shipping = calculateShipping({
      subtotal,
      country: normalizedCountry,
      state: normalizedState,
      method: shipping_method,
    })

    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!stripeKey) {
      return NextResponse.json({ error: 'Payments are not configured (STRIPE_SECRET_KEY).' }, { status: 503 })
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

    const totalAmount = subtotal + shipping.fee
    const amountCents = Math.round(totalAmount * 100)
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

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('payment-intent error:', err)
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
  }
}
