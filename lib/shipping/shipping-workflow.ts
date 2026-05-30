/**
 * How staff fulfill shipped orders in admin.
 *
 * external — Label printed outside admin; paste tracking only.
 * quick    — One Print button → Shippo → UPS/USPS API → label PDF + tracking.
 * advanced — Full Shippo rate picker (USPS + UPS).
 */

export type ShipLabelMode = 'external' | 'quick' | 'advanced'
export type PreferredCarrier = 'USPS' | 'UPS'

const VALID: ShipLabelMode[] = ['external', 'quick', 'advanced']

export function getShipLabelMode(): ShipLabelMode {
  const raw = process.env.SHIP_LABEL_MODE?.trim().toLowerCase()
  if (raw && VALID.includes(raw as ShipLabelMode)) {
    return raw as ShipLabelMode
  }
  // When Shippo is wired up, default to one-click print.
  if (process.env.SHIPPO_API_TOKEN?.trim()) {
    return 'quick'
  }
  return 'external'
}

export function getPreferredCarrier(): PreferredCarrier {
  const raw = process.env.SHIP_PREFERRED_CARRIER?.trim().toUpperCase()
  return raw === 'USPS' ? 'USPS' : 'UPS'
}

/** Substring match against Shippo service names (e.g. "Ground"). */
export function getPreferredCarrierServiceName(carrier: PreferredCarrier): string {
  if (carrier === 'UPS') {
    return process.env.SHIP_PREFERRED_UPS_SERVICE?.trim() || 'Ground'
  }
  return process.env.SHIP_PREFERRED_USPS_SERVICE?.trim() || 'Ground Advantage'
}

/** @deprecated use getPreferredCarrierServiceName */
export function getPreferredUspsServiceName(): string {
  return getPreferredCarrierServiceName('USPS')
}

export function shipLabelModeLabel(mode: ShipLabelMode): string {
  switch (mode) {
    case 'external':
      return 'Manual tracking only'
    case 'quick':
      return 'Print label (UPS/USPS via Shippo)'
    case 'advanced':
      return 'Compare rates (Shippo)'
  }
}
