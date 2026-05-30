'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  orderId: string
  initialTracking?: string | null
  currentStatus: string
}

export function ManualTrackingPanel({ orderId, initialTracking, currentStatus }: Props) {
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
      setError('Enter the USPS tracking number from your label.')
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
          note: 'Tracking added — label printed outside store (USPS / business account)',
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
    <div className="space-y-4 rounded-xl border border-brand-200 bg-brand-50/30 p-4">
      <div className="flex items-start gap-3">
        <Package className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-earth-900">Print label elsewhere, track here</h3>
          <p className="mt-1 text-sm text-earth-600">
            Same workflow as TikTok Shop: print the USPS label from your business account (Click-N-Ship,
            Stamps.com, or prepaid labels). Then paste the tracking number below so the customer can track
            the order.
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-earth-600">
            <li>Print packing slip / address from this order (button above).</li>
            <li>Print USPS label from your existing business tool.</li>
            <li>Paste tracking here → Save &amp; mark shipped.</li>
          </ol>
        </div>
      </div>

      <form onSubmit={markShipped} className="space-y-3">
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="manual-tracking">
            USPS tracking number
          </label>
          <Input
            id="manual-tracking"
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="9400 1000 0000 0000 0000 00"
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
            Saved — customer can track this order
          </p>
        ) : null}
        <Button type="submit" disabled={loading || (!dirty && Boolean(initialTracking))}>
          {loading ? 'Saving…' : 'Save tracking & mark shipped'}
        </Button>
      </form>
    </div>
  )
}
