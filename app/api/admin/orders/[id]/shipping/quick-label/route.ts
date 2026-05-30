import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { assertSameOrigin } from '@/lib/security/same-origin'
import { applyLabelToOrder } from '@/lib/shipping/apply-label-to-order'
import {
  getDefaultParcel,
  getPreferredCarrier,
  getPreferredCarrierServiceName,
  getShipFromAddress,
  getShippoCarrierAccountIds,
  isShippoConfigured,
} from '@/lib/shipping/label-config'
import { getShippoRates, pickPreferredCarrierRate, purchaseShippoLabel } from '@/lib/shipping/shippo-client'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = assertSameOrigin(_req)
  if (!originCheck.ok) return originCheck.response

  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  if (!isShippoConfigured()) {
    return NextResponse.json({ error: 'Shippo is not configured.' }, { status: 503 })
  }

  try {
    const { id } = await params
    const parcel = getDefaultParcel()
    const carrier = getPreferredCarrier()
    const preferredService = getPreferredCarrierServiceName(carrier)

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
    const carrierAccountIds = getShippoCarrierAccountIds()
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
      carrierAccountIds: carrierAccountIds.length > 0 ? carrierAccountIds : undefined,
    })

    const picked = pickPreferredCarrierRate(rates, carrier, preferredService)
    if (!picked) {
      return NextResponse.json(
        {
          error: `No ${carrier} rates returned. Check the ship-to address or Shippo account.`,
        },
        { status: 400 }
      )
    }

    const label = await purchaseShippoLabel(picked.id)
    const applied = await applyLabelToOrder(id, label)
    if (!applied.ok) {
      return NextResponse.json({ error: applied.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      parcel,
      preferredService,
      preferredCarrier: carrier,
      trackingNumber: label.trackingNumber,
      labelUrl: label.labelUrl,
      carrier: label.carrier,
      serviceName: label.serviceName,
      amount: label.amount,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not buy label.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
