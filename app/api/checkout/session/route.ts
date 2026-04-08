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
  SHIPPING_METHOD_LABEL,
  type ShippingMethod,
} from '@/lib/shipping'
import type { CartItem } from '@/types'
import { getStripe } from '@/lib/stripe'
import { getPublicSiteUrl } from '@/lib/site-url'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
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
    const { orderItems: authoritativeItems, subtotal } = buildAuthoritativeOrderItems(sanitizedItems, productMap)
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

    const stripe = getStripe()
    const baseUrl = getPublicSiteUrl()

    const productLines = authoritativeItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.product_price * 100),
        product_data: {
          name: item.product_name,
          metadata: {
            product_id: item.product_id,
          },
        },
      },
    }))

    const shippingLine = {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(shipping.fee * 100),
        product_data: {
          name: `Shipping (${SHIPPING_METHOD_LABEL[shipping_method as ShippingMethod] ?? shipping_method})`,
          metadata: {
            type: 'shipping',
          },
        },
      },
    }

    const lineItemsPayload =
      shipping.fee > 0 ? [...productLines, shippingLine] : [...productLines]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: accountEmail,
      client_reference_id: user.id,
      line_items: lineItemsPayload,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        user_id: user.id,
        customer_name: String(name).trim(),
        customer_phone: phoneTrim,
        address_line: String(address).trim(),
        city: String(city).trim(),
        state: normalizedState || '',
        country: normalizedCountry || '',
        postal_code: typeof postalCode === 'string' ? postalCode.trim() : '',
        shipping_method,
        shipping_zone: shipping.zone,
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
        },
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start Stripe Checkout.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('checkout session error:', err)
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
  }
}
