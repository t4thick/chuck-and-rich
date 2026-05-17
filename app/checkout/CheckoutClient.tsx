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
      <div className="stack">
        <h2>Checkout</h2>
        <p>Your cart is empty. <Link href="/shop">Back to shop</Link></p>
      </div>
    )
  }

  return (
    <div className="stack">
      <h2>Checkout</h2>
      <p className="muted">
        Signed in as {initialAccount.email} · {totalItems} item{totalItems === 1 ? '' : 's'}
      </p>

      <form ref={detailsFormRef} onSubmit={(e) => e.preventDefault()} className="stack">
        <fieldset>
          <legend>1. Account</legend>
          <p>
            <label>Email: <input type="email" name="email" value={form.email} readOnly /></label>
          </p>
          <p>
            <label>Full name: <input type="text" name="name" value={form.name} onChange={handleChange} required autoComplete="name" /></label>
          </p>
          <p>
            <label>Phone: <input type="tel" name="phone" value={form.phone} onChange={handleChange} required autoComplete="tel" /></label>
          </p>
        </fieldset>

        <fieldset>
          <legend>2. Delivery address</legend>
          <p>
            <label>Street: <input type="text" name="address1" value={form.address1} onChange={handleChange} required autoComplete="address-line1" /></label>
          </p>
          <p>
            <label>Apt/Suite: <input type="text" name="address2" value={form.address2} onChange={handleChange} autoComplete="address-line2" /></label>
          </p>
          <p>
            <label>City: <input type="text" name="city" value={form.city} onChange={handleChange} required autoComplete="address-level2" /></label>
          </p>
          <p>
            <label>State: <input type="text" name="state" value={form.state} onChange={handleChange} required autoComplete="address-level1" /></label>
          </p>
          <p>
            <label>
              Country:{' '}
              <select name="country" value={form.country} onChange={handleChange}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </p>
          <p>
            <label>ZIP: <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required autoComplete="postal-code" /></label>
          </p>
        </fieldset>

        <fieldset>
          <legend>3. Shipping method</legend>
          {(['standard', 'express', 'pickup'] as ShippingMethod[]).map((method) => {
            const quote = calculateShipping({ subtotal: totalPrice, country: form.country, state: form.state, method })
            return (
              <p key={method}>
                <label>
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === method}
                    onChange={() => setShippingMethod(method)}
                  />{' '}
                  {SHIPPING_METHOD_LABEL[method]} — {quote.fee === 0 ? 'Free' : `$${quote.fee.toFixed(2)}`} ({quote.zone})
                </label>
              </p>
            )
          })}
        </fieldset>
      </form>

      <hr />

      <h3>Order summary</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value || '1', 10)))}
                  style={{ width: '4em' }}
                />
              </td>
              <td>${(product.price * quantity).toFixed(2)}</td>
              <td>
                <button type="button" onClick={() => removeItem(product.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Subtotal</td>
            <td colSpan={4}>${totalPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Shipping ({SHIPPING_METHOD_LABEL[shippingMethod]})</td>
            <td colSpan={4}>{shipping.fee === 0 ? 'Free' : `$${shipping.fee.toFixed(2)}`}</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td colSpan={4}><strong>${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <hr />

      <h3>4. Payment</h3>
      <p className="muted">
        Test card: <code>4242 4242 4242 4242</code> · any future expiry · any CVC.
      </p>

      {!clientSecret && (
        <button type="button" onClick={() => void preparePayment()} disabled={loading}>
          {loading ? 'Preparing…' : 'Continue to payment'}
        </button>
      )}

      {clientSecret && returnUrl && (
        <CheckoutStripePayment
          clientSecret={clientSecret}
          returnUrl={returnUrl}
          totalLabel={`$${grandTotal.toFixed(2)}`}
        />
      )}

      {error && <p className="error">{error}</p>}

      <p><Link href="/cart">← Back to cart</Link></p>
    </div>
  )
}
