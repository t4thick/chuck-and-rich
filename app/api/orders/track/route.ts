import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { normalizeOrderStatus } from '@/lib/order-status'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to track your orders.' }, { status: 401 })
  }

  if (!id) {
    return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  const [{ data: items }, logsResult] = await Promise.all([
    supabaseAdmin
      .from('order_items')
      .select('id,product_name,product_price,quantity,subtotal')
      .eq('order_id', id),
    supabaseAdmin
      .from('order_status_logs')
      .select('id,from_status,to_status,changed_at,changed_by,note')
      .eq('order_id', id)
      .order('changed_at', { ascending: true }),
  ])

  const logs =
    logsResult.error &&
    /relation .* does not exist|could not find the table/i.test(logsResult.error.message)
      ? []
      : (logsResult.data ?? [])

  return NextResponse.json({
    order: { ...order, status: normalizeOrderStatus(order.status) },
    items: items ?? [],
    logs,
  })
}
