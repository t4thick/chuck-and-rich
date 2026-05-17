'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product; mode?: 'default' | 'listing' }) {
  const { addItem } = useCart()
  const toast = useToast()

  function handleAdd() {
    addItem(product, 1)
    toast?.show(`Added: ${product.name}`)
  }

  return (
    <tr>
      <td>
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </td>
      <td>{product.category}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>{product.in_stock ? 'In stock' : 'Out'}</td>
      <td>
        <button type="button" onClick={handleAdd} disabled={!product.in_stock}>
          Add
        </button>
      </td>
    </tr>
  )
}
