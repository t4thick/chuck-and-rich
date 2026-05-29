import { test, expect } from '@playwright/test'
import { verifyUsDeliveryAddress } from '../lib/address/verify-us-address'

test.describe('US delivery address verification', () => {
  test('403 Main Street Grambling LA 71245 verifies when Geoapify is configured', async () => {
    test.skip(!process.env.GEOAPIFY_API_KEY?.trim(), 'Set GEOAPIFY_API_KEY to run live geocode test')

    const result = await verifyUsDeliveryAddress({
      line1: '403 Main Street',
      city: 'grambling',
      state: 'Louisiana',
      postalCode: '71245',
      country: 'United States',
    })

    expect(result).toEqual({ ok: true })
  })
})
