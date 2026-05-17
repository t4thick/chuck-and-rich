import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/AddToCartButton'
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
  return { title: product.name }
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
    <div className="stack">
      <p className="muted">
        <Link href="/shop">← Back to shop</Link>
      </p>

      <h2>{product.name}</h2>
      <p className="muted">Category: {product.category}</p>

      {product.description && <p>{product.description}</p>}

      <p>
        <strong>Price:</strong> ${product.price.toFixed(2)}
      </p>
      <p>
        <strong>Status:</strong> {product.in_stock ? 'In stock' : 'Out of stock'}
      </p>

      <AddToCartButton product={product} />
    </div>
  )
}
