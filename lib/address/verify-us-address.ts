import { normalizeShippingCountry } from '@/lib/shipping'
import { isValidUsStateCode, normalizeUsStateCode } from '@/lib/address/us-states'

export type AddressInput = {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

const CENSUS_GEOCODE =
  'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress'

export function isValidUsZip(postalCode: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(postalCode.trim())
}

export function isUnitedStatesCountry(country: string): boolean {
  const c = normalizeShippingCountry(country)
  return !c || c === 'united states'
}

/**
 * Verifies a US street address against the US Census geocoder (official US address data).
 */
export async function verifyUsDeliveryAddress(
  input: AddressInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const line1 = input.line1.trim()
  const city = input.city.trim()
  const state = normalizeUsStateCode(input.state)
  const zip = input.postalCode.trim()
  const country = input.country.trim()

  if (!isUnitedStatesCountry(country)) {
    return { ok: false, error: 'US delivery requires United States as the country.' }
  }
  if (line1.length < 5) {
    return { ok: false, error: 'Enter a complete street address.' }
  }
  if (!city) {
    return { ok: false, error: 'City is required.' }
  }
  if (!isValidUsStateCode(state)) {
    return { ok: false, error: 'Choose a valid US state.' }
  }
  if (!isValidUsZip(zip)) {
    return { ok: false, error: 'Enter a valid 5-digit ZIP code.' }
  }

  const oneLine = [line1, input.line2?.trim(), city, state, zip].filter(Boolean).join(', ')

  try {
    const params = new URLSearchParams({
      address: oneLine,
      benchmark: 'Public_AR_Current',
      format: 'json',
    })
    const res = await fetch(`${CENSUS_GEOCODE}?${params.toString()}`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      return { ok: false, error: 'Could not verify this address. Pick one from the suggestions.' }
    }
    const data = (await res.json()) as {
      result?: { addressMatches?: unknown[] }
    }
    const matches = data?.result?.addressMatches ?? []
    if (!Array.isArray(matches) || matches.length === 0) {
      return {
        ok: false,
        error: 'This address could not be verified. Select a US address from the list as you type.',
      }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Address verification is temporarily unavailable. Try again.' }
  }
}
