import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { normalizeOrderStatus } from '@/lib/order-status'
import { parseOrderRef } from '@/lib/orders/order-number'

export async function GET(req: NextRequest) {
  const idRaw = req.nextUrl.searchParams.get('id')?.trim()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to track your orders.' }, { status: 401 })
  }

  const ref = parseOrderRef(idRaw)
  if (!ref) {
    return NextResponse.json(
      { error: 'Enter your order number (e.g. LQ-1042) or order ID.' },
      { status: 400 }
    )
  }

  let query = supabaseAdmin
    .from('orders')
    .select('*')
    .eq('user_id', user.id)

  query = ref.type === 'uuid' ? query.eq('id', ref.value) : query.eq('order_number', ref.value)

  const { data: order, error: orderError } = await query.maybeSingle()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  const [{ data: items }, logsResult] = await Promise.all([
    supabaseAdmin
      .from('order_items')
      .select('id,product_name,product_price,quantity,subtotal')
      .eq('order_id', order.id),
    supabaseAdmin
      .from('order_status_logs')
      .select('id,from_status,to_status,changed_at,changed_by,note')
      .eq('order_id', order.id)
      .order('changed_at', { ascending: true }),
  ])

  // PostgREST returns `PGRST205` when a table is missing from the schema cache, and
  // Postgres returns SQLSTATE `42P01` for "undefined table". Treat either as "no logs".
  const missingTable =
    !!logsResult.error &&
    (logsResult.error.code === 'PGRST205' || logsResult.error.code === '42P01')

  if (logsResult.error && !missingTable) {
    console.warn('[orders/track] logs query:', logsResult.error.message)
  }

  const logs = missingTable ? [] : (logsResult.data ?? [])

  return NextResponse.json({
    order: { ...order, status: normalizeOrderStatus(order.status) },
    items: items ?? [],
    logs,
  })
}
