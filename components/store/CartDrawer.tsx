'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ProductImage } from '@/components/store/ProductImage'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'

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

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-earth-950/50 backdrop-blur-sm"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="animate-slide-in-right absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-cream shadow-[var(--shadow-premium)] sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-earth-200 bg-sand px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
              <ShoppingBag className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-earth-900">Your cart</h2>
              {totalItems > 0 && (
                <p className="text-xs text-earth-600">{totalItems} item{totalItems === 1 ? '' : 's'}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
              <ShoppingBag className="h-9 w-9 text-earth-400" strokeWidth={1.25} />
            </div>
            <p className="mt-5 font-display text-xl font-semibold text-earth-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-earth-600">Discover spices, grains &amp; fresh imports.</p>
            <Link href="/shop" className="mt-6 no-underline" onClick={closeCart}>
              <Button size="lg" className="btn-shine">Shop groceries</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="animate-fade-up flex gap-3 rounded-xl border border-earth-200/80 bg-white p-3 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
                >
                  <Link href={`/products/${product.id}`} className="shrink-0 no-underline" onClick={closeCart}>
                    <ProductImage src={product.image_url} alt={product.name} className="h-16 w-16 rounded-xl" sizes="64px" framed={false} />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-2 text-sm font-semibold text-brand-950 no-underline hover:text-brand-700"
                      onClick={closeCart}
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-bold text-earth-800">{formatMoney(product.price)}</p>
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <div className="flex items-center rounded-lg border border-earth-200 bg-cream">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-earth-700 hover:bg-earth-100"
                          aria-label="Decrease"
                          onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold">{quantity}</span>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-earth-700 hover:bg-earth-100"
                          aria-label="Increase"
                          onClick={() => updateQuantity(product.id, Math.min(99, quantity + 1))}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="ml-auto text-xs font-medium text-red-600 hover:underline"
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
                <span className="font-display text-2xl font-semibold text-earth-900">
                  {formatMoney(totalPrice)}
                </span>
              </div>
              <p className="mt-1 text-xs text-earth-500">Shipping &amp; tax calculated at checkout</p>
              <Link href="/checkout" className="mt-4 block no-underline" onClick={closeCart}>
                <Button variant="accent" size="lg" className="btn-shine h-12 w-full">
                  Secure checkout
                </Button>
              </Link>
              <Link
                href="/cart"
                className="mt-2 block text-center text-sm font-medium text-brand-700 no-underline hover:underline"
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
