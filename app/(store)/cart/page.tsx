'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductImage } from '@/components/store/ProductImage'
import { formatMoney } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="page-section" suppressHydrationWarning>
        <div className="store-container">
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" strokeWidth={1.25} />
            <h1 className="mt-4 text-2xl">Your cart is empty</h1>
            <p className="mt-2 text-stone-500">Add some groceries to get started.</p>
            <Link href="/shop" className="mt-6 inline-block no-underline">
              <Button size="lg">Browse products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section pb-24 md:pb-10" suppressHydrationWarning>
      <div className="store-container">
        <h1 className="text-3xl sm:text-4xl">
          Cart <span className="text-stone-400">({totalItems})</span>
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <Card key={product.id}>
                <CardContent className="flex gap-4 p-4">
                  <Link href={`/products/${product.id}`} className="shrink-0 no-underline">
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="h-20 w-20 rounded-lg"
                      sizes="80px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${product.id}`}
                      className="truncate font-semibold text-stone-900 no-underline hover:text-brand-800"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-stone-500">{product.category}</p>
                    <p className="mt-1 font-semibold">{formatMoney(product.price)}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                      <div className="flex items-center rounded-lg border border-stone-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(product.id, Math.min(99, quantity + 1))}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold text-stone-700">
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">Order summary</h2>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">{formatMoney(totalPrice)}</span>
                </div>
                <div className="border-t border-stone-100 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatMoney(totalPrice)}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">Shipping calculated at checkout</p>
                </div>
                <Link href="/checkout" className="block no-underline">
                  <Button variant="accent" size="lg" className="w-full">
                    Proceed to checkout
                  </Button>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/shop" className="text-center text-sm font-medium text-brand-700 no-underline">
                    Continue shopping
                  </Link>
                  <Button type="button" variant="ghost" size="sm" onClick={clearCart}>
                    Clear cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
