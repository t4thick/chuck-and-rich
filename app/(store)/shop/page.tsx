import Link from 'next/link'
import { Suspense } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { fetchProductsForShop } from '@/lib/supabase/products'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string }>
}) {
  const p = await searchParams
  const minN = p.minPrice ? parseFloat(p.minPrice) : NaN
  const maxN = p.maxPrice ? parseFloat(p.maxPrice) : NaN

  const { products, errorMessage } = await fetchProductsForShop({
    q: p.q,
    category: p.category,
    minPrice: Number.isNaN(minN) ? undefined : minN,
    maxPrice: Number.isNaN(maxN) ? undefined : maxN,
  })

  const title = p.category
    ? p.category
    : p.q
      ? `Results for “${p.q}”`
      : 'All products'

  return (
    <div className="page-section">
      <div className="store-container">
        <div className="mb-10">
          <p className="section-eyebrow">Shop all</p>
          <h1 className="section-title mt-2">{title === 'All products' ? 'Our marketplace' : title}</h1>
          <p className="section-subtitle">
            Premium African & Caribbean groceries — filter by category, price, or search.
          </p>
        </div>

        <Suspense fallback={<p className="muted">Loading filters…</p>}>
          <ShopFilters />
        </Suspense>

        {errorMessage && (
          <p className="error mt-6">
            {errorMessage}{' '}
            <Link href="/shop">Reload</Link>
          </p>
        )}

        <p className="muted mt-6">
          {products.length} product{products.length === 1 ? '' : 's'}
        </p>

        {products.length === 0 && !errorMessage ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium text-stone-700">No products match your filters</p>
            <p className="mt-1 text-stone-500">Try a different category or search term.</p>
            <Link href="/shop" className="mt-4 inline-block no-underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
