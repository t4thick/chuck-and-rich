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

  test('desktop nav has Home, Shop, key category links, and cart', async ({ page }) => {
    const nav = page.locator('nav').first()
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Shop', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Beverages', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Flours & Rice', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Track Order', exact: true })).toBeVisible()
  })

  test('Shop navigates to shop page', async ({ page }) => {
    await page.getByRole('link', { name: 'Shop', exact: true }).click()
    await expect(page).toHaveURL(/\/shop/)
    await expect(page.getByRole('heading', { name: 'Shop', exact: true })).toBeVisible()
  })

  test('cart icon links to cart page', async ({ page }) => {
    const cartLinks = page.locator('nav a[href="/cart"]')
    await expect(cartLinks.first()).toBeVisible()
    await cartLinks.first().click()
    await expect(page).toHaveURL(/\/cart/)
  })
})
