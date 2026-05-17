'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, type OrderStatus } from '@/lib/order-status'

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
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const dirty = selected !== currentStatus || (tracking ?? '') !== (trackingNumber ?? '') || note.trim() !== ''

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!dirty) return
    setLoading(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selected, trackingNumber: tracking, note: note || undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Could not update order.')
        return
      }
      setSaved(true)
      setNote('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdate} className="stack">
      <p>
        <label>
          Status:{' '}
          <select value={selected} onChange={(e) => setSelected(e.target.value as OrderStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
            ))}
          </select>
        </label>
      </p>
      <p>
        <label>
          Tracking number:{' '}
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. LQAM-2026-00124"
            style={{ width: '20em' }}
          />
        </label>
      </p>
      <p>
        <label>
          Note (optional, logged):<br />
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} style={{ width: '100%' }} />
        </label>
      </p>
      {error && <p className="error">{error}</p>}
      {saved && <p className="success">Saved.</p>}
      <button type="submit" disabled={loading || !dirty}>
        {loading ? 'Saving…' : 'Update order'}
      </button>
    </form>
  )
}
