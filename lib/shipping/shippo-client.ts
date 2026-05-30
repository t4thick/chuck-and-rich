import type { DefaultParcel, ShipFromAddress } from '@/lib/shipping/label-config'

const SHIPPO_API = 'https://api.goshippo.com'

export type ShippoAddress = {
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

export type ShippoRate = {
  id: string
  provider: string
  serviceName: string
  amount: number
  currency: string
  estimatedDays: number | null
}

export type ShippoLabelResult = {
  transactionId: string
  trackingNumber: string
  labelUrl: string
  carrier: string
  serviceName: string
  amount: number
}

function shippoToken(): string {
  const token = process.env.SHIPPO_API_TOKEN?.trim()
  if (!token) throw new Error('SHIPPO_API_TOKEN is not configured.')
  return token
}

async function shippoRequest<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${SHIPPO_API}${path}`, {
    ...init,
    headers: {
      Authorization: `ShippoToken ${shippoToken()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const data = (await res.json().catch(() => ({}))) as T & { detail?: string; messages?: { text?: string }[] }

  if (!res.ok) {
    const msg =
      (data as { detail?: string }).detail ??
      (data as { messages?: { text?: string }[] }).messages?.[0]?.text ??
      `Shippo error (${res.status})`
    throw new Error(msg)
  }

  return data
}

function toShippoAddress(a: ShipFromAddress): ShippoAddress {
  return {
    name: a.name,
    street1: a.street1,
    street2: a.street2,
    city: a.city,
    state: a.state,
    zip: a.zip,
    country: a.country,
    phone: a.phone,
    email: a.email,
  }
}

function normalizeCarrier(provider: string): 'USPS' | 'UPS' | null {
  const p = provider.toUpperCase()
  if (p.includes('USPS')) return 'USPS'
  if (p.includes('UPS')) return 'UPS'
  return null
}

type ShippoCarrierAccount = {
  object_id: string
  carrier: string
  carrier_name?: string
  active?: boolean
  is_shippo_account?: boolean
  metadata?: string
}

type ShippoCarrierAccountList = {
  results?: ShippoCarrierAccount[]
}

export type ShippoCarrierAccountSummary = {
  objectId: string
  carrier: string
  name: string
  active: boolean
  isShippoAccount: boolean
}

export async function listShippoCarrierAccounts(): Promise<ShippoCarrierAccountSummary[]> {
  const data = await shippoRequest<ShippoCarrierAccountList>('/carrier_accounts/?results=100', {
    method: 'GET',
  })
  return (data.results ?? []).map((a) => ({
    objectId: a.object_id,
    carrier: (a.carrier ?? '').toUpperCase(),
    name: a.metadata?.trim() || a.carrier_name || a.carrier || 'Carrier account',
    active: a.active !== false,
    isShippoAccount: Boolean(a.is_shippo_account),
  }))
}

type ShippoShipmentResponse = {
  object_id: string
  rates: Array<{
    object_id: string
    provider: string
    servicelevel?: { name?: string }
    amount: string
    currency: string
    estimated_days?: number | null
    attributes?: string[]
  }>
}

type ShippoTransactionResponse = {
  object_id: string
  object_status: string
  label_url?: string
  tracking_number?: string
  messages?: { text?: string }[]
  rate?: {
    provider?: string
    servicelevel?: { name?: string }
    amount?: string
  }
}

export async function getShippoRates(input: {
  from: ShipFromAddress
  to: {
    name: string
    street1: string
    city: string
    state: string
    zip: string
    country: string
    phone?: string
    email?: string
  }
  parcel: DefaultParcel
  carrierAccountIds?: string[]
}): Promise<ShippoRate[]> {
  const body: Record<string, unknown> = {
    address_from: toShippoAddress(input.from),
    address_to: {
      name: input.to.name,
      street1: input.to.street1,
      city: input.to.city,
      state: input.to.state,
      zip: input.to.zip,
      country: input.to.country.length === 2 ? input.to.country : 'US',
      phone: input.to.phone || input.from.phone,
      email: input.to.email || input.from.email,
    },
    parcels: [
      {
        length: String(input.parcel.lengthIn),
        width: String(input.parcel.widthIn),
        height: String(input.parcel.heightIn),
        distance_unit: 'in',
        weight: String(input.parcel.weightLb),
        mass_unit: 'lb',
      },
    ],
    async: false,
  }

  if (input.carrierAccountIds && input.carrierAccountIds.length > 0) {
    body.carrier_accounts = input.carrierAccountIds
  }

  const shipment = await shippoRequest<ShippoShipmentResponse>('/shipments/', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const rates: ShippoRate[] = []
  for (const r of shipment.rates ?? []) {
    const carrier = normalizeCarrier(r.provider)
    if (!carrier) continue
    const amount = Number(r.amount)
    if (!Number.isFinite(amount)) continue
    rates.push({
      id: r.object_id,
      provider: carrier,
      serviceName: r.servicelevel?.name ?? r.provider,
      amount,
      currency: r.currency ?? 'USD',
      estimatedDays: r.estimated_days ?? null,
    })
  }
  return rates.sort((a, b) => a.amount - b.amount)
}

/** Pick preferred carrier service (e.g. UPS Ground) or cheapest on that carrier. */
export function pickPreferredCarrierRate(
  rates: ShippoRate[],
  carrier: 'USPS' | 'UPS',
  preferredServiceName: string
): ShippoRate | null {
  const filtered = rates.filter((r) => r.provider === carrier)
  if (filtered.length === 0) return null
  const needle = preferredServiceName.trim().toLowerCase()
  if (needle) {
    const match = filtered.find((r) => r.serviceName.toLowerCase().includes(needle))
    if (match) return match
  }
  return [...filtered].sort((a, b) => a.amount - b.amount)[0] ?? null
}

/** @deprecated use pickPreferredCarrierRate */
export function pickPreferredUspsRate(
  rates: ShippoRate[],
  preferredServiceName: string
): ShippoRate | null {
  return pickPreferredCarrierRate(rates, 'USPS', preferredServiceName)
}

export async function purchaseShippoLabel(rateId: string): Promise<ShippoLabelResult> {
  const tx = await shippoRequest<ShippoTransactionResponse>('/transactions/', {
    method: 'POST',
    body: JSON.stringify({
      rate: rateId,
      label_file_type: 'PDF',
      async: false,
    }),
  })

  if (tx.object_status !== 'SUCCESS' || !tx.label_url || !tx.tracking_number) {
    const msg = tx.messages?.[0]?.text ?? 'Label purchase failed.'
    throw new Error(msg)
  }

  const carrier = normalizeCarrier(tx.rate?.provider ?? '') ?? 'USPS'

  return {
    transactionId: tx.object_id,
    trackingNumber: tx.tracking_number,
    labelUrl: tx.label_url,
    carrier,
    serviceName: tx.rate?.servicelevel?.name ?? tx.rate?.provider ?? carrier,
    amount: Number(tx.rate?.amount ?? 0),
  }
}
