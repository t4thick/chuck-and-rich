/**
 * Store ship-from address and default parcel — set in Vercel / .env.local.
 * Falls back to STORE.shipFrom when env vars are not set.
 */

import { STORE } from '@/lib/constants/store'

export type ShipFromAddress = {
  name: string
  street1: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  email: string
}

export type DefaultParcel = {
  weightLb: number
  lengthIn: number
  widthIn: number
  heightIn: number
}

export type ShippingLabelConfig = {
  shippoConfigured: boolean
  shipFrom: ShipFromAddress | null
  defaultParcel: DefaultParcel
  allowedCarriers: readonly ['USPS', 'UPS']
}

function trim(v: string | undefined): string {
  return v?.trim() ?? ''
}

function parseNum(v: string | undefined, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function getShipFromAddress(): ShipFromAddress | null {
  const name = trim(process.env.SHIP_FROM_NAME) || STORE.name
  const street1 = trim(process.env.SHIP_FROM_STREET1) || STORE.shipFrom.street1
  const city = trim(process.env.SHIP_FROM_CITY) || STORE.shipFrom.city
  const state = trim(process.env.SHIP_FROM_STATE) || STORE.shipFrom.state
  const zip = trim(process.env.SHIP_FROM_ZIP) || STORE.shipFrom.zip
  const phone =
    trim(process.env.SHIP_FROM_PHONE) || STORE.shipFrom.phone

  if (!name || !street1 || !city || !state || !zip || !phone) {
    return null
  }

  return {
    name,
    street1,
    street2: trim(process.env.SHIP_FROM_STREET2) || STORE.shipFrom.street2 || undefined,
    city,
    state,
    zip,
    country: trim(process.env.SHIP_FROM_COUNTRY) || STORE.shipFrom.country,
    phone,
    email: trim(process.env.SHIP_FROM_EMAIL) || trim(process.env.MERCHANT_ORDER_EMAIL) || 'orders@lovelyqueenmarket.com',
  }
}

export function getDefaultParcel(): DefaultParcel {
  return {
    weightLb: parseNum(process.env.SHIP_DEFAULT_WEIGHT_LB, 3),
    lengthIn: parseNum(process.env.SHIP_DEFAULT_LENGTH_IN, 12),
    widthIn: parseNum(process.env.SHIP_DEFAULT_WIDTH_IN, 10),
    heightIn: parseNum(process.env.SHIP_DEFAULT_HEIGHT_IN, 8),
  }
}

export function isShippoConfigured(): boolean {
  return Boolean(process.env.SHIPPO_API_TOKEN?.trim()) && getShipFromAddress() !== null
}

export function getShippingLabelConfig(): ShippingLabelConfig {
  return {
    shippoConfigured: isShippoConfigured(),
    shipFrom: getShipFromAddress(),
    defaultParcel: getDefaultParcel(),
    allowedCarriers: ['USPS', 'UPS'] as const,
  }
}

/** Public-safe config for admin UI (no secrets). */
export function getShippingLabelConfigPublic() {
  const cfg = getShippingLabelConfig()
  const from = cfg.shipFrom
  return {
    shippoConfigured: cfg.shippoConfigured,
    hasShippoToken: Boolean(process.env.SHIPPO_API_TOKEN?.trim()),
    shipFromComplete: from !== null,
    shipFrom: from
      ? {
          name: from.name,
          street1: from.street1,
          street2: from.street2 ?? '',
          city: from.city,
          state: from.state,
          zip: from.zip,
          country: from.country,
          phone: from.phone.replace(/\d(?=\d{4})/g, '*'),
        }
      : null,
    defaultParcel: cfg.defaultParcel,
    allowedCarriers: cfg.allowedCarriers,
  }
}
