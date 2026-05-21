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
  const { addItem, openCart } = useCart()
  const toast = useToast()

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!product.in_stock) return
    addItem(product, 1)
    toast?.show(`Added: ${product.name}`)
    openCart()
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-earth-200/70 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-[var(--shadow-card-hover)]">
      <Link href={`/products/${product.id}`} className="relative block no-underline">
        <div className="relative overflow-hidden">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="rounded-none transition duration-500 group-hover:scale-[1.03]"
          />
          {product.in_stock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-earth-950/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0 sm:hidden">
              <span className="text-sm font-semibold text-white">Tap to view</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <Badge variant="brand" className="mb-2 w-fit max-w-full truncate text-[10px] sm:text-xs">
            {product.category}
          </Badge>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-brand-950 transition group-hover:text-brand-700 sm:text-lg">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <p className="text-lg font-bold text-earth-900 sm:text-xl">{formatMoney(product.price)}</p>
            {!product.in_stock && (
              <Badge variant="outline" className="shrink-0">
                Sold out
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <div className="border-t border-earth-100 p-3 sm:p-4">
        <Button
          type="button"
          variant={product.in_stock ? 'default' : 'outline'}
          className="h-11 w-full gap-2 text-sm font-semibold sm:h-12"
          disabled={!product.in_stock}
          onClick={handleAdd}
        >
          {product.in_stock ? (
            <>
              <Plus className="h-4 w-4" aria-hidden />
              Quick add
            </>
          ) : (
            'Unavailable'
          )}
        </Button>
      </div>
    </article>
  )
}

/** Compact horizontal card for cart-adjacent UI if needed later */
export function ProductCardMini({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="flex gap-3 no-underline">
      <ProductImage src={product.image_url} alt={product.name} className="h-16 w-16 rounded-xl" sizes="64px" />
      <div>
        <p className="line-clamp-2 text-sm font-semibold text-brand-950">{product.name}</p>
        <p className="text-sm font-bold text-earth-800">{formatMoney(product.price)}</p>
      </div>
    </Link>
  )
}
