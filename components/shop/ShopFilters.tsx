'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SHOP_CATEGORIES } from '@/lib/shop-categories'

export function ShopFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const spKey = searchParams.toString()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') ?? '')
    setMaxPrice(searchParams.get('maxPrice') ?? '')
  }, [spKey])

  const category = searchParams.get('category') ?? ''
  const country = searchParams.get('country') ?? 'all'
  const availability = searchParams.get('availability') ?? 'all'

  const apply = useCallback(() => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (category) params.set('category', category)
    if (country && country !== 'all') params.set('country', country)
    if (availability && availability !== 'all') params.set('availability', availability)
    const min = minPrice.trim()
    const max = maxPrice.trim()
    if (min !== '' && !Number.isNaN(Number(min))) params.set('minPrice', min)
    if (max !== '' && !Number.isNaN(Number(max))) params.set('maxPrice', max)
    const qs = params.toString()
    router.push(`/shop${qs ? `?${qs}` : ''}`)
  }, [q, category, country, availability, minPrice, maxPrice, router])

  const clear = useCallback(() => {
    setMinPrice('')
    setMaxPrice('')
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
  }, [q, router])

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-800">Filters</h2>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-[#0f3d2e] hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor="filter-category" className="mb-1.5 block text-xs font-medium text-neutral-600">
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              const v = e.target.value
              if (v) params.set('category', v)
              else params.delete('category')
              const qs = params.toString()
              router.push(`/shop${qs ? `?${qs}` : ''}`)
            }}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#0f3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/15"
          >
            <option value="">All categories</option>
            {SHOP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-neutral-600">Price</p>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-[#0f3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/15"
            />
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-[#0f3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/15"
            />
          </div>
        </div>

        <div>
          <label htmlFor="filter-country" className="mb-1.5 block text-xs font-medium text-neutral-600">
            Country of origin
          </label>
          <select
            id="filter-country"
            value={country}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              const v = e.target.value
              if (v && v !== 'all') params.set('country', v)
              else params.delete('country')
              router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
            }}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#0f3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/15"
          >
            <option value="all">All</option>
            <option value="ghana">Ghana</option>
            <option value="nigeria">Nigeria</option>
            <option value="caribbean">Caribbean</option>
            <option value="west-africa">West Africa</option>
            <option value="other">Other / regional</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-availability" className="mb-1.5 block text-xs font-medium text-neutral-600">
            Availability
          </label>
          <select
            id="filter-availability"
            value={availability}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              const v = e.target.value
              if (v && v !== 'all') params.set('availability', v)
              else params.delete('availability')
              router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
            }}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#0f3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/15"
          >
            <option value="all">All</option>
            <option value="available">In stock</option>
            <option value="low">Low stock only</option>
          </select>
        </div>

        <button
          type="button"
          onClick={apply}
          className="w-full rounded-xl bg-[#0f3d2e] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c3024]"
        >
          Apply price range
        </button>
      </div>
    </div>
  )
}
