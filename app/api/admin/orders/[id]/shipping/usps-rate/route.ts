import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { assertSameOrigin } from '@/lib/security/same-origin'
import { getDefaultParcel, getShipFromAddress } from '@/lib/shipping/label-config'
import { getUspsDomesticRate } from '@/lib/shipping/usps-client'
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
    return NextResponse.json({ error: 'USPS API is not configured.' }, { status: 503 })
  }

  try {
    const { id } = await params
    const from = getShipFromAddress()!
    const parcel = getDefaultParcel()

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, postal_code, shipping_method')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    if (order.shipping_method === 'pickup') {
      return NextResponse.json({ error: 'Pickup order.' }, { status: 400 })
    }

    const rate = await getUspsDomesticRate({
      fromZip: from.zip,
      toZip: order.postal_code ?? '',
      parcel,
    })

    if (!rate) {
      return NextResponse.json({ error: 'No USPS rate returned for this package.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, parcel, ...rate })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not fetch USPS rate.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
