'use client'

import { useState } from 'react'
import type { ShipLabelMode } from '@/lib/shipping/shipping-workflow'
import { ManualTrackingPanel } from '@/components/admin/ManualTrackingPanel'
import { QuickUspsLabelPanel } from '@/components/admin/QuickUspsLabelPanel'
import { ShippingLabelPanel } from '@/components/admin/ShippingLabelPanel'

type Props = {
  orderId: string
  isPickup: boolean
  currentStatus: string
  labelMode: ShipLabelMode
  shippoConfigured: boolean
  preferredUspsService: string
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
  preferredUspsService,
  defaultParcel,
  initialLabelUrl,
  initialTracking,
  initialCarrier,
  initialService,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(labelMode === 'advanced')

  if (isPickup) {
    return (
      <p className="text-sm text-earth-600">
        This is a <strong>pickup</strong> order — no shipping label needed.
      </p>
    )
  }

  const hasLabel = Boolean(initialLabelUrl)

  return (
    <div className="space-y-6">
      {!hasLabel && (
        <ManualTrackingPanel
          orderId={orderId}
          initialTracking={initialTracking}
          currentStatus={currentStatus}
        />
      )}

      {shippoConfigured && labelMode === 'quick' && !hasLabel && (
        <QuickUspsLabelPanel
          orderId={orderId}
          defaultParcel={defaultParcel}
          preferredService={preferredUspsService}
          initialLabelUrl={initialLabelUrl}
          initialTracking={initialTracking}
        />
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

      {shippoConfigured && (labelMode === 'advanced' || (labelMode === 'quick' && showAdvanced) || hasLabel) && (
        <div className={labelMode === 'quick' && !hasLabel ? 'border-t border-earth-200 pt-6' : undefined}>
          {labelMode === 'advanced' && !hasLabel ? (
            <p className="mb-4 text-sm text-earth-600">
              Or buy a label here with full rate comparison. Most stores use external USPS labels
              instead — see section above.
            </p>
          ) : null}
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
          Online label purchase (Shippo) is off. Add <code className="text-[11px]">SHIPPO_API_TOKEN</code>{' '}
          only if you want one-click labels from admin later.
        </p>
      )}
    </div>
  )
}
