import { test, expect } from '@playwright/test'
import {
  calculateSalesTax,
  isCategoryTaxable,
  shouldApplyStoreSalesTax,
} from '../lib/tax/sales-tax'

test.describe('Ohio category sales tax', () => {
  test('grocery categories are exempt', () => {
    expect(isCategoryTaxable('Beverages')).toBe(false)
    expect(isCategoryTaxable('Canned')).toBe(false)
    expect(isCategoryTaxable('Flours & Rice')).toBe(false)
    expect(isCategoryTaxable('Spices')).toBe(false)
  })

  test('cosmetics and non-food are taxable', () => {
    expect(isCategoryTaxable('Cosmetics')).toBe(true)
    expect(isCategoryTaxable('Non food')).toBe(true)
  })

  test('tax applies for Ohio shipping and pickup', () => {
    expect(shouldApplyStoreSalesTax({ country: 'US', state: 'Ohio' })).toBe(true)
    expect(shouldApplyStoreSalesTax({ shippingMethod: 'pickup' })).toBe(true)
    expect(shouldApplyStoreSalesTax({ country: 'US', state: 'Texas' })).toBe(false)
  })

  test('mixed cart taxes only taxable lines in Ohio', () => {
    const quote = calculateSalesTax(
      [
        { category: 'Beverages', lineSubtotal: 20 },
        { category: 'Cosmetics', lineSubtotal: 10 },
      ],
      { country: 'USA', state: 'OH' }
    )
    expect(quote.applies).toBe(true)
    expect(quote.taxableSubtotal).toBe(10)
    expect(quote.taxAmount).toBeGreaterThan(0)
    expect(quote.taxAmount).toBe(0.78)
  })

  test('out of state has no tax even on cosmetics', () => {
    const quote = calculateSalesTax(
      [{ category: 'Non food', lineSubtotal: 15 }],
      { country: 'US', state: 'Michigan' }
    )
    expect(quote.taxAmount).toBe(0)
  })
})
