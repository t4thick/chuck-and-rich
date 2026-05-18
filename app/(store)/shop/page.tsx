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

  return (
    <div className="stack">
      <h2>Shop</h2>
      <Suspense fallback={<p>Loading filters…</p>}>
        <ShopFilters />
      </Suspense>

      {errorMessage && (
        <p className="error">
          {errorMessage} <Link href="/shop">Reload</Link>
        </p>
      )}

      <p className="muted">{products.length} product{products.length === 1 ? '' : 's'}</p>

      {products.length === 0 && !errorMessage ? (
        <p>No products match.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
