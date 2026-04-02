'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, getStatusStepIndex, normalizeOrderStatus, type OrderStatus } from '@/lib/order-status'
import { SHIPPING_METHOD_LABEL, type ShippingMethod } from '@/lib/shipping'

type TrackOrderResponse = {
  order: {
    id: string
    status: string
    created_at: string
    total_amount: number | null
    subtotal_amount?: number | null
    shipping_fee?: number | null
    shipping_method?: string | null
    tracking_number?: string | null
    city?: string | null
    country?: string | null
  }
  items: Array<{
    id: string
    product_name: string
    product_price: number
    quantity: number
    subtotal: number
  }>
  logs: Array<{
    id: string
    from_status: string | null
    to_status: string
    changed_at: string
    changed_by: string | null
    note: string | null
  }>
}

export function TrackOrderClient() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('id') ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<TrackOrderResponse | null>(null)

  const status = useMemo<OrderStatus>(
    () => normalizeOrderStatus(data?.order?.status),
    [data?.order?.status]
  )
  const stepIndex = getStatusStepIndex(status)
  const shippingMethod = ((data?.order?.shipping_method as ShippingMethod | undefined) ?? 'standard')

  async function fetchOrder() {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId.trim())}`)
      const payload = await res.json()
      if (!res.ok) {
        setError(payload.error ?? 'Could not find this order.')
        return
      }
      setData(payload)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await fetchOrder()
  }

  useEffect(() => {
    if (orderId.trim()) {
      void fetchOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="page-shell">
      <div className="page-container max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Order tracking</p>
          <h1 className="section-title">Track your order</h1>
          <p className="section-subtitle mt-2">
            Signed-in customers can look up any order linked to their account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order ID</label>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="e.g. 57534587-9fea-..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full sm:w-auto min-h-[44px] px-6 bg-[#1a4731] hover:bg-[#236641] text-white font-bold rounded-xl disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Track Order'}
          </button>
          <p className="mt-3 text-xs text-gray-500">
            For privacy, order details are only available while signed in to the account that placed the order.
          </p>
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}
        </form>

        {data && (
          <div className="space-y-6">
            <section className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Order</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{data.order.id}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  {ORDER_STATUS_LABEL[status]}
                </span>
              </div>

              <div className="space-y-3">
                {ORDER_STATUS_FLOW.map((step, index) => {
                  const done = stepIndex >= index
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${done ? 'bg-[#1a4731] text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {done ? '✓' : index + 1}
                      </span>
                      <p className={done ? 'text-sm font-semibold text-gray-900' : 'text-sm text-gray-500'}>
                        {ORDER_STATUS_LABEL[step]}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm text-gray-600">
                <p>Shipping: <span className="font-semibold text-gray-900">{SHIPPING_METHOD_LABEL[shippingMethod]}</span></p>
                <p>Tracking: <span className="font-semibold text-gray-900">{data.order.tracking_number ?? 'Not assigned yet'}</span></p>
                <p>Destination: <span className="font-semibold text-gray-900">{data.order.city ?? '-'}, {data.order.country ?? '-'}</span></p>
                <p>Total: <span className="font-semibold text-gray-900">${Number(data.order.total_amount ?? 0).toFixed(2)}</span></p>
              </div>
            </section>

            {data.logs.length > 0 && (
              <section className="panel p-6">
                <h2 className="font-bold text-gray-900 mb-3">Status Log</h2>
                <div className="space-y-3">
                  {data.logs.map((log) => (
                    <div key={log.id} className="text-sm border-l-2 border-emerald-200 pl-3">
                      <p className="font-semibold text-gray-800">
                        {ORDER_STATUS_LABEL[normalizeOrderStatus(log.to_status)]}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(log.changed_at).toLocaleString()}
                        {log.changed_by ? ` · ${log.changed_by}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/shop" className="text-[#236641] hover:underline text-sm font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
