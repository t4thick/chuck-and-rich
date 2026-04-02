import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { AddToCartButton } from '@/components/AddToCartButton'
import type { Product } from '@/types'

const CATEGORY_BG: Record<string, string> = {
  Beverages:           'bg-sky-50',
  Bread:               'bg-amber-50',
  Canned:              'bg-red-50',
  'Caribbean product': 'bg-lime-50',
  Cosmetics:           'bg-pink-50',
  'Dairy And Tea':     'bg-indigo-50',
  'Flours & Rice':     'bg-orange-50',
  'Fresh Produce':     'bg-emerald-50',
  'Frozen foods':      'bg-cyan-50',
  'Meat and Seafood':  'bg-rose-50',
  Motherland:          'bg-yellow-50',
  'Non food':          'bg-purple-50',
  Snack:               'bg-fuchsia-50',
  Spices:              'bg-yellow-50',
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4)

  const placeholderBg = CATEGORY_BG[product.category] ?? 'bg-gray-50'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-[#236641] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-[#236641] transition-colors">Shop</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#236641] transition-colors">
            {product.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image */}
            <div className={`aspect-square md:aspect-auto md:min-h-96 ${placeholderBg} flex items-center justify-center overflow-hidden`}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-24 h-24 text-gray-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="p-8 lg:p-10 flex flex-col">
              <span className="inline-block border border-[#1a4731]/20 text-[#236641] text-xs font-semibold px-3 py-1 rounded-full self-start mb-5 tracking-wide uppercase">
                {product.category}
              </span>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>
              )}

              <div className="text-3xl font-extrabold text-[#1a4731] mb-3">
                ${product.price.toFixed(2)}
              </div>

              <div className="flex items-center gap-2 mb-8">
                <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className={`text-sm font-medium ${product.in_stock ? 'text-emerald-700' : 'text-red-500'}`}>
                  {product.in_stock ? 'In Stock — Ready to Ship' : 'Currently Out of Stock'}
                </span>
              </div>

              <AddToCartButton product={product} />

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                {[
                  { label: 'Tracked Delivery', sub: 'Updates from order to door' },
                  { label: 'Secure Checkout', sub: 'Clear total, safe payment' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#236641] mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                      <p className="text-[11px] text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
              More in {product.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
