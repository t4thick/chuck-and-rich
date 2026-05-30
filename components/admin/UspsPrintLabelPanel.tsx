'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Printer } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  orderId: string
  mailClass: string
  defaultParcel: {
    weightLb: number
    lengthIn: number
    widthIn: number
    heightIn: number
  }
  initialLabelUrl?: string | null
  initialTracking?: string | null
}

export function UspsPrintLabelPanel({
  orderId,
  mailClass,
  defaultParcel,
  initialLabelUrl,
  initialTracking,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [labelUrl, setLabelUrl] = useState(initialLabelUrl ?? '')
  const [tracking, setTracking] = useState(initialTracking ?? '')
  const [postage, setPostage] = useState<number | null>(null)
  const [estimate, setEstimate] = useState<{ price: number; description: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadRate() {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}/shipping/usps-rate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || cancelled) return
        if (typeof data.price === 'number') {
          setEstimate({ price: data.price, description: data.description ?? 'USPS' })
        }
      } catch {
        /* optional */
      }
    }
    if (!labelUrl) void loadRate()
    return () => {
      cancelled = true
    }
  }, [orderId, labelUrl])

  async function printLabel() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipping/usps-label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not create label.')
        return
      }

      setTracking(data.trackingNumber)
      setPostage(typeof data.postage === 'number' ? data.postage : null)
      if (data.labelUrl) setLabelUrl(data.labelUrl)

      router.refresh()

      if (typeof data.labelPdfBase64 === 'string' && data.labelPdfBase64.length > 0) {
        const bytes = Uint8Array.from(atob(data.labelPdfBase64), (c) => c.charCodeAt(0))
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const w = window.open(url, '_blank', 'noopener,noreferrer')
        w?.focus()
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      } else if (data.labelUrl) {
        const w = window.open(data.labelUrl, '_blank', 'noopener,noreferrer')
        w?.focus()
      }
    } finally {
      setLoading(false)
    }
  }

  function openPrint() {
    if (!labelUrl) return
    window.open(labelUrl, '_blank', 'noopener,noreferrer')?.focus()
  }

  if (labelUrl || tracking) {
    return (
      <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
        <p className="text-sm font-semibold text-emerald-900">USPS label ready</p>
        {postage != null ? <p className="text-sm text-emerald-800">Postage: ${postage.toFixed(2)}</p> : null}
        {tracking ? (
          <p className="font-mono text-xs text-emerald-900">
            Tracking: <span className="font-semibold">{tracking}</span>
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {labelUrl ? (
            <>
              <Button type="button" onClick={openPrint}>
                <Printer className="mr-1.5 h-4 w-4" aria-hidden />
                Print label
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
            </>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-brand-300 bg-white p-5 shadow-[var(--shadow-card)]">
      <div>
        <p className="text-base font-semibold text-earth-900">Print shipping label</p>
        <p className="mt-1 text-sm text-earth-600">
          Direct USPS API — {mailClass.replace(/_/g, ' ')}, {defaultParcel.weightLb} lb (
          {defaultParcel.lengthIn}×{defaultParcel.widthIn}×{defaultParcel.heightIn} in). Bills your
          business account.
        </p>
        {estimate ? (
          <p className="mt-2 text-sm font-medium text-earth-900">
            Estimated postage: ${estimate.price.toFixed(2)} · {estimate.description}
          </p>
        ) : (
          <p className="mt-2 text-xs text-earth-500">Loading rate estimate…</p>
        )}
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
