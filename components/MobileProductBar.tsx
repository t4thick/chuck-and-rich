'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/types'

/**
 * Sticky bottom bar shown on phones (md:hidden) when the user scrolls past the
 * inline Add-to-Cart on a product page. Quick add + quick view of cart total
 * without scrolling back up — a standard pattern for mobile commerce.
 */
export function MobileProductBar({ product }: { product: Product }) {
  const { addItem, totalItems, totalPrice } = useCart()
  const toast = useToast()
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Show the bar only after the user scrolls past the original Add-to-Cart card
  // (an invisible sentinel is placed in the DOM at that point).
  useEffect(() => {
    const sentinel = document.getElementById('lq-add-to-cart-sentinel')
    sentinelRef.current = sentinel as HTMLDivElement | null
    if (!sentinel) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setVisible(!entry.isIntersecting)
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  function handleAdd() {
    if (!product.in_stock) return
    addItem(product, 1)
    setAdded(true)
    toast?.show(`Added to cart — ${product.name}`)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur transition-transform duration-200 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-neutral-500">{product.category}</p>
          <p className="truncate text-sm font-bold text-neutral-900">${product.price.toFixed(2)}</p>
        </div>

        {totalItems > 0 && (
          <Link
            href="/cart"
            className="relative inline-flex h-11 min-w-[44px] items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
            aria-label={`View cart, ${totalItems} item${totalItems === 1 ? '' : 's'}, total $${totalPrice.toFixed(2)}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="mr-1 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272"
              />
            </svg>
            ${totalPrice.toFixed(2)}
            <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f4b400] px-1 text-[10px] font-bold text-neutral-900">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.in_stock || added}
          className={`inline-flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-md transition active:scale-[0.98] ${
            !product.in_stock
              ? 'cursor-not-allowed bg-neutral-200 text-neutral-500 shadow-none'
              : added
                ? 'bg-[#236641] text-white'
                : 'bg-[#1a4731] text-white hover:bg-[#236641]'
          }`}
        >
          {!product.in_stock ? (
            'Out of stock'
          ) : added ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}
