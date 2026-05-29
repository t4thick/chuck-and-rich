import { verifyUsAddressGeoapify, isGeoapifyConfigured } from '@/lib/address/geoapify-verify'
import type { AddressInput } from '@/lib/address/types'
import { normalizeShippingCountry } from '@/lib/shipping'
import { isValidUsStateCode, normalizeUsStateCode } from '@/lib/address/us-states'

export type { AddressInput } from '@/lib/address/types'

const CENSUS_GEOCODE =
  'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress'

const CENSUS_TIMEOUT_MS = 8_000

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

  if (isGeoapifyConfigured()) {
    return verifyUsAddressGeoapify(input)
  }

  const oneLine = [line1, input.line2?.trim(), city, state, zip].filter(Boolean).join(', ')

  try {
    const params = new URLSearchParams({
      address: oneLine,
      benchmark: 'Public_AR_Current',
      format: 'json',
    })
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), CENSUS_TIMEOUT_MS)
    const res = await fetch(`${CENSUS_GEOCODE}?${params.toString()}`, {
      next: { revalidate: 0 },
      signal: controller.signal,
    })
    clearTimeout(timeout)
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
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError'
    if (aborted) {
      return {
        ok: false,
        error:
          'Address verification timed out. Add GEOAPIFY_API_KEY in Vercel for faster verification, or try again.',
      }
    }
    return { ok: false, error: 'Address verification is temporarily unavailable. Try again.' }
  }
}
