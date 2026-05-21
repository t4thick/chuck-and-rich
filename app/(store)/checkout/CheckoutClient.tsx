'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CheckoutStripePayment } from './CheckoutStripePayment'
import {
  calculateShipping,
  SHIPPING_METHOD_LABEL,
  type ShippingMethod,
} from '@/lib/shipping'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

type CheckoutAccount = {
  email: string
  fullName: string
  phone: string
}

type CheckoutForm = {
  name: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  country: string
  postalCode: string
}

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Mexico']

export function CheckoutClient({ initialAccount }: { initialAccount: CheckoutAccount }) {
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCart()
  const router = useRouter()
  const detailsFormRef = useRef<HTMLFormElement>(null)

  const [form, setForm] = useState<CheckoutForm>({
    name: initialAccount.fullName,
    email: initialAccount.email,
    phone: initialAccount.phone,
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'United States',
    postalCode: '',
  })
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [returnUrl, setReturnUrl] = useState('')

  useEffect(() => {
    setReturnUrl(`${getAuthSiteOrigin()}/checkout/success`)
  }, [])

  const cartFingerprint = useMemo(
    () => items.map((i) => `${i.product.id}:${i.quantity}`).join('|'),
    [items]
  )

  useEffect(() => {
    setClientSecret(null)
  }, [cartFingerprint, totalPrice, shippingMethod])

  const shipping = useMemo(
    () =>
      calculateShipping({
        subtotal: totalPrice,
        country: form.country,
        state: form.state,
        method: shippingMethod,
      }),
    [form.country, form.state, shippingMethod, totalPrice]
  )
  const grandTotal = totalPrice + shipping.fee

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function preparePayment() {
    const el = detailsFormRef.current
    if (el && !el.checkValidity()) {
      el.reportValidity()
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: [form.address1.trim(), form.address2.trim()].filter(Boolean).join(', '),
          city: form.city,
          state: form.state,
          country: form.country,
          postalCode: form.postalCode,
          items,
          shippingMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?next=/checkout')
          return
        }
        setError(typeof data.error === 'string' ? data.error : 'Could not start checkout.')
        return
      }

      if (typeof data.clientSecret === 'string' && data.clientSecret) {
        setClientSecret(data.clientSecret)
        return
      }

      setError('Could not initialize payment.')
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-section">
        <div className="store-container">
          <h1 className="text-3xl">Checkout</h1>
          <p className="mt-4 text-stone-600">
            Your cart is empty.{' '}
            <Link href="/shop" className="font-semibold">
              Back to shop
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section pb-24 md:pb-10">
      <div className="store-container">
        <h1 className="text-3xl sm:text-4xl">Checkout</h1>
        <p className="muted mt-2">
          Signed in as {initialAccount.email} · {totalItems} item{totalItems === 1 ? '' : 's'}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <form ref={detailsFormRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <fieldset>
                <legend>1. Account</legend>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-input bg-stone-50" value={form.email} readOnly />
                  </div>
                  <div>
                    <label className="form-label">Full name</label>
                    <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required autoComplete="name" />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} required autoComplete="tel" />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>2. Delivery address</legend>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Street</label>
                    <input type="text" name="address1" className="form-input" value={form.address1} onChange={handleChange} required autoComplete="address-line1" />
                  </div>
                  <div>
                    <label className="form-label">Apt / Suite</label>
                    <input type="text" name="address2" className="form-input" value={form.address2} onChange={handleChange} autoComplete="address-line2" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label">City</label>
                      <input type="text" name="city" className="form-input" value={form.city} onChange={handleChange} required autoComplete="address-level2" />
                    </div>
                    <div>
                      <label className="form-label">State</label>
                      <input type="text" name="state" className="form-input" value={form.state} onChange={handleChange} required autoComplete="address-level1" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label">Country</label>
                      <select name="country" className="form-select" value={form.country} onChange={handleChange}>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">ZIP</label>
                      <input type="text" name="postalCode" className="form-input" value={form.postalCode} onChange={handleChange} required autoComplete="postal-code" />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>3. Shipping method</legend>
                <div className="space-y-3">
                  {(['standard', 'express', 'pickup'] as ShippingMethod[]).map((method) => {
                    const quote = calculateShipping({ subtotal: totalPrice, country: form.country, state: form.state, method })
                    return (
                      <label key={method} className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 p-3 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          className="mt-1"
                          checked={shippingMethod === method}
                          onChange={() => setShippingMethod(method)}
                        />
                        <span className="text-sm">
                          <span className="font-semibold text-stone-900">{SHIPPING_METHOD_LABEL[method]}</span>
                          <span className="text-stone-500"> — {quote.fee === 0 ? 'Free' : `$${quote.fee.toFixed(2)}`} ({quote.zone})</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </form>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between gap-2 border-b border-stone-100 pb-3">
                    <span className="line-clamp-2 text-stone-700">{product.name} × {quantity}</span>
                    <span className="shrink-0 font-medium">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping</span>
                  <span>{shipping.fee === 0 ? 'Free' : `$${shipping.fee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-stone-100 pt-6">
                <h3 className="font-semibold">Payment</h3>
                <p className="muted mt-1">
                  Test: <code className="rounded bg-stone-100 px-1">4242 4242 4242 4242</code>
                </p>

                {!clientSecret && (
                  <button
                    type="button"
                    className="mt-4 w-full rounded-lg bg-accent-600 px-4 py-3 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
                    onClick={() => void preparePayment()}
                    disabled={loading}
                  >
                    {loading ? 'Preparing…' : 'Continue to payment'}
                  </button>
                )}

                {clientSecret && returnUrl && (
                  <div className="mt-4">
                    <CheckoutStripePayment
                      clientSecret={clientSecret}
                      returnUrl={returnUrl}
                      totalLabel={`$${grandTotal.toFixed(2)}`}
                    />
                  </div>
                )}

                {error && <p className="error mt-3">{error}</p>}
              </div>

              <p className="mt-4 text-center text-sm">
                <Link href="/cart">← Back to cart</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
