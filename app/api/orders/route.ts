import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  buildAuthoritativeOrderItems,
  sanitizeCartItems,
  type AuthoritativeProduct,
} from '@/lib/order-pricing'
import { normalizePaymentMethod } from '@/lib/payment-methods'
import {
  calculateShipping,
  normalizeShippingCountry,
  normalizeShippingMethod,
  normalizeShippingRegion,
} from '@/lib/shipping'
import type { CartItem } from '@/types'

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
      name, phone,
      address, city, state, country, postalCode,
      items, total,
      paymentMethod: rawPaymentMethod,
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

    const payment_method = normalizePaymentMethod(rawPaymentMethod)
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
    const computedTotal = Number((subtotal + shipping.fee).toFixed(2))
    const clientTotal = Number(total)

    if (Number.isFinite(clientTotal) && Math.abs(clientTotal - computedTotal) > 0.01) {
      return NextResponse.json(
        {
          error: 'Order total changed. Please review checkout totals and try again.',
          totals: { subtotal, shipping: shipping.fee, total: computedTotal },
        },
        { status: 400 }
      )
    }

    const primaryInsert = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: name.trim(),
        customer_email: accountEmail,
        customer_phone: phoneTrim,
        address_line: address.trim(),
        city: city.trim(),
        state: normalizedState || null,
        country: normalizedCountry || 'united states',
        postal_code: typeof postalCode === 'string' ? postalCode.trim() || null : null,
        subtotal_amount: subtotal,
        shipping_fee: shipping.fee,
        shipping_method,
        shipping_zone: shipping.zone,
        total_amount: computedTotal,
        status: 'ordered',
        ordered_at: new Date().toISOString(),
        payment_method,
        user_id: user.id,
      })
      .select()
      .single()

    const order = primaryInsert.data
    const orderError = primaryInsert.error

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: orderError?.message ?? 'Could not create order.' }, { status: 500 })
    }

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(
        authoritativeItems.map((item) => ({
          order_id: order.id,
          ...item,
        }))
      )

    if (itemsError) {
      console.error('Order items insert error:', itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    const { error: logError } = await supabaseAdmin
      .from('order_status_logs')
      .insert({
        order_id: order.id,
        from_status: null,
        to_status: 'ordered',
        changed_by: 'system_checkout',
        note: 'Order placed at checkout',
      })

    if (
      logError &&
      !/relation .* does not exist|could not find the table|column .* does not exist|could not find the .* column/i.test(
        logError.message
      )
    ) {
      console.error('Order status log insert warning:', logError)
    }

    return NextResponse.json(
      {
        orderId: order.id,
        totals: {
          subtotal,
          shipping: shipping.fee,
          total: computedTotal,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
