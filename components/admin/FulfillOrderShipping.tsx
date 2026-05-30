'use client'

import { useState } from 'react'
import type { ShipLabelMode } from '@/lib/shipping/shipping-workflow'
import { ManualTrackingPanel } from '@/components/admin/ManualTrackingPanel'
import { QuickPrintLabelPanel } from '@/components/admin/QuickPrintLabelPanel'
import { ShippingLabelPanel } from '@/components/admin/ShippingLabelPanel'

type Props = {
  orderId: string
  isPickup: boolean
  currentStatus: string
  labelMode: ShipLabelMode
  shippoConfigured: boolean
  preferredCarrier: 'USPS' | 'UPS'
  preferredCarrierService: string
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
  labelMode,
  shippoConfigured,
  preferredCarrier,
  preferredCarrierService,
  defaultParcel,
  initialLabelUrl,
  initialTracking,
  initialCarrier,
  initialService,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(labelMode === 'advanced')
  const [showManual, setShowManual] = useState(false)

  if (isPickup) {
    return (
      <p className="text-sm text-earth-600">
        Pickup order — no shipping label needed.
      </p>
    )
  }

  const hasLabel = Boolean(initialLabelUrl)
  const autoPrint = shippoConfigured && (labelMode === 'quick' || labelMode === 'advanced')

  return (
    <div className="space-y-6">
      {autoPrint && !hasLabel && (
        <QuickPrintLabelPanel
          orderId={orderId}
          carrier={preferredCarrier}
          preferredService={preferredCarrierService}
          defaultParcel={defaultParcel}
          initialLabelUrl={initialLabelUrl}
          initialTracking={initialTracking}
        />
      )}

      {hasLabel && (
        <ShippingLabelPanel
          orderId={orderId}
          isPickup={false}
          initialLabelUrl={initialLabelUrl}
          initialTracking={initialTracking}
          initialCarrier={initialCarrier}
          initialService={initialService}
          defaultParcel={defaultParcel}
          configured={shippoConfigured}
        />
      )}

      {!hasLabel && !autoPrint && (
        <ManualTrackingPanel
          orderId={orderId}
          initialTracking={initialTracking}
          currentStatus={currentStatus}
        />
      )}

      {autoPrint && !hasLabel && (
        <div>
          <button
            type="button"
            className="text-sm font-medium text-earth-600 hover:text-earth-900"
            onClick={() => setShowManual((v) => !v)}
          >
            {showManual ? 'Hide manual tracking' : 'Already have a tracking number?'}
          </button>
          {showManual && (
            <div className="mt-4">
              <ManualTrackingPanel
                orderId={orderId}
                initialTracking={initialTracking}
                currentStatus={currentStatus}
                compact
              />
            </div>
          )}
        </div>
      )}

      {shippoConfigured && labelMode === 'quick' && !hasLabel && (
        <div>
          <button
            type="button"
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            {showAdvanced ? 'Hide rate comparison' : 'Compare all USPS / UPS rates'}
          </button>
        </div>
      )}

      {shippoConfigured && (labelMode === 'advanced' || (labelMode === 'quick' && showAdvanced)) && !hasLabel && (
        <div className="border-t border-earth-200 pt-6">
          <ShippingLabelPanel
            orderId={orderId}
            isPickup={false}
            initialLabelUrl={initialLabelUrl}
            initialTracking={initialTracking}
            initialCarrier={initialCarrier}
            initialService={initialService}
            defaultParcel={defaultParcel}
            configured={shippoConfigured}
          />
        </div>
      )}

      {!shippoConfigured && (
        <p className="text-xs text-earth-500">
          Add <code className="text-[11px]">SHIPPO_API_TOKEN</code> on Vercel to print labels here, or
          enter tracking after printing from your carrier account.
        </p>
      )}
    </div>
  )
}
