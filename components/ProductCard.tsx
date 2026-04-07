'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

const CATEGORY_BG: Record<string, string> = {
  Beverages:           'bg-sky-50',
  Bread:               'bg-amber-50',
  Canned:              'bg-red-50',
  'Caribbean product': 'bg-lime-50',
  Cosmetics:           'bg-pink-50',
  'Dairy And Tea':     'bg-indigo-50',
  'Flours & Rice':     'bg-orange-50',
  'Fresh Produce':     'bg-emerald-50',
  'Frozen foods':      'bg-cyan-50',
  'Meat and Seafood':  'bg-rose-50',
  Motherland:          'bg-yellow-50',
  'Non food':          'bg-purple-50',
  Snack:               'bg-fuchsia-50',
  Spices:              'bg-yellow-50',
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const placeholderBg = CATEGORY_BG[product.category] ?? 'bg-gray-50'

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg transition-all group">

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block shrink-0" tabIndex={-1}>
        <div className={`relative aspect-square overflow-hidden ${placeholderBg}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-12 h-12 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          )}

          {/* Stock badge overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Sold Out</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category tag */}
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.11em] mb-1 line-clamp-1">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-[#236641] transition-colors line-clamp-2 min-h-[2.45rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA */}
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#236641] font-bold text-base">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.11em]">
                Qty
              </span>
              <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  type="button"
                  aria-label={`Decrease quantity for ${product.name}`}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-7 w-7 text-gray-600 transition hover:bg-gray-50"
                >
                  -
                </button>
                <span className="min-w-7 px-1 text-center text-xs font-semibold text-gray-800">{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity for ${product.name}`}
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="h-7 w-7 text-gray-600 transition hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.in_stock || added}
            aria-label={`Add ${product.name} to cart`}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all active:scale-95 ${
              added
                ? 'bg-[#236641] text-white'
                : product.in_stock
                ? 'bg-[#1a4731] hover:bg-[#236641] text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Added {quantity}
              </>
            ) : product.in_stock ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add {quantity}
              </>
            ) : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  )
}
