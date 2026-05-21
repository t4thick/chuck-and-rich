'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { CategoryIcon } from '@/components/store/CategoryIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function useShopFilterState() {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')
  const [category, setCategory] = useState(sp.get('category') ?? '')
  const [minPrice, setMinPrice] = useState(sp.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(sp.get('maxPrice') ?? '')
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCategory = sp.get('category')
  const hasFilters = !!(sp.get('q') || sp.get('category') || sp.get('minPrice') || sp.get('maxPrice'))

  const pushFilters = useCallback(
    (next: { q?: string; category?: string; minPrice?: string; maxPrice?: string }) => {
      const p = new URLSearchParams()
      const qVal = next.q ?? q
      const catVal = next.category ?? category
      const minVal = next.minPrice ?? minPrice
      const maxVal = next.maxPrice ?? maxPrice
      if (qVal.trim()) p.set('q', qVal.trim())
      if (catVal) p.set('category', catVal)
      if (minVal) p.set('minPrice', minVal)
      if (maxVal) p.set('maxPrice', maxVal)
      router.push(`/shop${p.toString() ? `?${p.toString()}` : ''}`)
    },
    [router, q, category, minPrice, maxPrice]
  )

  function apply(e?: React.FormEvent) {
    e?.preventDefault()
    pushFilters({})
    setMobileOpen(false)
  }

  function reset() {
    setQ('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/shop')
    setMobileOpen(false)
  }

  function setCategoryAndGo(cat: string) {
    setCategory(cat)
    const p = new URLSearchParams(sp.toString())
    if (cat) p.set('category', cat)
    else p.delete('category')
    router.push(`/shop${p.toString() ? `?${p.toString()}` : ''}`)
  }

  return {
    q,
    setQ,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    mobileOpen,
    setMobileOpen,
    activeCategory,
    hasFilters,
    apply,
    reset,
    setCategoryAndGo,
    pushFilters,
  }
}

function PriceFields({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: {
  minPrice: string
  maxPrice: string
  setMinPrice: (v: string) => void
  setMaxPrice: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="filter-min" className="form-label">
          Min $
        </label>
        <Input
          id="filter-min"
          type="number"
          min={0}
          step={0.01}
          placeholder="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="filter-max" className="form-label">
          Max $
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
  )
}

function CategoryList({
  activeCategory,
  onSelect,
  categoryCount,
}: {
  activeCategory: string | null
  onSelect: (cat: string) => void
  categoryCount?: Record<string, number>
}) {
  const categories = categoryCount
    ? [...PRODUCT_CATEGORIES]
        .filter((c) => (categoryCount[c] ?? 0) > 0)
        .sort((a, b) => (categoryCount[b] ?? 0) - (categoryCount[a] ?? 0))
    : PRODUCT_CATEGORIES

  return (
    <ul className="space-y-1">
      <li>
        <button
          type="button"
          onClick={() => onSelect('')}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
            !activeCategory
              ? 'bg-brand-50 text-brand-800'
              : 'text-earth-700 hover:bg-sand hover:text-earth-950'
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand">
            <CategoryIcon category="" className="h-4 w-4" />
          </span>
          All products
        </button>
      </li>
      {categories.map((c) => (
        <li key={c}>
          <button
            type="button"
            onClick={() => onSelect(c)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
              activeCategory === c
                ? 'bg-brand-50 text-brand-800'
                : 'text-earth-700 hover:bg-sand hover:text-earth-950'
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand">
              <CategoryIcon category={c} className="h-4 w-4" />
            </span>
            <span className="line-clamp-1 flex-1">{c}</span>
            {categoryCount?.[c] != null && (
              <span className="shrink-0 text-xs tabular-nums text-earth-400">{categoryCount[c]}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}

export function ShopFiltersSidebar({ categoryCount }: { categoryCount?: Record<string, number> }) {
  const state = useShopFilterState()

  return (
    <div className="premium-card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-earth-500">Filters</p>

      <form onSubmit={state.apply} className="mt-4 space-y-5">
        <div>
          <label htmlFor="sidebar-search" className="form-label">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
            <Input
              id="sidebar-search"
              type="search"
              placeholder="Spices, rice, snacks…"
              value={state.q}
              className="rounded-xl pl-9"
              onChange={(e) => state.setQ(e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="form-label mb-2">Category</p>
          <CategoryList
            activeCategory={state.activeCategory}
            onSelect={state.setCategoryAndGo}
            categoryCount={categoryCount}
          />
        </div>

        <div>
          <p className="form-label mb-2">Price range</p>
          <PriceFields
            minPrice={state.minPrice}
            maxPrice={state.maxPrice}
            setMinPrice={state.setMinPrice}
            setMaxPrice={state.setMaxPrice}
          />
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button type="submit" className="w-full">
            Apply filters
          </Button>
          {state.hasFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={state.reset}>
              Clear all
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export function ShopFiltersBar({ categoryCount }: { categoryCount?: Record<string, number> }) {
  const state = useShopFilterState()
  const mobileCategories = categoryCount
    ? [...PRODUCT_CATEGORIES]
        .filter((c) => (categoryCount[c] ?? 0) > 0)
        .sort((a, b) => (categoryCount[b] ?? 0) - (categoryCount[a] ?? 0))
    : PRODUCT_CATEGORIES

  return (
    <div className="space-y-4 lg:hidden">
      <form onSubmit={state.apply} className="premium-card p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
            <Input
              type="search"
              placeholder="Search products…"
              value={state.q}
              className="rounded-xl pl-9"
              onChange={(e) => state.setQ(e.target.value)}
            />
          </div>
          <Button type="submit" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Toggle filters"
            onClick={() => state.setMobileOpen((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {state.mobileOpen && (
          <div className="mt-4 space-y-4 border-t border-earth-100 pt-4">
            <div>
              <label htmlFor="mobile-category" className="form-label">
                Category
              </label>
              <select
                id="mobile-category"
                value={state.category}
                className="form-select"
                onChange={(e) => state.setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {mobileCategories.map((c) => (
                  <option key={c} value={c}>
                    {categoryCount?.[c] != null ? `${c} (${categoryCount[c]})` : c}
                  </option>
                ))}
              </select>
            </div>
            <PriceFields
              minPrice={state.minPrice}
              maxPrice={state.maxPrice}
              setMinPrice={state.setMinPrice}
              setMaxPrice={state.setMaxPrice}
            />
            <Button type="submit" className="w-full">
              Apply
            </Button>
          </div>
        )}
      </form>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => state.setCategoryAndGo('')}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition',
            !state.activeCategory
              ? 'bg-brand-800 text-white shadow-sm'
              : 'border border-earth-200 bg-white text-earth-700'
          )}
        >
          All
        </button>
        {mobileCategories.slice(0, 10).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => state.setCategoryAndGo(c)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition',
              state.activeCategory === c
                ? 'bg-brand-800 text-white shadow-sm'
                : 'border border-earth-200 bg-white text-earth-700'
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ActiveFilterChips() {
  const sp = useSearchParams()
  const router = useRouter()
  const chips: { key: string; label: string; clear: () => void }[] = []

  const q = sp.get('q')
  const category = sp.get('category')
  const minPrice = sp.get('minPrice')
  const maxPrice = sp.get('maxPrice')

  if (q) {
    chips.push({
      key: 'q',
      label: `“${q}”`,
      clear: () => {
        const p = new URLSearchParams(sp.toString())
        p.delete('q')
        router.push(`/shop${p.toString() ? `?${p.toString()}` : ''}`)
      },
    })
  }
  if (category) {
    chips.push({
      key: 'category',
      label: category,
      clear: () => {
        const p = new URLSearchParams(sp.toString())
        p.delete('category')
        router.push(`/shop${p.toString() ? `?${p.toString()}` : ''}`)
      },
    })
  }
  if (minPrice || maxPrice) {
    chips.push({
      key: 'price',
      label: `$${minPrice || '0'} – $${maxPrice || '∞'}`,
      clear: () => {
        const p = new URLSearchParams(sp.toString())
        p.delete('minPrice')
        p.delete('maxPrice')
        router.push(`/shop${p.toString() ? `?${p.toString()}` : ''}`)
      },
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-earth-500">Active</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex items-center gap-1.5 rounded-full border border-earth-200 bg-white px-3 py-1.5 text-xs font-medium text-earth-700 transition hover:border-earth-300 hover:bg-sand"
        >
          {chip.label}
          <X className="h-3 w-3" aria-hidden />
        </button>
      ))}
    </div>
  )
}

/** @deprecated Use ShopFiltersBar + ShopFiltersSidebar */
export function ShopFilters() {
  return <ShopFiltersBar />
}
