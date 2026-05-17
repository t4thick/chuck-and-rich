import Link from 'next/link'
import { Suspense } from 'react'
import { fetchProductsForShop } from '@/lib/supabase/products'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { getListingMeta } from '@/lib/product-derived'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    country?: string
    availability?: string
  }>
}) {
  const p = await searchParams
  const { q, category, minPrice, maxPrice, country: countryParam, availability: availabilityParam } = p

  const minN = minPrice != null && minPrice !== '' ? parseFloat(minPrice) : NaN
  const maxN = maxPrice != null && maxPrice !== '' ? parseFloat(maxPrice) : NaN

  const { products: productsRaw, errorMessage } = await fetchProductsForShop({
    q,
    category,
    minPrice: Number.isNaN(minN) ? undefined : minN,
    maxPrice: Number.isNaN(maxN) ? undefined : maxN,
  })

  let products: Product[] = productsRaw

  const countryFilter = countryParam && countryParam !== 'all' ? countryParam : null
  const availabilityFilter = availabilityParam && availabilityParam !== 'all' ? availabilityParam : null

  products = products.filter((row) => {
    const meta = getListingMeta(row)
    if (countryFilter && meta.countrySlug !== countryFilter) return false
    if (availabilityFilter === 'available') {
      if (meta.stockBand === 'out') return false
    }
    if (availabilityFilter === 'low') {
      if (meta.stockBand !== 'low') return false
    }
    return true
  })

  const heading = category ? category : q ? `Results for "${q}"` : 'All products'

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <div className="border-b border-[#0f3d2e]/20 bg-[#0f3d2e]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b400]">Store</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Shop</h1>
          <p className="mt-1 text-sm text-white/85">Browse by category, price, origin, and availability.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-600">
            <li>
              <Link href="/" className="font-semibold text-[#0f3d2e] hover:underline">
                Home
              </Link>
            </li>
            <li className="text-neutral-400" aria-hidden>
              /
            </li>
            <li className="font-medium text-neutral-900" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>

        <div className="mb-8 max-w-2xl">
          <Suspense
            fallback={<div className="h-11 max-w-xl animate-pulse rounded-xl border border-neutral-200 bg-white" />}
          >
            <SearchBar defaultValue={q ?? ''} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-10 xl:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-[4.5rem] lg:self-start">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl border border-neutral-200 bg-white" />}>
              <ShopFilters />
            </Suspense>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-4">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900">{heading}</h2>
              <span className="text-sm text-neutral-500">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </span>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">{errorMessage}</p>
                <p className="mt-2 text-amber-900/90">
                  Call{' '}
                  <a href="tel:+16144460893" className="font-semibold underline">
                    (614) 446-0893
                  </a>{' '}
                  or visit us in store — we&apos;re happy to help.
                </p>
              </div>
            )}

            {!errorMessage && products.length === 0 && (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-20 text-center">
                <p className="text-lg font-semibold text-neutral-800">No products match your filters</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
                  Try widening the price range, clearing country or availability, or searching with different keywords.
                </p>
              </div>
            )}

            {products.length > 0 && (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} mode="listing" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
