'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

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

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main suppressHydrationWarning className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h1>
          <p className="text-gray-500 text-sm mb-8">Add products and come back here to checkout.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#1a4731] hover:bg-[#236641] text-white font-bold px-7 py-3 rounded-xl transition-colors"
          >
            Browse the Store
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main suppressHydrationWarning className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1a4731] text-white">
        <div className="max-w-5xl mx-auto px-5 py-10">
          <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
          <p className="text-white/55 text-sm mt-1">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, quantity }) => {
              const bg = CATEGORY_BG[product.category] ?? 'bg-gray-50'
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center"
                >
                  {/* Product image */}
                  <Link href={`/products/${product.id}`} className="shrink-0" tabIndex={-1}>
                    <div className={`w-18 h-18 rounded-lg overflow-hidden ${bg} flex items-center justify-center`} style={{ width: 72, height: 72 }}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7 text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                        </svg>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-[#236641] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-xs mt-0.5">{product.category}</p>
                    <p className="text-[#1a4731] font-bold text-sm mt-1">${product.price.toFixed(2)} each</p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4.5 h-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-1 border border-gray-200 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#1a4731] font-bold text-base transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-semibold text-sm text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#1a4731] font-bold text-base transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold text-gray-800 text-sm">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}

            <div className="flex justify-end pt-1">
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Clear cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
              <h2 className="font-bold text-base text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-2 pb-4 mb-4 border-b border-gray-100">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm gap-2">
                    <span className="text-gray-500 line-clamp-1 flex-1">
                      {product.name} &times; {quantity}
                    </span>
                    <span className="font-semibold text-gray-800 shrink-0">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Shipping</span>
                <span className="text-[#236641] font-semibold text-xs">Calculated at checkout</span>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-100 mt-3 mb-6">
                <span>Total</span>
                <span className="text-[#1a4731]">${totalPrice.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-[#1a4731] hover:bg-[#236641] text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-black/10 active:scale-95"
              >
                Proceed to Checkout
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                Checkout is protected. You&apos;ll be asked to sign in before entering delivery and payment details.
              </p>

              <Link
                href="/shop"
                className="block text-center text-xs text-gray-400 hover:text-[#236641] transition-colors mt-4"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
