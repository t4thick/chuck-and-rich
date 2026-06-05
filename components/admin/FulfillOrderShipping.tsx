'use client'

import { useState } from 'react'
import { Download, Package, Printer, Truck } from 'lucide-react'
import { ExternalLabelTrackingPanel } from '@/components/admin/ExternalLabelTrackingPanel'
import { StoreIntegratedShippingPanel } from '@/components/admin/StoreIntegratedShippingPanel'
import { buttonVariants } from '@/components/ui/button'
import { ADMIN_SHIP_METHODS, type AdminShipMethod } from '@/lib/shipping/admin-ship-methods'
import { cn } from '@/lib/utils'

const METHOD_ICON: Record<AdminShipMethod, typeof Truck> = {
  'click-n-ship': Truck,
  shippo: Package,
  integrated: Printer,
}

type Props = {
  orderId: string
  isPickup: boolean
  currentStatus: string
  uspsConfigured: boolean
  uspsLabelsLive: boolean
  shippoConfigured: boolean
  mailClass: string
  defaultParcel: {
    weightLb: number
    lengthIn: number
    widthIn: number
    heightIn: number
  }
  initialLabelUrl?: string | null
  initialTracking?: string | null
  initialCarrier?: string | null
  initialService?: string | null
}

export function FulfillOrderShipping({
  orderId,
  isPickup,
  currentStatus,
  uspsConfigured,
  uspsLabelsLive,
  shippoConfigured,
  mailClass,
  defaultParcel,
  initialLabelUrl,
  initialTracking,
  initialCarrier,
  initialService,
}: Props) {
  const hasShipment = Boolean(initialTracking || initialLabelUrl)
  const [method, setMethod] = useState<AdminShipMethod>('click-n-ship')

  if (isPickup) {
    return <p className="text-sm text-earth-600">Pickup order — no shipping label needed.</p>
  }

  return (
    <div className="space-y-5">
      {hasShipment ? (
        <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-sm font-semibold text-emerald-900">Shipment on file</p>
          {initialCarrier || initialService ? (
            <p className="text-sm text-emerald-800">
              {[initialCarrier, initialService].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          {initialTracking ? (
            <p className="font-mono text-xs text-emerald-900">
              Tracking: <span className="font-semibold">{initialTracking}</span>
            </p>
          ) : null}
          {initialLabelUrl ? (
            <a
              href={initialLabelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              <Download className="h-4 w-4" aria-hidden />
              Download saved label PDF
            </a>
          ) : null}
        </div>
      ) : null}

      <p className="text-sm text-earth-600">Choose how you want to ship this order.</p>

      <div
        className="grid gap-2 sm:grid-cols-3"
        role="tablist"
        aria-label="Shipping method"
      >
        {ADMIN_SHIP_METHODS.map((m) => {
          const Icon = METHOD_ICON[m.id]
          const selected = method === m.id
          const isBuilding = m.badge === 'building'
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setMethod(m.id)}
              className={cn(
                'relative flex flex-col items-start rounded-xl border p-4 text-left transition duration-150',
                selected
                  ? 'border-brand-500 bg-brand-50/60 shadow-[var(--shadow-card)]'
                  : 'border-earth-200 bg-white hover:border-earth-300'
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  isBuilding ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                )}
              >
                {isBuilding ? 'Coming soon' : 'Ready'}
              </span>
              <Icon
                className={cn('mt-3 h-5 w-5', selected ? 'text-brand-700' : 'text-earth-500')}
                aria-hidden
              />
              <span className="mt-2 text-sm font-semibold text-earth-950">{m.title}</span>
              <span className="mt-0.5 text-xs text-earth-500">{m.subtitle}</span>
              {m.id === 'shippo' && shippoConfigured ? (
                <span className="mt-2 text-[10px] font-medium text-brand-700">API key on file</span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div
        className="rounded-xl border border-earth-200 bg-white p-5 shadow-[var(--shadow-card)]"
        role="tabpanel"
      >
        {method === 'click-n-ship' ? (
          <ExternalLabelTrackingPanel
            provider="click-n-ship"
            orderId={orderId}
            initialTracking={initialTracking}
            currentStatus={currentStatus}
          />
        ) : null}

        {method === 'shippo' ? (
          <ExternalLabelTrackingPanel
            provider="shippo"
            orderId={orderId}
            initialTracking={initialTracking}
            currentStatus={currentStatus}
          />
        ) : null}

        {method === 'integrated' ? (
          <StoreIntegratedShippingPanel
            orderId={orderId}
            mailClass={mailClass}
            labelsLive={uspsLabelsLive}
            uspsConfigured={uspsConfigured}
            shippoConfigured={shippoConfigured}
            defaultParcel={defaultParcel}
            initialLabelUrl={initialLabelUrl}
            initialTracking={initialTracking}
          />
        ) : null}
      </div>
    </div>
  )
}
