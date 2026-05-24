'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, ExternalLink, Printer, RefreshCw, Truck } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Rate = {
  id: string
  provider: string
  serviceName: string
  amount: number
  currency: string
  estimatedDays: number | null
}

type ShippingLabelPanelProps = {
  orderId: string
  isPickup: boolean
  initialLabelUrl?: string | null
  initialTracking?: string | null
  initialCarrier?: string | null
  initialService?: string | null
  defaultParcel: {
    weightLb: number
    lengthIn: number
    widthIn: number
    heightIn: number
  }
  configured: boolean
}

export function ShippingLabelPanel({
  orderId,
  isPickup,
  initialLabelUrl,
  initialTracking,
  initialCarrier,
  initialService,
  defaultParcel,
  configured,
}: ShippingLabelPanelProps) {
  const router = useRouter()
  const [weightLb, setWeightLb] = useState(String(defaultParcel.weightLb))
  const [lengthIn, setLengthIn] = useState(String(defaultParcel.lengthIn))
  const [widthIn, setWidthIn] = useState(String(defaultParcel.widthIn))
  const [heightIn, setHeightIn] = useState(String(defaultParcel.heightIn))
  const [carrier, setCarrier] = useState<'all' | 'USPS' | 'UPS'>('all')
  const [rates, setRates] = useState<Rate[]>([])
  const [selectedRateId, setSelectedRateId] = useState('')
  const [loadingRates, setLoadingRates] = useState(false)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState('')
  const [labelUrl, setLabelUrl] = useState(initialLabelUrl ?? '')
  const [tracking, setTracking] = useState(initialTracking ?? '')
  const [carrierLabel, setCarrierLabel] = useState(
    [initialCarrier, initialService].filter(Boolean).join(' · ')
  )

  const parcelPayload = useCallback(
    () => ({
      weightLb: Number(weightLb),
      lengthIn: Number(lengthIn),
      widthIn: Number(widthIn),
      heightIn: Number(heightIn),
      carrier: carrier === 'all' ? undefined : carrier,
    }),
    [weightLb, lengthIn, widthIn, heightIn, carrier]
  )

  async function fetchRates() {
    setLoadingRates(true)
    setError('')
    setRates([])
    setSelectedRateId('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipping/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parcelPayload()),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Could not load rates.')
        return
      }
      setRates(data.rates ?? [])
      if ((data.rates ?? []).length === 0) {
        setError('No USPS or UPS rates returned for this address and package.')
      }
    } finally {
      setLoadingRates(false)
    }
  }

  async function buyLabel() {
    if (!selectedRateId) return
    setBuying(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipping/label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rateId: selectedRateId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Could not buy label.')
        return
      }
      setLabelUrl(data.labelUrl)
      setTracking(data.trackingNumber)
      setCarrierLabel(`${data.carrier} · ${data.serviceName}`)
      router.refresh()
    } finally {
      setBuying(false)
    }
  }

  function openPrint() {
    if (!labelUrl) return
    const w = window.open(labelUrl, '_blank', 'noopener,noreferrer')
    if (w) {
      w.focus()
    }
  }

  if (isPickup) {
    return (
      <p className="text-sm text-earth-600">
        This is a <strong>pickup</strong> order — no shipping label needed.
      </p>
    )
  }

  if (!configured) {
    return (
      <div className="space-y-3 text-sm text-earth-600">
        <p>Label printing is not set up yet.</p>
        <p>
          Go to{' '}
          <a href="/admin/shipping" className="font-medium text-brand-700 underline">
            Shipping setup
          </a>{' '}
          for step-by-step instructions (Shippo + your store address).
        </p>
      </div>
    )
  }

  if (labelUrl) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
          <p className="font-semibold">Label ready</p>
          {carrierLabel && <p className="mt-0.5 text-emerald-800">{carrierLabel}</p>}
          {tracking && (
            <p className="mt-1 font-mono text-xs">
              Tracking: <span className="font-semibold">{tracking}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="default" onClick={openPrint}>
            <Printer className="mr-1.5 h-4 w-4" aria-hidden />
            Print label
          </Button>
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Open PDF
          </a>
        </div>
        <p className="text-xs text-earth-500">
          Use a regular printer or a label printer (Rollo, DYMO, Zebra). PDF is standard 4×6 shipping
          label size. After opening, choose your label printer and print.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-earth-600">
        Weigh the packed box, enter the weight below, then get <strong>USPS</strong> or{' '}
        <strong>UPS</strong> rates. Buying a label charges your Shippo account (postage only).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="pkg-weight">
            Weight (lbs)
          </label>
          <Input
            id="pkg-weight"
            type="number"
            min={0.1}
            step={0.1}
            value={weightLb}
            onChange={(e) => setWeightLb(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="carrier-filter">
            Carrier
          </label>
          <select
            id="carrier-filter"
            className="form-select"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value as 'all' | 'USPS' | 'UPS')}
          >
            <option value="all">USPS + UPS</option>
            <option value="USPS">USPS only</option>
            <option value="UPS">UPS only</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="pkg-l">
            Length (in)
          </label>
          <Input
            id="pkg-l"
            type="number"
            min={1}
            step={1}
            value={lengthIn}
            onChange={(e) => setLengthIn(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="pkg-w">
            Width (in)
          </label>
          <Input
            id="pkg-w"
            type="number"
            min={1}
            step={1}
            value={widthIn}
            onChange={(e) => setWidthIn(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="form-label" htmlFor="pkg-h">
            Height (in)
          </label>
          <Input
            id="pkg-h"
            type="number"
            min={1}
            step={1}
            value={heightIn}
            onChange={(e) => setHeightIn(e.target.value)}
          />
        </div>
      </div>

      <Button type="button" variant="outline" onClick={fetchRates} disabled={loadingRates}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loadingRates ? 'animate-spin' : ''}`} aria-hidden />
        {loadingRates ? 'Getting rates…' : 'Get USPS / UPS rates'}
      </Button>

      {rates.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-earth-500">
            Choose a rate
          </p>
          <ul className="max-h-56 space-y-2 overflow-y-auto">
            {rates.map((r) => (
              <li key={r.id}>
                <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-earth-200 px-3 py-2.5 text-sm transition-colors has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50">
                  <input
                    type="radio"
                    name="ship-rate"
                    value={r.id}
                    checked={selectedRateId === r.id}
                    onChange={() => setSelectedRateId(r.id)}
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-earth-900">
                      {r.provider} — {r.serviceName}
                    </span>
                    <span className="mt-0.5 block text-earth-600">
                      ${r.amount.toFixed(2)}
                      {r.estimatedDays != null ? ` · ~${r.estimatedDays} day(s)` : ''}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <Button
        type="button"
        disabled={!selectedRateId || buying}
        onClick={buyLabel}
        className="w-full sm:w-auto"
      >
        <Truck className="mr-1.5 h-4 w-4" aria-hidden />
        {buying ? 'Buying label…' : 'Buy label & mark shipped'}
      </Button>
    </div>
  )
}
