/**
 * How staff fulfill shipped orders in admin.
 *
 * external — Print labels in USPS Click-N-Ship / TikTok / existing business tool;
 *            enter tracking here (default when SHIP_LABEL_MODE unset).
 * quick    — One-click Shippo label: default box + preferred USPS service.
 * advanced — Full Shippo rate picker (USPS + UPS).
 */

export type ShipLabelMode = 'external' | 'quick' | 'advanced'

const VALID: ShipLabelMode[] = ['external', 'quick', 'advanced']

export function getShipLabelMode(): ShipLabelMode {
  const raw = process.env.SHIP_LABEL_MODE?.trim().toLowerCase()
  if (raw && VALID.includes(raw as ShipLabelMode)) {
    return raw as ShipLabelMode
  }
  return 'external'
}

/** Substring match against Shippo service names (e.g. "Ground Advantage"). */
export function getPreferredUspsServiceName(): string {
  return process.env.SHIP_PREFERRED_USPS_SERVICE?.trim() || 'Ground Advantage'
}

export function shipLabelModeLabel(mode: ShipLabelMode): string {
  switch (mode) {
    case 'external':
      return 'External labels (USPS / TikTok-style)'
    case 'quick':
      return 'Quick USPS label (Shippo)'
    case 'advanced':
      return 'Compare rates (Shippo)'
  }
}
