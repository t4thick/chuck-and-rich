import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import type { Product } from '@/types'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams

  const supabase = await createClient()
  let query = supabase.from('products').select('*')
  if (q) query = query.ilike('name', `%${q}%`)
  if (category) query = query.eq('category', category)

  const { data: products, error } = await query.order('name')

  const heading = category ? category : q ? `Results for "${q}"` : 'All Products'

  return (
    <main className="min-h-screen bg-[#f8f8f6]">

      {/* Page header — production: green band + light tagline */}
      <div className="bg-[#0d3d2f] border-b border-emerald-950/50">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">Store</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Shop</h1>
          <p className="text-emerald-100/90 text-sm mt-1">
            Authentic African &amp; Caribbean products, handpicked for you
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <Suspense fallback={<div className="h-11 bg-white rounded-xl border border-gray-200 animate-pulse max-w-xl" />}>
            <SearchBar defaultValue={q ?? ''} />
          </Suspense>
          <Suspense fallback={<div className="h-9 bg-white rounded-full border border-gray-200 animate-pulse w-16" />}>
            <CategoryFilter active={category} />
          </Suspense>
        </div>

        {/* Results row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{heading}</h2>
          <span className="text-sm text-gray-400">
            {products?.length ?? 0} {(products?.length ?? 0) === 1 ? 'product' : 'products'}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 mb-6 text-sm">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {/* Empty state */}
        {!error && (!products || products.length === 0) && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">No products found</p>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Try a different search term or browse by category above.
            </p>
          </div>
        )}

        {/* Product grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
