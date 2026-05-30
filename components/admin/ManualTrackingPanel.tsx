'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  orderId: string
  initialTracking?: string | null
  currentStatus: string
  /** Shorter layout when shown as a fallback under auto-print. */
  compact?: boolean
}

export function ManualTrackingPanel({ orderId, initialTracking, currentStatus, compact = false }: Props) {
  const router = useRouter()
  const [tracking, setTracking] = useState(initialTracking ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const trimmed = tracking.trim()
  const dirty = trimmed !== (initialTracking ?? '').trim()

  async function markShipped(e: React.FormEvent) {
    e.preventDefault()
    if (!trimmed) {
      setError('Enter a tracking number.')
      return
    }
    setLoading(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: currentStatus === 'shipped' || currentStatus === 'delivered' ? currentStatus : 'shipped',
          trackingNumber: trimmed,
          note: 'Tracking added manually',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not save tracking.')
        return
      }
      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={
        compact
          ? 'space-y-3 rounded-xl border border-earth-200 bg-earth-50/50 p-4'
          : 'space-y-4 rounded-xl border border-brand-200 bg-brand-50/30 p-4'
      }
    >
      {!compact && (
        <div>
          <h3 className="text-sm font-semibold text-earth-900">Enter tracking manually</h3>
          <p className="mt-1 text-sm text-earth-600">
            Use this if the label was printed outside admin. The customer will see the tracking number
            on their order status page.
          </p>
        </div>
      )}

      <form onSubmit={markShipped} className="space-y-3">
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="manual-tracking">
            Tracking number
          </label>
          <Input
            id="manual-tracking"
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="1Z999AA10123456784"
            className="font-mono text-sm"
            autoComplete="off"
          />
        </div>
        {error ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" aria-hidden />
            Saved — order marked shipped
          </p>
        ) : null}
        <Button type="submit" disabled={loading || (!dirty && Boolean(initialTracking))}>
          {loading ? 'Saving…' : 'Save tracking & mark shipped'}
        </Button>
      </form>
    </div>
  )
}
