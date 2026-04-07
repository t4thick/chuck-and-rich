import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, getStatusStepIndex, normalizeOrderStatus } from '@/lib/order-status'
import { SHIPPING_METHOD_LABEL, type ShippingMethod } from '@/lib/shipping'

export const dynamic = 'force-dynamic'

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/order-confirmation')
  }

  const { id } = await searchParams

  let order: {
    id: string
    status: string
    shipping_method: string | null
    shipping_fee: number | null
    total_amount: number | null
    subtotal_amount: number | null
    tracking_number: string | null
  } | null = null

  if (id) {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('id,status,shipping_method,shipping_fee,total_amount,subtotal_amount,tracking_number')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    order = data
  }

  const normalizedStatus = normalizeOrderStatus(order?.status)
  const statusIndex = getStatusStepIndex(order?.status)
  const shippingMethod = (order?.shipping_method as ShippingMethod | null | undefined) ?? 'standard'

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-10 text-center">

        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed! 🎉</h1>

        <p className="text-gray-500 mb-3 leading-relaxed">
          Thank you for shopping with <strong className="text-green-700">Lovely Queen African Market</strong>.
          We&apos;ve received your order and will keep you updated as it moves through delivery.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 text-left text-sm text-amber-950">
          <p className="font-semibold text-amber-900 mb-1">Cash on delivery</p>
          <p className="text-amber-900/90 leading-snug">
            Pay with cash when your order arrives. Keep your phone handy — we&apos;ll call or text to confirm your
            delivery.
          </p>
        </div>

        {id && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 inline-block">
            <p className="text-xs text-gray-400 mb-0.5">Order Reference</p>
            <p className="text-xs font-mono text-gray-600 break-all">{id}</p>
          </div>
        )}

        {!order && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm text-left">
            We couldn&apos;t find that order under your account. Open it from your account orders list or place a new
            order while signed in.
          </div>
        )}

        {order && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-900 mb-3">Delivery Progress</p>
            <div className="space-y-2">
              {ORDER_STATUS_FLOW.map((step, index) => {
                const done = statusIndex >= index
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        done ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {done ? '✓' : index + 1}
                    </span>
                    <p className={done ? 'text-sm font-semibold text-gray-800' : 'text-sm text-gray-500'}>
                      {ORDER_STATUS_LABEL[step]}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
              <p>
                Current status: <span className="font-semibold">{ORDER_STATUS_LABEL[normalizedStatus]}</span>
              </p>
              <p>
                Shipping method: <span className="font-semibold">{SHIPPING_METHOD_LABEL[shippingMethod]}</span>
              </p>
              <p>
                Shipping fee:{' '}
                <span className="font-semibold">
                  ${Number(order.shipping_fee ?? 0).toFixed(2)}
                </span>
              </p>
              {order.tracking_number && (
                <p>
                  Tracking number: <span className="font-semibold">{order.tracking_number}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6 space-y-3">
          {order && (
            <Link
              href={`/track-order?id=${encodeURIComponent(order.id)}`}
              className="block w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Track This Order
            </Link>
          )}
          <Link
            href="/account"
            className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            View My Account
          </Link>
          <Link
            href="/shop"
            className="block w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
