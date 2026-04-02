'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUS_ADMIN_LABEL, ORDER_STATUS_COLORS, ORDER_STATUS_FLOW, type OrderStatus } from '@/lib/order-status'

const STATUSES: OrderStatus[] = [...ORDER_STATUS_FLOW, 'cancelled']

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  trackingNumber,
}: {
  orderId: string
  currentStatus: string
  trackingNumber?: string | null
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<OrderStatus>((currentStatus as OrderStatus) ?? 'ordered')
  const [tracking, setTracking] = useState(trackingNumber ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const dirty = selected !== currentStatus || (tracking ?? '') !== (trackingNumber ?? '')

  async function handleUpdate() {
    if (!dirty) return
    setLoading(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selected, trackingNumber: tracking }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Could not update order status.')
        return
      }
      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {STATUSES.map(status => {
        const label = ORDER_STATUS_ADMIN_LABEL[status]
        const color = ORDER_STATUS_COLORS[status].replace('100', '50').replace('600', '500').replace('700', '600')
        return (
          <button
            key={status}
            onClick={() => setSelected(status)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
              selected === status
                ? color + ' ring-2 ring-offset-1 ring-green-500'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        )
      })}

      <div className="pt-2">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Tracking Number (optional)</label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="e.g. LQAM-2026-00124"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading || !dirty}
        className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving…' : saved ? '✓ Saved!' : 'Update Status'}
      </button>
    </div>
  )
}
