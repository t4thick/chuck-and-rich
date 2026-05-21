'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ProductImage } from '@/components/store/ProductImage'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 75

export function CartDrawer() {
  const {
    items,
    cartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart()

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  if (!cartOpen) return null

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice)
  const progress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="animate-fade-in absolute inset-0 bg-earth-950/45"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="animate-slide-in-right absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-white shadow-[var(--shadow-premium)] sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-earth-200 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-earth-700" aria-hidden />
            <h2 className="text-base font-semibold text-earth-900">
              Cart {totalItems > 0 && <span className="text-earth-500">({totalItems})</span>}
            </h2>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={closeCart} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-earth-100 bg-earth-50 px-5 py-3">
            {remaining > 0 ? (
              <p className="text-xs text-earth-700">
                Add <span className="font-semibold text-earth-900">{formatMoney(remaining)}</span> for
                free shipping
              </p>
            ) : (
              <p className="text-xs font-semibold text-brand-700">You unlocked free shipping</p>
            )}
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-earth-200">
              <div
                className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-earth-100">
              <ShoppingBag className="h-7 w-7 text-earth-400" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-base font-semibold text-earth-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-earth-600">Add products to get started.</p>
            <Link href="/shop" className="mt-5 no-underline" onClick={closeCart}>
              <Button size="lg" className="h-11 px-6">Start shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-2 overflow-y-auto p-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-earth-200 bg-white p-3"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="shrink-0 no-underline"
                    onClick={closeCart}
                  >
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 w-16 rounded-md"
                      sizes="64px"
                      framed={false}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-2 text-sm font-medium text-earth-900 no-underline hover:text-brand-700"
                      onClick={closeCart}
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-semibold text-earth-900">
                      {formatMoney(product.price)}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="inline-flex items-center rounded-md border border-earth-200">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-earth-700 transition-colors hover:bg-earth-50 disabled:opacity-40"
                          aria-label="Decrease"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.75rem] text-center text-sm font-semibold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-earth-700 transition-colors hover:bg-earth-50"
                          aria-label="Increase"
                          onClick={() => updateQuantity(product.id, Math.min(99, quantity + 1))}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-earth-500 transition-colors hover:text-red-600"
                        onClick={() => removeItem(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-earth-200 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-earth-600">Subtotal</span>
                <span className="text-xl font-semibold tracking-tight text-earth-900 tabular-nums">
                  {formatMoney(totalPrice)}
                </span>
              </div>
              <p className="mt-1 text-xs text-earth-500">Shipping &amp; tax calculated at checkout</p>
              <Link href="/checkout" className="mt-4 block no-underline" onClick={closeCart}>
                <Button size="lg" className="h-11 w-full">
                  Checkout
                </Button>
              </Link>
              <Link
                href="/cart"
                className="mt-2 block text-center text-sm font-medium text-earth-700 no-underline hover:text-earth-900"
                onClick={closeCart}
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
