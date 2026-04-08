'use client'

import Link from 'next/link'
import { useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import {
  calculateShipping,
  SHIPPING_METHOD_LABEL,
  type ShippingMethod,
} from '@/lib/shipping'

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

type FieldProps = {
  label: string
  name: keyof CheckoutForm
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  required?: boolean
  placeholder?: string
  type?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  readOnly?: boolean
  list?: string
}

const COUNTRY_OPTIONS = ['United States', 'Canada', 'United Kingdom', 'Mexico']

const STATE_OPTIONS = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
  type = 'text',
  autoComplete,
  inputMode,
  readOnly = false,
  list,
}: FieldProps) {
  const reactId = useId()
  const inputId = `checkout-${name}-${reactId.replace(/:/g, '')}`

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        readOnly={readOnly}
        list={list}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white ${
          readOnly ? 'bg-gray-50 text-gray-500' : ''
        }`}
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: keyof CheckoutForm
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  options: string[]
}) {
  const reactId = useId()
  const inputId = `checkout-${name}-${reactId.replace(/:/g, '')}`

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30 bg-white text-gray-800"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[#1a4731] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
      {children}
    </span>
  )
}

export function CheckoutClient({ initialAccount }: { initialAccount: CheckoutAccount }) {
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCart()
  const router = useRouter()

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/session', {
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
        setError(typeof data.error === 'string' ? data.error : 'Could not start checkout. Please try again.')
        return
      }

      if (typeof data.url === 'string' && data.url) {
        window.location.href = data.url
        return
      }

      setError('No payment link returned. Please try again.')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="page-shell flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Nothing to checkout</h1>
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link
            href="/shop"
            className="bg-[#1a4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#236641] transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <datalist id="checkout-state-options">
        {STATE_OPTIONS.map((state) => (
          <option key={state} value={state} />
        ))}
      </datalist>

      <div className="page-container max-w-6xl mb-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Secure checkout</p>
        <h1 className="section-title">Checkout</h1>
        <p className="section-subtitle mt-1">
          Signed in as {initialAccount.email} · {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="page-container max-w-6xl grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <div className="space-y-6">
            <section className="panel p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <StepBadge>1</StepBadge>
                Account Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly
                    autoComplete="email"
                  />
                </div>
                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Adaeze Okafor"
                  autoComplete="name"
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="(614) 555-0123"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Orders are tied to your signed-in account for privacy and order history access.
              </p>
            </section>

            <section className="panel p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <StepBadge>2</StepBadge>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field
                    label="Street Address"
                    name="address1"
                    value={form.address1}
                    onChange={handleChange}
                    required
                    placeholder="Street address"
                    autoComplete="address-line1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Apartment, Suite, etc. (optional)"
                    name="address2"
                    value={form.address2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, building, floor"
                    autoComplete="address-line2"
                  />
                </div>
                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Columbus"
                  autoComplete="address-level2"
                />
                <Field
                  label="State / Province"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  placeholder="Ohio"
                  autoComplete="address-level1"
                  list="checkout-state-options"
                />
                <SelectField
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  options={COUNTRY_OPTIONS}
                />
                <Field
                  label="ZIP / Postal Code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="43229"
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Tip: browser autofill works with your saved addresses on most phones and laptops.
              </p>
            </section>

            <section className="panel p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <StepBadge>3</StepBadge>
                Shipping Method
              </h2>
              <div className="space-y-3">
                {(['standard', 'express', 'pickup'] as ShippingMethod[]).map((method) => {
                  const quote = calculateShipping({
                    subtotal: totalPrice,
                    country: form.country,
                    state: form.state,
                    method,
                  })

                  return (
                    <label
                      key={method}
                      className={`flex gap-3 items-start cursor-pointer rounded-xl border-2 p-4 ${
                        shippingMethod === method
                          ? 'border-[#236641] bg-emerald-50/40'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === method}
                        onChange={() => setShippingMethod(method)}
                        className="mt-1 accent-[#1a4731]"
                      />
                      <span className="flex-1">
                        <span className="font-semibold text-gray-900">{SHIPPING_METHOD_LABEL[method]}</span>
                        <span className="block text-sm text-gray-600 mt-1 capitalize">
                          Zone: {quote.zone} · {quote.fee === 0 ? 'Free' : `$${quote.fee.toFixed(2)}`}
                        </span>
                        {method === 'pickup' && (
                          <span className="block text-xs text-gray-500 mt-2">
                            Karl Plaza · 1668 E Dublin Granville Rd, Columbus, OH 43229
                          </span>
                        )}
                      </span>
                    </label>
                  )
                })}
                <p className="text-xs text-gray-500">
                  Standard shipping over $150 is free inside the United States. Pickup orders are collected from our
                  Columbus store location.
                </p>
              </div>
            </section>

            <section className="panel p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <StepBadge>4</StepBadge>
                Payment
              </h2>
              <div className="rounded-xl border-2 border-[#236641] bg-emerald-50/40 p-4">
                <p className="font-semibold text-gray-900">Pay securely with Stripe</p>
                <p className="text-sm text-gray-600 mt-1">
                  You&apos;ll be redirected to Stripe Checkout to pay by card. Orders are only placed after your payment
                  succeeds — we never store your card details on our servers.
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  <strong className="text-gray-700">Test mode:</strong> use card{' '}
                  <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, any CVC, and any postal
                  code.
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-950">
                <p className="font-semibold text-amber-900">Lovely Queen African Market</p>
                <p className="mt-1">Located in Karl Plaza</p>
                <p>1668 E Dublin Granville Rd, Columbus, OH 43229</p>
                <p>(614) 446-0893</p>
              </div>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="panel p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <StepBadge>5</StepBadge>
                Review Order
              </h2>

              <div className="space-y-3 pb-4 mb-4 border-b border-gray-100">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-semibold">
                          IMG
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-1">${product.price.toFixed(2)} each</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:text-[#1a4731] hover:border-[#1a4731]/30"
                          aria-label={`Decrease quantity for ${product.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:text-[#1a4731] hover:border-[#1a4731]/30"
                          aria-label={`Increase quantity for ${product.name}`}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="ml-auto text-xs font-semibold text-gray-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-700 shrink-0">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {shipping.fee === 0 ? 'Free' : `$${shipping.fee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Shipping method</span>
                  <span>{SHIPPING_METHOD_LABEL[shippingMethod]}</span>
                </div>
                <div className="flex justify-between font-extrabold text-lg text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#1a4731]">${grandTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  Payment: <span className="font-semibold text-gray-700">Card via Stripe Checkout</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-4 rounded-xl text-base transition-all ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#c8811a] hover:bg-[#b5731a] text-white shadow-lg shadow-amber-900/20 active:scale-95'
                }`}
              >
                {loading ? 'Redirecting…' : 'Continue to payment'}
              </button>

              <Link
                href="/cart"
                className="block text-center text-sm text-gray-400 hover:text-green-700 transition-colors mt-4"
              >
                Back to Cart
              </Link>
            </div>
          </aside>
        </div>
      </form>
    </main>
  )
}
