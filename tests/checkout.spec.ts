import { test, expect } from '@playwright/test'

test.describe.configure({ timeout: 120_000 })

test.describe('Checkout', () => {
  test('redirects unauthenticated users away from checkout', async ({ page }) => {
    await page.goto('/checkout')

    await expect(page).toHaveURL(/\/login\?next=%2Fcheckout/)
    await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible()
  })

  test('redirects unauthenticated users away from order confirmation', async ({ page }) => {
    await page.goto('/order-confirmation?id=test-order')

    await expect(page).toHaveURL(/\/login\?next=.*order-confirmation/i)
    await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible()
  })

  test('order tracking API rejects unauthenticated access', async ({ page }) => {
    const response = await page.request.get('/api/orders/track?id=test-order')
    expect(response.status()).toBe(401)
    await expect(await response.json()).toMatchObject({
      error: expect.stringMatching(/sign in/i),
    })
  })

  test('direct order creation API is disabled (use Stripe Checkout)', async ({ page }) => {
    const response = await page.request.post('/api/orders', {
      data: {
        name: 'Test Customer',
        address: '123 Test Street',
        city: 'Columbus',
        state: 'Ohio',
        country: 'United States',
        items: [],
      },
    })

    expect(response.status()).toBe(410)
    await expect(await response.json()).toMatchObject({
      error: expect.stringMatching(/stripe checkout|payment/i),
    })
  })
})
