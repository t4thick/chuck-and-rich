'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product.in_stock) {
    return (
      <button
        disabled
        className="w-full bg-gray-100 text-gray-400 font-semibold py-3.5 rounded-xl cursor-not-allowed text-sm"
      >
        Out of Stock
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor={`quantity-${product.id}`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Quantity
        </label>
        <select
          id={`quantity-${product.id}`}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30 bg-white"
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAdd}
        className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
          added
            ? 'bg-[#236641] text-white'
            : 'bg-[#1a4731] hover:bg-[#236641] text-white shadow-lg shadow-black/10'
        }`}
      >
        {added ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Added {quantity} to Cart
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Add {quantity} to Cart
          </>
        )}
      </button>
      <Link
        href="/shop"
        className="text-center text-sm text-gray-400 hover:text-[#236641] transition-colors"
      >
        &larr; Continue Shopping
      </Link>
    </div>
  )
}
