import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { assertSameOrigin } from '@/lib/security/same-origin'
import { applyUspsLabelToOrder } from '@/lib/shipping/apply-usps-label'
import { getDefaultParcel, getShipFromAddress } from '@/lib/shipping/label-config'
import { isShippoConfigured, createShippoDomesticLabel, type ShippoLabelResult } from '@/lib/shipping/shippo-client'
import { createUspsDomesticLabel } from '@/lib/shipping/usps-client'
import { isUspsConfigured } from '@/lib/shipping/usps-config'
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

  const useShippo = isShippoConfigured()
  const useUsps = isUspsConfigured()

  if (!useShippo && !useUsps) {
    return NextResponse.json(
      {
        error:
          'No shipping provider configured. Add SHIPPO_API_TOKEN (recommended) or USPS API credentials in Vercel.',
      },
      { status: 503 }
    )
  }

  try {
    const { id } = await params
    const body = await _req.json().catch(() => ({}))
    const defaultParcel = getDefaultParcel()
    // Allow per-request parcel override from admin UI
    const parcel = {
      weightLb: Number(body?.parcel?.weightLb) > 0 ? Number(body.parcel.weightLb) : defaultParcel.weightLb,
      lengthIn: Number(body?.parcel?.lengthIn) > 0 ? Number(body.parcel.lengthIn) : defaultParcel.lengthIn,
      widthIn:  Number(body?.parcel?.widthIn)  > 0 ? Number(body.parcel.widthIn)  : defaultParcel.widthIn,
      heightIn: Number(body?.parcel?.heightIn) > 0 ? Number(body.parcel.heightIn) : defaultParcel.heightIn,
    }
    const from = getShipFromAddress()!

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(
        'id, customer_name, address_line, city, state, postal_code, country, shipping_method'
      )
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    if (order.shipping_method === 'pickup') {
      return NextResponse.json({ error: 'Pickup orders do not need a label.' }, { status: 400 })
    }

    const to = {
      name: order.customer_name ?? 'Customer',
      street1: order.address_line ?? '',
      city: order.city ?? '',
      state: order.state ?? '',
      zip: order.postal_code ?? '',
    }

    let label: ShippoLabelResult | Awaited<ReturnType<typeof createUspsDomesticLabel>>

    if (useShippo) {
      label = await createShippoDomesticLabel({ from, to, parcel })
    } else {
      label = await createUspsDomesticLabel({ from, to, parcel })
    }

    const applied = await applyUspsLabelToOrder(id, label)
    if (!applied.ok) {
      return NextResponse.json({ error: applied.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      trackingNumber: label.trackingNumber,
      postage: label.postage,
      mailClass: label.mailClass,
      labelUrl: applied.labelUrl,
      labelPdfBase64: label.pdf.toString('base64'),
      provider: useShippo ? 'shippo' : 'usps',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not create shipping label.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
