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
  const [showManual, setShowManual] = useState(labelMode === 'external')

  if (isPickup) {
    return (
      <p className="text-sm text-earth-600">
        This is a <strong>pickup</strong> order — no shipping label needed.
      </p>
    )
  }

  const hasLabel = Boolean(initialLabelUrl)
  const tiktokStyle = shippoConfigured && (labelMode === 'quick' || labelMode === 'advanced')

  return (
    <div className="space-y-6">
      {tiktokStyle && !hasLabel && (
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

      {!hasLabel && labelMode === 'external' && (
        <ManualTrackingPanel
          orderId={orderId}
          initialTracking={initialTracking}
          currentStatus={currentStatus}
        />
      )}

      {tiktokStyle && !hasLabel && (
        <div>
          <button
            type="button"
            className="text-sm font-medium text-earth-600 hover:text-earth-900"
            onClick={() => setShowManual((v) => !v)}
          >
            {showManual
              ? 'Hide manual tracking'
              : 'Label printed on TikTok Shop or elsewhere? Enter tracking manually'}
          </button>
          {showManual && (
            <div className="mt-4">
              <ManualTrackingPanel
                orderId={orderId}
                initialTracking={initialTracking}
                currentStatus={currentStatus}
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
            {showAdvanced ? 'Hide rate comparison' : 'Compare all USPS / UPS rates instead'}
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

      {labelMode === 'external' && !shippoConfigured && (
        <p className="text-xs text-earth-500">
          To get TikTok-style one-click print here, add <code className="text-[11px]">SHIPPO_API_TOKEN</code> on
          Vercel and set <code className="text-[11px]">SHIP_PREFERRED_CARRIER=UPS</code>.
        </p>
      )}
    </div>
  )
}
