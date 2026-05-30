'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Printer, Truck } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  orderId: string
  defaultParcel: {
    weightLb: number
    lengthIn: number
    widthIn: number
    heightIn: number
  }
  preferredService: string
  initialLabelUrl?: string | null
  initialTracking?: string | null
}

export function QuickUspsLabelPanel({
  orderId,
  defaultParcel,
  preferredService,
  initialLabelUrl,
  initialTracking,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [labelUrl, setLabelUrl] = useState(initialLabelUrl ?? '')
  const [tracking, setTracking] = useState(initialTracking ?? '')
  const [serviceLine, setServiceLine] = useState('')
  const [amount, setAmount] = useState<number | null>(null)

  async function buyQuickLabel() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipping/quick-label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not buy label.')
        return
      }
      setLabelUrl(data.labelUrl)
      setTracking(data.trackingNumber)
      setServiceLine(`${data.carrier} · ${data.serviceName}`)
      setAmount(typeof data.amount === 'number' ? data.amount : null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  function openPrint() {
    if (!labelUrl) return
    const w = window.open(labelUrl, '_blank', 'noopener,noreferrer')
    w?.focus()
  }

  if (labelUrl) {
    return (
      <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-sm font-semibold text-emerald-900">Label ready</p>
        {serviceLine ? <p className="text-sm text-emerald-800">{serviceLine}</p> : null}
        {amount != null ? <p className="text-sm text-emerald-800">Postage: ${amount.toFixed(2)}</p> : null}
        {tracking ? (
          <p className="font-mono text-xs text-emerald-900">
            Tracking: <span className="font-semibold">{tracking}</span>
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={openPrint}>
            <Printer className="mr-1.5 h-4 w-4" aria-hidden />
            Print label
          </Button>
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-earth-200 bg-earth-50/50 p-4">
      <p className="text-sm font-semibold text-earth-900">Quick USPS label (optional)</p>
      <p className="text-sm text-earth-600">
        Uses your default box ({defaultParcel.weightLb} lb, {defaultParcel.lengthIn}×
        {defaultParcel.widthIn}×{defaultParcel.heightIn} in) and buys{' '}
        <strong>{preferredService}</strong> via Shippo. Skip this if you print labels from your USPS
        business account.
      </p>
      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="button" onClick={buyQuickLabel} disabled={loading}>
        <Truck className="mr-1.5 h-4 w-4" aria-hidden />
        {loading ? 'Buying label…' : `Buy ${preferredService} label`}
      </Button>
    </div>
  )
}
