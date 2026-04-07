import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sets document title', async ({ page }) => {
    await expect(page).toHaveTitle(/Lovely Queen African Market/i)
  })

  test('shows page title heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Lovely Queen African Market/i })).toBeVisible()
  })

  test('shows Shop by Category section', async ({ page }) => {
    await expect(
      page.getByRole('main').getByRole('heading', { name: 'Shop by Category' })
    ).toBeVisible()
  })

  test('shows Best Sellers section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Best Sellers' })).toBeVisible()
  })

  test('Shop Now links to shop', async ({ page }) => {
    const shopNow = page.getByRole('link', { name: /Shop All Products/i })
    await expect(shopNow).toBeVisible()
    await expect(shopNow).toHaveAttribute('href', '/shop')
  })
})
