import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { normalizeOrderStatus, ORDER_STATUS_TIMESTAMP_COLUMN } from '@/lib/order-status'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, trackingNumber } = await req.json()
    const normalized = normalizeOrderStatus(status)
    const nowIso = new Date().toISOString()

    const { data: existingOrder, error: existingError } = await supabaseAdmin
      .from('orders')
      .select('status')
      .eq('id', id)
      .single()

    if (existingError || !existingOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    const fromStatus = normalizeOrderStatus(existingOrder.status)
    const updatePayload: Record<string, unknown> = {
      status: normalized,
      tracking_number:
        typeof trackingNumber === 'string' && trackingNumber.trim()
          ? trackingNumber.trim()
          : null,
    }
    updatePayload[ORDER_STATUS_TIMESTAMP_COLUMN[normalized]] = nowIso

    let updateResult = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (
      updateResult.error &&
      (/column .* does not exist/i.test(updateResult.error.message) ||
        /could not find the .* column/i.test(updateResult.error.message))
    ) {
      updateResult = await supabaseAdmin
        .from('orders')
        .update({ status: normalized })
        .eq('id', id)
        .select()
        .single()
    }

    if (updateResult.error) return NextResponse.json({ error: updateResult.error.message }, { status: 500 })

    if (fromStatus !== normalized) {
      const { error: logError } = await supabaseAdmin
        .from('order_status_logs')
        .insert({
          order_id: id,
          from_status: fromStatus,
          to_status: normalized,
          changed_by: 'admin',
          note: updatePayload.tracking_number ? `Tracking: ${String(updatePayload.tracking_number)}` : null,
        })

      if (
        logError &&
        !/relation .* does not exist|could not find the table|column .* does not exist|could not find the .* column/i.test(
          logError.message
        )
      ) {
        console.error('Status log insert warning:', logError)
      }
    }

    return NextResponse.json(updateResult.data)
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
