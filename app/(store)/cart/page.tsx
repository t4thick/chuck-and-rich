'use client'

import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/store/ProductImage'
import { formatMoney } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-cream py-16" suppressHydrationWarning>
        <div className="store-container">
          <div className="mx-auto max-w-md premium-card px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-14 w-14 text-earth-300" strokeWidth={1.25} />
            <h1 className="mt-5 font-display text-2xl font-bold text-earth-950">Your cart is empty</h1>
            <p className="mt-2 text-earth-600">Add spices, rice, and pantry staples to get started.</p>
            <Link href="/shop" className="mt-8 inline-block no-underline">
              <Button size="lg" variant="accent" className="rounded-xl">
                Browse groceries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-12" suppressHydrationWarning>
      <div className="border-b border-earth-200/80 bg-white">
        <div className="store-container py-10">
          <p className="section-eyebrow">Your order</p>
          <h1 className="section-title mt-2">
            Cart <span className="text-earth-400">({totalItems})</span>
          </h1>
        </div>
      </div>

      <div className="store-container py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-4 lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <article key={product.id} className="premium-card flex gap-4 p-4 sm:p-5">
                <Link href={`/products/${product.id}`} className="shrink-0 no-underline">
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    className="h-24 w-24 rounded-xl sm:h-28 sm:w-28"
                    sizes="112px"
                    framed={false}
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-display text-base font-semibold text-earth-950 no-underline hover:text-brand-800 sm:text-lg"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-earth-500">{product.category}</p>
                  <p className="mt-1 font-bold text-earth-900">{formatMoney(product.price)}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                    <div className="flex items-center rounded-xl border border-earth-200 bg-sand">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-l-xl rounded-r-none"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-[2rem] text-center text-sm font-bold">{quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-l-none rounded-r-xl"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(product.id, Math.min(99, quantity + 1))}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <span className="text-sm font-bold text-earth-800">
                      {formatMoney(product.price * quantity)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div>
            <div className="premium-card sticky top-24 p-6">
              <h2 className="font-display text-lg font-bold text-earth-950">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm">
                <span className="text-earth-600">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-earth-950">{formatMoney(totalPrice)}</span>
              </div>
              <div className="mt-4 border-t border-earth-100 pt-4">
                <div className="flex justify-between text-xl font-bold text-earth-950">
                  <span>Total</span>
                  <span>{formatMoney(totalPrice)}</span>
                </div>
                <p className="mt-1 text-xs text-earth-500">Shipping calculated at checkout</p>
              </div>
              <Link href="/checkout" className="mt-6 block no-underline">
                <Button variant="accent" size="lg" className="h-12 w-full gap-2 rounded-xl">
                  Proceed to checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/shop"
                  className="text-center text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
                >
                  Continue shopping
                </Link>
                <Button type="button" variant="ghost" size="sm" onClick={clearCart}>
                  Clear cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
