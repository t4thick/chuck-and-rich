import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClientOptional } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/AddToCartButton'
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) notFound()

  return (
    <div className="page-section">
      <div className="store-container">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 no-underline hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to shop
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="rounded-2xl"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority
          />

          <div>
            <Badge variant="brand" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>

            <p className="mt-4 text-3xl font-bold text-stone-900">{formatMoney(product.price)}</p>

            <div className="mt-3">
              {product.in_stock ? (
                <Badge variant="success">In stock</Badge>
              ) : (
                <Badge variant="danger">Out of stock</Badge>
              )}
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-stone-600">{product.description}</p>
            )}

            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-[var(--shadow-card)]">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
