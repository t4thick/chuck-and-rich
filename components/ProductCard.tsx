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
    <article className="group premium-card premium-card-hover flex h-full flex-col">
      <Link href={`/products/${product.id}`} className="relative flex flex-1 flex-col no-underline">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="rounded-none"
          sizes="(max-width:640px) 50vw, 25vw"
        />
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <Badge variant="brand" className="mb-2 w-fit max-w-full truncate text-[10px]">
            {product.category}
          </Badge>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-earth-900 transition group-hover:text-brand-700 sm:text-base">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <p className="text-base font-bold text-brand-700 sm:text-lg">{formatMoney(product.price)}</p>
            {!product.in_stock && (
              <Badge variant="outline" className="shrink-0 text-[10px]">
                Out of stock
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <div className="border-t border-earth-100 p-2 sm:p-3">
        <Button
          type="button"
          variant={product.in_stock ? 'default' : 'outline'}
          className="h-10 w-full gap-2 text-sm"
          disabled={!product.in_stock}
          onClick={handleAdd}
        >
          {product.in_stock ? (
            <>
              <Plus className="h-4 w-4" aria-hidden />
              Add to cart
            </>
          ) : (
            'Unavailable'
          )}
        </Button>
      </div>
    </article>
  )
}

export function ProductCardMini({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="flex gap-3 no-underline">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        className="h-16 w-16 rounded-md"
        sizes="64px"
        framed={false}
      />
      <div>
        <p className="line-clamp-2 text-sm font-semibold text-earth-900">{product.name}</p>
        <p className="text-sm font-bold text-brand-700">{formatMoney(product.price)}</p>
      </div>
    </Link>
  )
}
