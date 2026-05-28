'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Lock, Truck } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { PageHeader } from '@/components/store/PageHeader'
import { AddressAutocomplete } from '@/components/store/AddressAutocomplete'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckoutStripePayment } from './CheckoutStripePayment'
import {
  calculateShipping,
  SHIPPING_METHOD_LABEL,
  type ShippingMethod,
} from '@/lib/shipping'
import { calculateSalesTax } from '@/lib/tax/sales-tax'
import { getAuthSiteOrigin } from '@/lib/site-url-client'
import { cn } from '@/lib/utils'

type CheckoutAccount = {
  email: string
  fullName: string
  phone: string
}

export type SavedAddress = {
  id: string
  label: string | null
  full_name: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string | null
  country: string
  postal_code: string | null
  is_default: boolean
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

const CHECKOUT_DRAFT_KEY = 'lq_checkout_draft_v1'

function loadDraft(): Partial<CheckoutForm> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<CheckoutForm>
  } catch {
    return null
  }
}

function saveDraft(form: CheckoutForm) {
  if (typeof window === 'undefined') return
  try {
    const { email: _email, ...rest } = form
    void _email
    localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(rest))
  } catch {
    /* quota or disabled storage */
  }
}

function CheckoutStep({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="premium-card p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white">
          {step}
        </span>
        <h2 className="text-base font-semibold text-earth-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function addressToForm(
  account: CheckoutAccount,
  addr: SavedAddress
): CheckoutForm {
  return {
    name: addr.full_name || account.fullName,
    email: account.email,
    phone: (addr.phone || account.phone || '').trim(),
    address1: addr.line1,
    address2: addr.line2 ?? '',
    city: addr.city,
    state: addr.state ?? '',
    country: addr.country || 'United States',
    postalCode: addr.postal_code ?? '',
  }
}

export function CheckoutClient({
  initialAccount,
  savedAddresses = [],
}: {
  initialAccount: CheckoutAccount
  savedAddresses?: SavedAddress[]
}) {
  const { items, totalPrice, totalItems } = useCart()
  const router = useRouter()
  const detailsFormRef = useRef<HTMLFormElement>(null)

  const defaultAddress = useMemo(
    () => savedAddresses.find((a) => a.is_default) ?? savedAddresses[0] ?? null,
    [savedAddresses]
  )

  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>(
    defaultAddress?.id ?? 'new'
  )

  const [form, setForm] = useState<CheckoutForm>(() => {
    if (defaultAddress) return addressToForm(initialAccount, defaultAddress)
    return {
      name: initialAccount.fullName,
      email: initialAccount.email,
      phone: initialAccount.phone,
      address1: '',
      address2: '',
      city: '',
      state: 'OH',
      country: 'United States',
      postalCode: '',
    }
  })

  // Restore unsaved draft from previous session (only if no default address pre-filled).
  useEffect(() => {
    if (defaultAddress) return
    const draft = loadDraft()
    if (!draft) return
    setForm((prev) => ({
      ...prev,
      name: draft.name || prev.name,
      phone: draft.phone || prev.phone,
      address1: draft.address1 ?? prev.address1,
      address2: draft.address2 ?? prev.address2,
      city: draft.city ?? prev.city,
      state: draft.state ?? prev.state,
      country: draft.country ?? prev.country,
      postalCode: draft.postalCode ?? prev.postalCode,
    }))
  }, [defaultAddress])

  // Persist form to localStorage on every change so phone/address survive a page reload or login flow.
  useEffect(() => {
    saveDraft(form)
  }, [form])

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [returnUrl, setReturnUrl] = useState('')
  const [categoryByProductId, setCategoryByProductId] = useState<Record<string, string>>({})

  useEffect(() => {
    setReturnUrl(`${getAuthSiteOrigin()}/checkout/success`)
  }, [])

  useEffect(() => {
    const productIds = items.map((i) => i.product.id)
    if (productIds.length === 0) {
      setCategoryByProductId({})
      return
    }
    const ctrl = new AbortController()
    fetch('/api/checkout/cart-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { categories?: Record<string, string> }) => {
        setCategoryByProductId(data.categories ?? {})
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [cartFingerprint])

  function pickSavedAddress(id: string) {
    setSelectedAddressId(id)
    if (id === 'new') {
      setForm((prev) => ({
        ...prev,
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
      }))
      return
    }
    const addr = savedAddresses.find((a) => a.id === id)
    if (addr) setForm(addressToForm(initialAccount, addr))
  }

  const cartFingerprint = useMemo(
    () => items.map((i) => `${i.product.id}:${i.quantity}`).join('|'),
    [items]
  )

  const checkoutFingerprint = useMemo(
    () =>
      [
        cartFingerprint,
        form.country,
        form.state,
        shippingMethod,
      ].join('|'),
    [cartFingerprint, form.country, form.state, shippingMethod]
  )

  useEffect(() => {
    setClientSecret(null)
  }, [checkoutFingerprint, totalPrice])

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
  const taxQuote = useMemo(
    () =>
      calculateSalesTax(
        items.map(({ product, quantity }) => ({
          category: categoryByProductId[product.id] ?? product.category ?? '',
          lineSubtotal: product.price * quantity,
        })),
        {
          country: form.country,
          state: form.state,
          shippingMethod,
        }
      ),
    [items, categoryByProductId, form.country, form.state, shippingMethod]
  )

  const grandTotal = totalPrice + shipping.fee + taxQuote.taxAmount

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
      <div className="min-h-screen bg-cream">
        <PageHeader eyebrow="Checkout" title="Your cart is empty" subtitle="Add groceries before checking out." />
        <div className="store-container py-12 text-center">
          <Link href="/shop" className="no-underline">
            <Button size="lg" className="rounded-xl">
              Browse shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream md:pb-12">
      <PageHeader
        eyebrow="Secure checkout"
        title="Complete your order"
        subtitle={`Signed in as ${initialAccount.email} · ${totalItems} item${totalItems === 1 ? '' : 's'}`}
      />

      <div className="store-container py-8 sm:py-10">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-earth-600 no-underline hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <form
            ref={detailsFormRef}
            onSubmit={(e) => e.preventDefault()}
            autoComplete="shipping"
            className="space-y-6 lg:col-span-3"
          >
            <CheckoutStep step={1} title="Contact details">
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-email" className="form-label">
                    Email
                  </label>
                  <Input
                    id="checkout-email"
                    type="email"
                    name="email"
                    className="bg-sand"
                    value={form.email}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="checkout-name" className="form-label">
                    Full name
                  </label>
                  <Input
                    id="checkout-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="form-label">
                    Phone
                  </label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>
            </CheckoutStep>

            <CheckoutStep step={2} title="Delivery address">
              {savedAddresses.length > 0 && (
                <div className="mb-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-earth-500">
                    Saved addresses
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {savedAddresses.map((a) => {
                      const active = selectedAddressId === a.id
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => pickSavedAddress(a.id)}
                          className={cn(
                            'group flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors',
                            active
                              ? 'border-brand-500 bg-brand-50/40'
                              : 'border-earth-200 bg-white hover:border-earth-300'
                          )}
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="font-semibold text-earth-900">
                              {a.label || 'Address'}
                              {a.is_default ? (
                                <span className="ml-2 text-xs font-medium text-earth-500">Default</span>
                              ) : null}
                            </span>
                            {active ? (
                              <Check className="h-4 w-4 shrink-0 text-brand-700" strokeWidth={2.5} aria-hidden />
                            ) : null}
                          </div>
                          <span className="line-clamp-2 text-xs leading-snug text-earth-600">
                            {a.line1}
                            {a.line2 ? `, ${a.line2}` : ''} · {a.city}, {a.state ?? ''}{' '}
                            {a.postal_code ?? ''}
                          </span>
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={() => pickSavedAddress('new')}
                      className={cn(
                        'flex flex-col items-start gap-1 rounded-lg border border-dashed p-3 text-left text-sm transition-colors',
                        selectedAddressId === 'new'
                          ? 'border-brand-500 bg-brand-50/40 text-brand-800'
                          : 'border-earth-300 bg-white text-earth-700 hover:border-earth-400'
                      )}
                    >
                      <span className="font-semibold">+ Use a new address</span>
                      <span className="text-xs text-earth-500">
                        We&apos;ll save it for next time.
                      </span>
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-address1" className="form-label">
                    Street address
                  </label>
                  <AddressAutocomplete
                    id="checkout-address1"
                    name="shipping-address-line1"
                    value={form.address1}
                    onChange={(v) => {
                      setSelectedAddressId('new')
                      setForm((prev) => ({ ...prev, address1: v }))
                    }}
                    onSelect={(parsed) => {
                      setSelectedAddressId('new')
                      setForm((prev) => ({
                        ...prev,
                        address1: parsed.line1 || prev.address1,
                        city: parsed.city || prev.city,
                        state: parsed.state || prev.state,
                        country: parsed.country || prev.country,
                        postalCode: parsed.postalCode || prev.postalCode,
                      }))
                    }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="checkout-address2" className="form-label">
                    Apt / suite <span className="font-normal text-earth-400">(optional)</span>
                  </label>
                  <Input
                    id="checkout-address2"
                    type="text"
                    name="address2"
                    value={form.address2}
                    onChange={handleChange}
                    autoComplete="shipping address-line2"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="checkout-city" className="form-label">
                      City
                    </label>
                    <Input
                      id="checkout-city"
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      autoComplete="shipping address-level2"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-state" className="form-label">
                      State
                    </label>
                    <Input
                      id="checkout-state"
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      autoComplete="shipping address-level1"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="checkout-country" className="form-label">
                      Country
                    </label>
                    <select
                      id="checkout-country"
                      name="country"
                      className="form-select"
                      value={form.country}
                      onChange={handleChange}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="checkout-zip" className="form-label">
                      ZIP code
                    </label>
                    <Input
                      id="checkout-zip"
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      required
                      autoComplete="shipping postal-code"
                    />
                  </div>
                </div>
              </div>
            </CheckoutStep>

            <CheckoutStep step={3} title="Shipping method">
              <div className="space-y-3">
                {(['standard', 'express', 'pickup'] as ShippingMethod[]).map((method) => {
                  const quote = calculateShipping({
                    subtotal: totalPrice,
                    country: form.country,
                    state: form.state,
                    method,
                  })
                  const selected = shippingMethod === method
                  return (
                    <label
                      key={method}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition',
                        selected
                          ? 'border-brand-400 bg-brand-50/50'
                          : 'border-earth-200 bg-white hover:border-earth-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        className="mt-1"
                        checked={selected}
                        onChange={() => setShippingMethod(method)}
                      />
                      <span className="text-sm">
                        <span className="font-semibold text-earth-950">
                          {SHIPPING_METHOD_LABEL[method]}
                        </span>
                        <span className="block text-earth-600">
                          {quote.fee === 0 ? 'Free' : `$${quote.fee.toFixed(2)}`} · {quote.zone}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </CheckoutStep>
          </form>

          <div className="lg:col-span-2">
            <div className="premium-card sticky top-24 p-6">
              <h2 className="text-base font-semibold text-earth-900">Order summary</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {items.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex justify-between gap-3 border-b border-earth-100 pb-3 last:border-0"
                  >
                    <span className="line-clamp-2 text-earth-700">
                      {product.name} × {quantity}
                    </span>
                    <span className="shrink-0 font-semibold text-earth-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-earth-100 pt-4 text-sm">
                <div className="flex justify-between text-earth-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-earth-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-earth-600">
                  <span>Shipping</span>
                  <span className="font-medium text-earth-900">
                    {shipping.fee === 0 ? 'Free' : `$${shipping.fee.toFixed(2)}`}
                  </span>
                </div>
                {taxQuote.applies ? (
                  <div className="flex justify-between text-earth-600">
                    <span className="max-w-[14rem] text-xs sm:text-sm">
                      Sales tax
                      <span className="block text-earth-400">{taxQuote.jurisdictionLabel}</span>
                      {taxQuote.taxAmount === 0 && taxQuote.taxableSubtotal === 0 ? (
                        <span className="block text-earth-400">Grocery — exempt</span>
                      ) : null}
                    </span>
                    <span className="font-medium text-earth-900">
                      ${taxQuote.taxAmount.toFixed(2)}
                    </span>
                  </div>
                ) : taxQuote.taxableSubtotal > 0 ? (
                  <p className="text-xs text-earth-500">
                    Sales tax applies for Ohio delivery and store pickup.
                  </p>
                ) : null}
                <div className="flex justify-between border-t border-earth-100 pt-3 text-lg font-bold text-earth-950">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-earth-100 pt-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-earth-800">
                  <Lock className="h-4 w-4 text-brand-600" aria-hidden />
                  Payment
                </div>
                <p className="mt-1 text-xs text-earth-500">
                  Secure payment powered by Stripe
                </p>

                {!clientSecret && (
                  <Button
                    type="button"
                    size="lg"
                    className="mt-4 h-12 w-full rounded-xl"
                    onClick={() => void preparePayment()}
                    disabled={loading}
                  >
                    {loading ? 'Preparing…' : 'Continue to payment'}
                  </Button>
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

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-earth-500">
                <Truck className="h-3.5 w-3.5" aria-hidden />
                Pickup available at our Columbus store
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
