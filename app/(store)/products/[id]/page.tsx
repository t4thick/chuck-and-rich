import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, Lock, MapPin, Truck } from 'lucide-react'
import { createClientOptional } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductCard } from '@/components/ProductCard'
import { ProductImage } from '@/components/store/ProductImage'
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
  { icon: Lock, label: 'Secure checkout' },
  { icon: Truck, label: 'Pickup & delivery' },
  { icon: Heart, label: 'Family-owned store' },
] as const

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) notFound()

  const related = await loadRelated(product.category, product.id)

  return (
    <div className="min-h-screen bg-cream">
      <div className="store-container py-8 sm:py-10 lg:py-12">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-earth-600 no-underline transition hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="premium-card overflow-hidden rounded-[2rem]">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              className="rounded-none"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="lg:pt-2">
            <Badge variant="brand" className="mb-4">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-bold leading-tight text-earth-950 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
              {formatMoney(product.price)}
            </p>

            <div className="mt-4">
              {product.in_stock ? (
                <Badge variant="success">In stock · ready to ship</Badge>
              ) : (
                <Badge variant="danger">Out of stock</Badge>
              )}
            </div>

            {product.description && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-earth-600 sm:text-lg">
                {product.description}
              </p>
            )}

            <div className="premium-card mt-8 p-6 lg:sticky lg:top-24">
              <AddToCartButton product={product} />
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-earth-200/80 bg-white px-3 py-3 text-xs font-semibold text-earth-700"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-center gap-2 text-sm text-earth-500">
              <MapPin className="h-4 w-4 text-brand-600" aria-hidden />
              Also available for in-store pickup in Columbus, OH
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-earth-200/80 pt-16 sm:mt-20">
            <p className="section-eyebrow">You may also like</p>
            <h2 className="section-title mt-2">More in {product.category}</h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
