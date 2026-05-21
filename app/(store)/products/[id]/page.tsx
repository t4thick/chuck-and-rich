import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, CreditCard, MapPin, RotateCcw, Truck } from 'lucide-react'
import { createClientOptional } from '@/lib/supabase/server'
import { fetchFrequentlyBoughtTogether } from '@/lib/supabase/products'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductCard } from '@/components/ProductCard'
import { ProductImage } from '@/components/store/ProductImage'
import { RecordRecentlyViewed } from '@/components/store/RecordRecentlyViewed'
import { RecentlyViewed } from '@/components/store/RecentlyViewed'
import { FrequentlyBoughtTogether } from '@/components/store/FrequentlyBoughtTogether'
import { Badge } from '@/components/ui/badge'
import { formatMoney } from '@/lib/utils'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

async function loadProduct(id: string): Promise<Product | null> {
  const supabase = await createClientOptional()
  if (!supabase) return null
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  return (data as Product | null) ?? null
}

async function loadRelated(category: string, excludeId: string): Promise<Product[]> {
  const supabase = await createClientOptional()
  if (!supabase) return []
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .eq('in_stock', true)
    .limit(4)
  return (data as Product[]) ?? []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) return { title: 'Product not found', robots: { index: false } }
  return { title: product.name, description: product.description ?? undefined }
}

const TRUST = [
  { icon: CreditCard, label: 'Secure checkout' },
  { icon: Truck, label: 'Pickup & delivery' },
  { icon: RotateCcw, label: 'Easy returns' },
] as const

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) notFound()

  const [related, fbt] = await Promise.all([
    loadRelated(product.category, product.id),
    fetchFrequentlyBoughtTogether(product.category, product.id, 3),
  ])

  return (
    <div className="bg-white">
      <RecordRecentlyViewed product={product} />
      <div className="store-container py-6 sm:py-8 lg:py-10">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-earth-600 no-underline transition-colors hover:text-earth-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to shop
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-xl border border-earth-200 bg-earth-50">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              className="rounded-none"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {product.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-earth-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-earth-900 tabular-nums sm:text-4xl">
              {formatMoney(product.price)}
            </p>

            <div className="mt-3 flex items-center gap-2">
              {product.in_stock ? (
                <Badge variant="success">In stock · ships in 24h</Badge>
              ) : (
                <Badge variant="danger">Out of stock</Badge>
              )}
            </div>

            {product.description && (
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-earth-600">
                {product.description}
              </p>
            )}

            <div className="mt-7 rounded-xl border border-earth-200 bg-white p-5 lg:sticky lg:top-24">
              <AddToCartButton product={product} />
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-earth-200 bg-white px-3 py-2.5 text-xs font-medium text-earth-700"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center gap-2 text-xs text-earth-500">
              <MapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              In-store pickup available in Columbus, OH
            </p>
          </div>
        </div>

      </div>

      <FrequentlyBoughtTogether anchor={product} suggestions={fbt} />

      {related.length > 0 && (
        <section className="border-t border-earth-200 bg-white py-12 sm:py-16">
          <div className="store-container">
            <h2 className="text-xl font-semibold tracking-tight text-earth-900 sm:text-2xl">
              More in {product.category}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <RecentlyViewed excludeId={product.id} />
    </div>
  )
}
