'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ExternalLink } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const USPS_CLICK_N_SHIP = 'https://cns.usps.com/label-manager/new-label/shipping-info'

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
      setError('Enter the tracking number from your USPS label.')
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
          note: 'Tracking added — label from USPS business account',
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
    <div className="space-y-4 rounded-xl border border-brand-200 bg-white p-5 shadow-[var(--shadow-card)]">
      <div>
        <h3 className="text-base font-semibold text-earth-900">Ship with your USPS business account</h3>
        <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-earth-600">
          <li>Print the packing slip / address from this order (button above).</li>
          <li>
            Buy and print the label in{' '}
            <a
              href={USPS_CLICK_N_SHIP}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 underline"
            >
              USPS Click-N-Ship
            </a>{' '}
            — uses your existing business rates. No third-party label service.
          </li>
          <li>Paste the tracking number below → Save &amp; mark shipped.</li>
        </ol>
      </div>

      <a
        href={USPS_CLICK_N_SHIP}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-full sm:w-auto')}
      >
        <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
        Open USPS Click-N-Ship
      </a>

      <form onSubmit={markShipped} className="space-y-3 border-t border-earth-200 pt-4">
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
