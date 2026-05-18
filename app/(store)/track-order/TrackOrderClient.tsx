'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, getStatusStepIndex, normalizeOrderStatus, type OrderStatus } from '@/lib/order-status'
import { SHIPPING_METHOD_LABEL, type ShippingMethod } from '@/lib/shipping'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'

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
  const subscribedIdRef = useRef<string>('')

  const status = useMemo<OrderStatus>(() => normalizeOrderStatus(data?.order?.status), [data?.order?.status])
  const stepIndex = getStatusStepIndex(status)
  const shippingMethod = ((data?.order?.shipping_method as ShippingMethod | undefined) ?? 'standard')

  const fetchOrder = useCallback(async (idOverride?: string) => {
    const id = (idOverride ?? orderId).trim()
    if (!id) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(id)}`)
      const payload = await res.json()
      if (!res.ok) {
        setError(payload.error ?? 'Could not find this order.')
        setData(null)
        return
      }
      setData(payload)
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await fetchOrder()
  }

  useEffect(() => {
    if (orderId.trim()) void fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const id = data?.order?.id
    if (!id || subscribedIdRef.current === id) return
    if (!isSupabaseBrowserConfigured()) return
    subscribedIdRef.current = id

    const supabase = createClient()
    const channel = supabase
      .channel(`track-order-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, () => void fetchOrder(id))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_status_logs', filter: `order_id=eq.${id}` }, () => void fetchOrder(id))
      .subscribe()

    return () => {
      subscribedIdRef.current = ''
      void supabase.removeChannel(channel)
    }
  }, [data?.order?.id, fetchOrder])

  return (
    <div className="stack">
      <h2>Track order</h2>

      <form onSubmit={handleSubmit} className="row">
        <label>
          Order ID:{' '}
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            placeholder="57534587-9fea-…"
            style={{ width: '20em' }}
          />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Checking…' : 'Track'}</button>
      </form>

      <p className="muted">For privacy, order details are only available while signed in to the account that placed the order.</p>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="stack">
          <hr />
          <h3>Order {data.order.id}</h3>
          <p>
            <strong>Status:</strong> {ORDER_STATUS_LABEL[status]}
          </p>

          <ol>
            {ORDER_STATUS_FLOW.map((step, index) => {
              const done = stepIndex >= index
              return (
                <li key={step}>
                  {done ? '✓ ' : '○ '}
                  {done ? <strong>{ORDER_STATUS_LABEL[step]}</strong> : ORDER_STATUS_LABEL[step]}
                </li>
              )
            })}
          </ol>

          <table>
            <tbody>
              <tr><th>Shipping method</th><td>{SHIPPING_METHOD_LABEL[shippingMethod]}</td></tr>
              <tr><th>Tracking number</th><td>{data.order.tracking_number ?? '— not assigned yet'}</td></tr>
              <tr><th>Destination</th><td>{data.order.city ?? '-'}, {data.order.country ?? '-'}</td></tr>
              <tr><th>Total</th><td>${Number(data.order.total_amount ?? 0).toFixed(2)}</td></tr>
            </tbody>
          </table>

          {data.items.length > 0 && (
            <>
              <h4>Items</h4>
              <table>
                <thead><tr><th>Product</th><th>Qty</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {data.logs.length > 0 && (
            <>
              <h4>Status log</h4>
              <table>
                <thead><tr><th>When</th><th>Status</th><th>Note</th></tr></thead>
                <tbody>
                  {data.logs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.changed_at).toLocaleString()}</td>
                      <td>{ORDER_STATUS_LABEL[normalizeOrderStatus(log.to_status)]}</td>
                      <td>{log.note ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      <p><Link href="/shop">← Continue shopping</Link></p>
    </div>
  )
}
