'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'
import type { Product } from '@/types'

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const toast = useToast()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product.in_stock) {
    return (
      <Button type="button" disabled variant="outline" className="h-12 w-full rounded-xl">
        Out of stock
      </Button>
    )
  }

  function handleAdd() {
    addItem(product, quantity)
    toast?.show(`Added ${quantity} × ${product.name}`)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-earth-700">Quantity</span>
        <div className="flex items-center rounded-xl border border-earth-200 bg-sand">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-xl rounded-r-none"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[2.5rem] text-center text-base font-bold text-earth-950">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none rounded-r-xl"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        variant="accent"
        className="h-12 w-full gap-2 rounded-xl text-base"
        onClick={handleAdd}
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        {added ? `Added (${quantity})` : `Add to cart · ${formatMoney(product.price * quantity)}`}
      </Button>
    </div>
  )
}
