import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { assertSameOrigin } from '@/lib/security/same-origin'
import {
  getDefaultParcel,
  getShipFromAddress,
  isShippoConfigured,
} from '@/lib/shipping/label-config'
import { getShippoRates } from '@/lib/shipping/shippo-client'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

function parseParcel(body: Record<string, unknown>) {
  const defaults = getDefaultParcel()
  const num = (key: string, fallback: number) => {
    const v = body[key]
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
    return Number.isFinite(n) && n > 0 ? n : fallback
  }
  return {
    weightLb: num('weightLb', defaults.weightLb),
    lengthIn: num('lengthIn', defaults.lengthIn),
    widthIn: num('widthIn', defaults.widthIn),
    heightIn: num('heightIn', defaults.heightIn),
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = assertSameOrigin(req)
  if (!originCheck.ok) return originCheck.response

  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  if (!isShippoConfigured()) {
    return NextResponse.json(
      {
        error:
          'Shipping labels are not configured. Add SHIPPO_API_TOKEN and ship-from address in Vercel → Environment Variables, then redeploy.',
        configured: false,
      },
      { status: 503 }
    )
  }

  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const parcel = parseParcel(body as Record<string, unknown>)
    const carrierFilter =
      body.carrier === 'USPS' || body.carrier === 'UPS' ? body.carrier : null

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(
        'id, customer_name, customer_phone, customer_email, address_line, city, state, postal_code, country, shipping_method'
      )
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    if (order.shipping_method === 'pickup') {
      return NextResponse.json({ error: 'Pickup orders do not need a label.' }, { status: 400 })
    }

    const from = getShipFromAddress()!
    const rates = await getShippoRates({
      from,
      to: {
        name: order.customer_name ?? 'Customer',
        street1: order.address_line ?? '',
        city: order.city ?? '',
        state: order.state ?? '',
        zip: order.postal_code ?? '',
        country: order.country ?? 'US',
        phone: order.customer_phone ?? undefined,
        email: order.customer_email ?? undefined,
      },
      parcel,
    })

    const filtered = carrierFilter
      ? rates.filter((r) => r.provider === carrierFilter)
      : rates

    return NextResponse.json({
      configured: true,
      parcel,
      rates: filtered,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not fetch shipping rates.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
