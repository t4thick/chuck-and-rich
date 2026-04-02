export type ShippingMethod = 'standard' | 'express' | 'pickup'

export type ShippingQuoteInput = {
  subtotal: number
  country?: string
  state?: string
  method?: string
}

export type ShippingQuote = {
  method: ShippingMethod
  fee: number
  zone: 'local' | 'regional' | 'national' | 'international' | 'pickup'
  label: string
}

const LOCAL_STATES = new Set(['ohio'])

const REGIONAL_STATES = new Set([
  'indiana',
  'kentucky',
  'michigan',
  'pennsylvania',
  'west virginia',
])

const COUNTRY_ALIASES: Record<string, string> = {
  us: 'united states',
  usa: 'united states',
  'u s a': 'united states',
  'u s': 'united states',
  america: 'united states',
  'united states of america': 'united states',
  canada: 'canada',
}

const REGION_ALIASES: Record<string, string> = {
  oh: 'ohio',
  'ohio state': 'ohio',
  in: 'indiana',
  ky: 'kentucky',
  mi: 'michigan',
  pa: 'pennsylvania',
  wv: 'west virginia',
}

export const SHIPPING_METHOD_LABEL: Record<ShippingMethod, string> = {
  standard: 'Standard Delivery',
  express: 'Express Delivery',
  pickup: 'Store Pickup',
}

export function normalizeShippingMethod(value: string | null | undefined): ShippingMethod {
  if (value === 'express' || value === 'pickup' || value === 'standard') return value
  return 'standard'
}

function normalizeToken(value: string | null | undefined) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
}

export function normalizeShippingCountry(value: string | null | undefined) {
  const normalized = normalizeToken(value)
  return COUNTRY_ALIASES[normalized] ?? normalized
}

export function normalizeShippingRegion(value: string | null | undefined) {
  let normalized = normalizeToken(value)
  normalized = normalized.replace(/\b(state|province|region|territory|county)\b/g, '').replace(/\s+/g, ' ').trim()
  return REGION_ALIASES[normalized] ?? normalized
}

export function calculateShipping(input: ShippingQuoteInput): ShippingQuote {
  const subtotal = Number.isFinite(input.subtotal) ? Math.max(0, input.subtotal) : 0
  const method = normalizeShippingMethod(input.method)
  const country = normalizeShippingCountry(input.country)
  const state = normalizeShippingRegion(input.state)

  if (method === 'pickup') {
    return { method, fee: 0, zone: 'pickup', label: SHIPPING_METHOD_LABEL[method] }
  }

  const isUnitedStates = !country || country === 'united states'

  if (!isUnitedStates) {
    const base = method === 'express' ? 52 : 34
    return { method, fee: base, zone: 'international', label: SHIPPING_METHOD_LABEL[method] }
  }

  if (method === 'standard' && subtotal >= 150) {
    return { method, fee: 0, zone: 'national', label: SHIPPING_METHOD_LABEL[method] }
  }

  let base = 18
  let zone: ShippingQuote['zone'] = 'national'
  if (LOCAL_STATES.has(state)) {
    base = 7
    zone = 'local'
  } else if (REGIONAL_STATES.has(state)) {
    base = 12
    zone = 'regional'
  }

  const expressAddon = method === 'express' ? 10 : 0
  return {
    method,
    fee: base + expressAddon,
    zone,
    label: SHIPPING_METHOD_LABEL[method],
  }
}
