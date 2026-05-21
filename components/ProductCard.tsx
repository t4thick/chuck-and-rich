'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { ProductImage } from '@/components/store/ProductImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const toast = useToast()

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!product.in_stock) return
    addItem(product, 1)
    toast?.show(`Added: ${product.name}`)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <Link href={`/products/${product.id}`} className="no-underline">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="rounded-none"
        />
        <div className="flex flex-1 flex-col p-4">
          <Badge variant="brand" className="mb-2 w-fit max-w-full truncate">
            {product.category}
          </Badge>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-brand-950 group-hover:text-brand-800">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <p className="text-lg font-bold text-stone-900">{formatMoney(product.price)}</p>
            {!product.in_stock && (
              <Badge variant="outline" className="shrink-0">
                Out of stock
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <div className="border-t border-stone-100 p-3 pt-0">
        <Button
          type="button"
          variant={product.in_stock ? 'default' : 'outline'}
          className="w-full gap-1.5"
          disabled={!product.in_stock}
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" aria-hidden />
          {product.in_stock ? 'Add to cart' : 'Unavailable'}
        </Button>
      </div>
    </article>
  )
}
