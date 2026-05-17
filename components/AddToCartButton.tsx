'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product.in_stock) {
    return <button disabled>Out of stock</button>
  }

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="row">
      <label>
        Qty:{' '}
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value || '1', 10))))}
          style={{ width: '4em' }}
        />
      </label>
      <button type="button" onClick={handleAdd}>
        {added ? `Added (${quantity})` : 'Add to cart'}
      </button>
    </div>
  )
}
