import Link from 'next/link'
import { Suspense } from 'react'
import { ProductCard } from '@/components/ProductCard'
import {
  ActiveFilterChips,
  ShopFiltersBar,
  ShopFiltersSidebar,
} from '@/components/shop/ShopFilters'
import { PageHeader } from '@/components/store/PageHeader'
import { fetchCategoryCounts, fetchProductsForShop } from '@/lib/supabase/products'
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

  const [{ products, errorMessage }, categoryCount] = await Promise.all([
    fetchProductsForShop({
      q: p.q,
      category: p.category,
      minPrice: Number.isNaN(minN) ? undefined : minN,
      maxPrice: Number.isNaN(maxN) ? undefined : maxN,
    }),
    fetchCategoryCounts(),
  ])

  const title = p.category ? p.category : p.q ? `Results for “${p.q}”` : 'All groceries'

  return (
    <div className="min-h-screen bg-cream">
      <PageHeader
        eyebrow="Shop"
        title={title}
        subtitle="Premium African & Caribbean pantry staples — filter by category, price, or search."
      />

      <div className="store-container py-8 sm:py-10 lg:py-12">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Suspense fallback={<p className="muted">Loading filters…</p>}>
                <ShopFiltersSidebar categoryCount={categoryCount} />
              </Suspense>
            </div>
          </aside>

          <div>
            <Suspense fallback={null}>
              <ShopFiltersBar categoryCount={categoryCount} />
            </Suspense>

            <Suspense fallback={null}>
              <div className="mt-6">
                <ActiveFilterChips />
              </div>
            </Suspense>

            {errorMessage && (
              <p className="error mt-6">
                {errorMessage} <Link href="/shop">Reload</Link>
              </p>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 border-b border-earth-200/80 pb-4">
              <p className="text-sm font-medium text-earth-600">
                {products.length} product{products.length === 1 ? '' : 's'}
              </p>
              <Link
                href="/"
                className="text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
              >
                ← Back to home
              </Link>
            </div>

            {products.length === 0 && !errorMessage ? (
              <div className="premium-card mt-8 px-6 py-16 text-center">
                <p className="font-display text-xl font-bold text-earth-950">No products found</p>
                <p className="mt-2 text-earth-600">Try a different category or search term.</p>
                <Link href="/shop" className="mt-6 inline-block no-underline">
                  <span className="text-sm font-semibold text-brand-700">Clear filters →</span>
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
