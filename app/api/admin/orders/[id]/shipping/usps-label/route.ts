import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { assertSameOrigin } from '@/lib/security/same-origin'
import { applyUspsLabelToOrder } from '@/lib/shipping/apply-usps-label'
import { getDefaultParcel, getShipFromAddress } from '@/lib/shipping/label-config'
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

  if (!isUspsConfigured()) {
    return NextResponse.json(
      {
        error:
          'USPS API is not configured. Add USPS_API_CLIENT_ID, USPS_API_CLIENT_SECRET, USPS_EPS_ACCOUNT_NUMBER, USPS_CRID, and USPS_MID in Vercel.',
      },
      { status: 503 }
    )
  }

  try {
    const { id } = await params
    const parcel = getDefaultParcel()
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

    const label = await createUspsDomesticLabel({
      from,
      to: {
        name: order.customer_name ?? 'Customer',
        street1: order.address_line ?? '',
        city: order.city ?? '',
        state: order.state ?? '',
        zip: order.postal_code ?? '',
      },
      parcel,
    })

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
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not create USPS label.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
