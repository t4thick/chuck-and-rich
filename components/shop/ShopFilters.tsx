'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function ShopFilters() {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')
  const [category, setCategory] = useState(sp.get('category') ?? '')
  const [minPrice, setMinPrice] = useState(sp.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(sp.get('maxPrice') ?? '')
  const [expanded, setExpanded] = useState(
    !!(sp.get('minPrice') || sp.get('maxPrice') || sp.get('category'))
  )

  function apply(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
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

  const activeCategory = sp.get('category')

  return (
    <div className="space-y-4">
      <form onSubmit={apply}>
        <Card>
          <CardContent className="p-4 pt-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search products…"
                  value={q}
                  className="pl-9"
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Search</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setExpanded((v) => !v)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                {(q || category || minPrice || maxPrice) && (
                  <Button type="button" variant="ghost" onClick={reset} aria-label="Clear filters">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {expanded && (
              <div className="mt-4 grid gap-4 border-t border-stone-100 pt-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="filter-category" className="form-label">
                    Category
                  </label>
                  <select
                    id="filter-category"
                    value={category}
                    className="form-select"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All categories</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-min" className="form-label">
                    Min price
                  </label>
                  <Input
                    id="filter-min"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="filter-max" className="form-label">
                    Max price
                  </label>
                  <Input
                    id="filter-max"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={!activeCategory ? 'default' : 'outline'}
          onClick={() => router.push('/shop')}
        >
          All
        </Button>
        {PRODUCT_CATEGORIES.slice(0, 8).map((c) => (
          <Button
            key={c}
            type="button"
            size="sm"
            variant={activeCategory === c ? 'default' : 'outline'}
            onClick={() => router.push(`/shop?category=${encodeURIComponent(c)}`)}
          >
            {c}
          </Button>
        ))}
      </div>
    </div>
  )
}
