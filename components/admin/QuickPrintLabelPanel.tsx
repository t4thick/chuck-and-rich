'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Printer } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  orderId: string
  carrier: 'USPS' | 'UPS'
  preferredService: string
  defaultParcel: {
    weightLb: number
    lengthIn: number
    widthIn: number
    heightIn: number
  }
  initialLabelUrl?: string | null
  initialTracking?: string | null
}

/** TikTok Shop-style: one Print → carrier API → label PDF + tracking. */
export function QuickPrintLabelPanel({
  orderId,
  carrier,
  preferredService,
  defaultParcel,
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

  async function printLabel() {
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
        setError(typeof data.error === 'string' ? data.error : 'Could not create label.')
        return
      }
      setLabelUrl(data.labelUrl)
      setTracking(data.trackingNumber)
      setServiceLine(`${data.carrier} · ${data.serviceName}`)
      setAmount(typeof data.amount === 'number' ? data.amount : null)
      router.refresh()
      if (data.labelUrl) {
        const w = window.open(data.labelUrl, '_blank', 'noopener,noreferrer')
        w?.focus()
      }
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
      <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
        <p className="text-sm font-semibold text-emerald-900">Label ready — same as TikTok print flow</p>
        {serviceLine ? <p className="text-sm text-emerald-800">{serviceLine}</p> : null}
        {amount != null ? <p className="text-sm text-emerald-800">Postage: ${amount.toFixed(2)}</p> : null}
        {tracking ? (
          <p className="font-mono text-xs text-emerald-900">
            Tracking saved: <span className="font-semibold">{tracking}</span>
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={openPrint}>
            <Printer className="mr-1.5 h-4 w-4" aria-hidden />
            Print label again
          </Button>
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-brand-300 bg-white p-5 shadow-[var(--shadow-card)]">
      <div>
        <p className="text-base font-semibold text-earth-900">Print shipping label</p>
        <p className="mt-1 text-sm text-earth-600">
          Like TikTok Shop: one click buys a {carrier} {preferredService} label (default{' '}
          {defaultParcel.weightLb} lb box), opens the PDF, and saves tracking on this order.
        </p>
      </div>
      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="button" size="lg" className="h-12 w-full sm:w-auto" onClick={printLabel} disabled={loading}>
        <Printer className="mr-2 h-5 w-5" aria-hidden />
        {loading ? 'Creating label…' : 'Print shipping label'}
      </Button>
    </div>
  )
}
