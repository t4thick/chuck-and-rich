'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AddToCartButton({ product }: { product: import('@/types').Product }) {
  const { addItem, openCart } = useCart()
  const toast = useToast()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product.in_stock) {
    return (
      <Button type="button" disabled variant="outline" className="w-full sm:w-auto">
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <label htmlFor="product-qty" className="form-label">
          Quantity
        </label>
        <Input
          id="product-qty"
          type="number"
          min={1}
          max={99}
          value={quantity}
          className="w-24"
          onChange={(e) =>
            setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value || '1', 10))))
          }
        />
      </div>
      <Button type="button" size="lg" className="gap-2 sm:flex-1" onClick={handleAdd}>
        <ShoppingBag className="h-4 w-4" aria-hidden />
        {added ? `Added (${quantity})` : 'Add to cart'}
      </Button>
    </div>
  )
}
