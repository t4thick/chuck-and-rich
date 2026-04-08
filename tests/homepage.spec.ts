import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sets document title', async ({ page }) => {
    await expect(page).toHaveTitle(/Lovely Queen African Market/i)
  })

  test('shows hero heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Authentic African Groceries Delivered to Your Door/i })
    ).toBeVisible()
  })

  test('shows Shop by category section', async ({ page }) => {
    await expect(page.getByRole('main').getByRole('heading', { name: 'Shop by category' })).toBeVisible()
  })

  test('shows Best sellers section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Best sellers' })).toBeVisible()
  })

  test('Shop Now links to shop', async ({ page }) => {
    const shopNow = page.getByRole('link', { name: 'Shop Now' }).first()
    await expect(shopNow).toBeVisible()
    await expect(shopNow).toHaveAttribute('href', '/shop')
  })
})
