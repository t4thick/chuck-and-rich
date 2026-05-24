import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { assertSameOrigin } from '@/lib/security/same-origin'
import { applyLabelToOrder } from '@/lib/shipping/apply-label-to-order'
import { isShippoConfigured } from '@/lib/shipping/label-config'
import { purchaseShippoLabel } from '@/lib/shipping/shippo-client'

export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = assertSameOrigin(req)
  if (!originCheck.ok) return originCheck.response

  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  if (!isShippoConfigured()) {
    return NextResponse.json({ error: 'Shipping labels are not configured.' }, { status: 503 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const rateId = typeof body.rateId === 'string' ? body.rateId.trim() : ''

    if (!rateId) {
      return NextResponse.json({ error: 'Select a shipping rate first.' }, { status: 400 })
    }

    const label = await purchaseShippoLabel(rateId)
    const applied = await applyLabelToOrder(id, label)

    if (!applied.ok) {
      return NextResponse.json({ error: applied.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      trackingNumber: label.trackingNumber,
      labelUrl: label.labelUrl,
      carrier: label.carrier,
      serviceName: label.serviceName,
      amount: label.amount,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not purchase label.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
