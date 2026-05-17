'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const CATEGORIES = [
  'Beverages', 'Bread', 'Canned', 'Caribbean product', 'Cosmetics',
  'Dairy And Tea', 'Flours & Rice', 'Fresh Produce', 'Frozen foods',
  'Meat and Seafood', 'Motherland', 'Non food', 'Snack', 'Spices', 'Sample',
]

export function ShopFilters() {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')
  const [category, setCategory] = useState(sp.get('category') ?? '')
  const [minPrice, setMinPrice] = useState(sp.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(sp.get('maxPrice') ?? '')

  function apply(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (category) p.set('category', category)
    if (minPrice) p.set('minPrice', minPrice)
    if (maxPrice) p.set('maxPrice', maxPrice)
    router.push(`/shop${p.toString() ? `?${p.toString()}` : ''}`)
  }

  function reset() {
    setQ('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/shop')
  }

  return (
    <form onSubmit={apply} className="stack">
      <fieldset>
        <legend>Filter products</legend>
        <div className="row">
          <label>
            Search: <input type="search" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label>
            Category:{' '}
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Min $: <input type="number" min={0} step={0.01} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '6em' }} />
          </label>
          <label>
            Max $: <input type="number" min={0} step={0.01} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '6em' }} />
          </label>
          <button type="submit">Apply</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </fieldset>
    </form>
  )
}
