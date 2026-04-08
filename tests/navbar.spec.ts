import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows brand and links to home', async ({ page }) => {
    const logo = page.getByRole('link', { name: /Lovely Queen/i }).first()
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('desktop header has search, Shop, and cart', async ({ page }) => {
    const header = page.locator('header').first()
    await expect(header.getByPlaceholder(/Search groceries/i)).toBeVisible()
    await expect(header.getByRole('link', { name: 'Shop', exact: true })).toBeVisible()
    await expect(header.getByRole('link', { name: /Cart/i })).toBeVisible()
  })

  test('Shop navigates to shop page', async ({ page }) => {
    await page.locator('header').getByRole('link', { name: 'Shop', exact: true }).click()
    await expect(page).toHaveURL(/\/shop/)
    await expect(page.getByRole('heading', { name: 'Shop', exact: true })).toBeVisible()
  })

  test('cart icon links to cart page', async ({ page }) => {
    const cartLink = page.locator('header').getByRole('link', { name: /Cart/i }).first()
    await expect(cartLink).toBeVisible()
    await cartLink.click()
    await expect(page).toHaveURL(/\/cart/)
  })
})
