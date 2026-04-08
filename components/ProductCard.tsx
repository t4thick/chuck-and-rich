'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/types'
import { pseudoRatingFromId } from '@/lib/product-rating'
import { getListingMeta, type ListingBadge } from '@/lib/product-derived'

const CATEGORY_BG: Record<string, string> = {
  Beverages: 'bg-sky-50',
  Bread: 'bg-amber-50',
  Canned: 'bg-red-50',
  'Caribbean product': 'bg-lime-50',
  Cosmetics: 'bg-pink-50',
  'Dairy And Tea': 'bg-indigo-50',
  'Flours & Rice': 'bg-orange-50',
  'Fresh Produce': 'bg-emerald-50',
  'Frozen foods': 'bg-cyan-50',
  'Meat and Seafood': 'bg-rose-50',
  Motherland: 'bg-yellow-50',
  'Non food': 'bg-purple-50',
  Snack: 'bg-fuchsia-50',
  Spices: 'bg-yellow-50',
}

function badgeClass(b: ListingBadge): string {
  if (b.variant === 'accent') return 'bg-[#0f3d2e] text-white shadow-sm'
  if (b.variant === 'gold') return 'bg-[#f4b400] text-neutral-900 shadow-sm'
  return 'border border-neutral-200/90 bg-white/95 text-neutral-800 shadow-sm backdrop-blur-sm'
}

function StarRating({ value }: { value: number }) {
  const v = Math.min(5, Math.max(0, value))
  const full = Math.round(v)
  return (
    <div className="flex items-center gap-1.5" aria-label={`${v.toFixed(1)} out of 5 stars`}>
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-3.5 w-3.5 ${i < full ? 'text-[#f4b400]' : 'text-neutral-200'}`}
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium tabular-nums text-neutral-500">{v.toFixed(1)}</span>
    </div>
  )
}

export function ProductCard({
  product,
  mode = 'default',
}: {
  product: Product
  mode?: 'default' | 'listing'
}) {
  const { addItem } = useCart()
  const toast = useToast()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const rating = pseudoRatingFromId(product.id)
  const meta = mode === 'listing' ? getListingMeta(product) : null

  const placeholderBg = CATEGORY_BG[product.category] ?? 'bg-neutral-50'

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
    toast?.show(`Added to cart — ${product.name}`)
  }

  const listingHover =
    mode === 'listing'
      ? 'transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:shadow-2xl hover:ring-1 hover:ring-[#0f3d2e]/10'
      : 'transition duration-300 hover:-translate-y-0.5 hover:shadow-lg'

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${listingHover} ${
        mode === 'listing' ? 'hover:scale-[1.02]' : 'hover:border-[#0f3d2e]/20'
      }`}
    >
      <Link href={`/products/${product.id}`} className="block shrink-0" tabIndex={-1}>
        <div className={`relative aspect-[4/5] overflow-hidden sm:aspect-square ${placeholderBg}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className={`h-full w-full object-cover object-center ${
                mode === 'listing' ? 'transition duration-500 ease-out group-hover:scale-105' : 'transition duration-500 group-hover:scale-[1.03]'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="h-12 w-12 text-neutral-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          )}

          {mode === 'listing' && meta && meta.badges.length > 0 && (
            <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-0.5rem)] flex-wrap gap-1">
              {meta.badges.map((b) => (
                <span
                  key={b.label}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass(b)}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {mode === 'listing' && meta && meta.stockBand !== 'out' && (
            <span
              className={`absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                meta.stockBand === 'low'
                  ? 'bg-amber-100 text-amber-950 ring-1 ring-amber-200/90'
                  : 'bg-emerald-100 text-emerald-950 ring-1 ring-emerald-200/90'
              }`}
            >
              {meta.stockBand === 'low' ? 'Low stock' : 'In stock'}
            </span>
          )}

          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-[1px]">
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-white">Sold out</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-1 line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {product.category}
        </p>

        {mode === 'listing' && meta?.countryLabel && (
          <p className="mb-1 text-xs font-medium text-neutral-600">Origin: {meta.countryLabel}</p>
        )}

        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="min-h-[2.45rem] text-sm font-semibold leading-snug text-neutral-900 line-clamp-2 group-hover:text-[#0f3d2e]">
            {product.name}
          </h3>
        </Link>

        {mode === 'listing' && meta?.sizeLine && (
          <p className="mt-1.5 text-xs font-semibold text-neutral-700">{meta.sizeLine}</p>
        )}

        <div className="mt-2">
          <StarRating value={rating} />
        </div>

        <div className="mt-3 space-y-3 border-t border-neutral-100 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-bold text-[#0f3d2e]">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">Qty</span>
              <div className="inline-flex items-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
                <button
                  type="button"
                  aria-label={`Decrease quantity for ${product.name}`}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 text-neutral-600 transition hover:bg-neutral-50"
                >
                  −
                </button>
                <span className="min-w-[1.75rem] px-1 text-center text-xs font-semibold text-neutral-800">{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity for ${product.name}`}
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="h-8 w-8 text-neutral-600 transition hover:bg-neutral-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.in_stock || added}
            aria-label={`Add ${product.name} to cart`}
            className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-md transition active:scale-[0.98] ${
              added
                ? 'bg-[#0f3d2e] text-white'
                : product.in_stock
                  ? 'bg-[#0f3d2e] text-white hover:bg-[#0c3024] hover:shadow-lg'
                  : 'cursor-not-allowed bg-neutral-100 text-neutral-400 shadow-none'
            }`}
          >
            {added ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Added ({quantity})
              </>
            ) : product.in_stock ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add to Cart
              </>
            ) : (
              'Out of stock'
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
