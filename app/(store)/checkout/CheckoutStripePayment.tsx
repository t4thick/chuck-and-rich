'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { getStripeBrowser, isStripePublishableKeyConfigured } from '@/lib/stripe-browser'

type Props = {
  clientSecret: string
  returnUrl: string
  totalLabel: string
}

function paymentIntentIdFromClientSecret(clientSecret: string): string | null {
  const idx = clientSecret.indexOf('_secret_')
  if (idx <= 0) return null
  return clientSecret.slice(0, idx)
}

function PayForm({ clientSecret, returnUrl, totalLabel }: Props) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const returnUrlReady = returnUrl.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) {
      setError('Payment form is still loading. Wait a few seconds and try again.')
      return
    }
    if (!returnUrlReady) {
      setError('Checkout is still loading. Please wait and try again.')
      return
    }

    setBusy(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Please check your card details.')
      setBusy(false)
      return
    }

    const confirmPromise = stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })

    const timeoutMs = 90_000
    let stripeError: { message?: string } | undefined

    try {
      const result = await Promise.race([
        confirmPromise,
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('timeout')), timeoutMs)
        }),
      ])
      stripeError = result.error
    } catch (err) {
      const msg = err instanceof Error && err.message === 'timeout'
        ? 'Payment is taking too long. If your card was charged, check your email or Account → orders. Otherwise try again.'
        : 'Payment could not be completed. Please try again.'
      setError(msg)
      setBusy(false)
      return
    }

    if (stripeError) {
      setError(stripeError.message ?? 'Payment could not be completed.')
      setBusy(false)
      return
    }

    const piId = paymentIntentIdFromClientSecret(clientSecret)
    if (piId) {
      router.push(`/checkout/success?payment_intent=${encodeURIComponent(piId)}`)
      return
    }
    router.push('/checkout/success')
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <PaymentElement />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={!stripe || !elements || busy || !returnUrlReady}>
        {!returnUrlReady ? 'Loading payment…' : busy ? 'Processing…' : `Pay ${totalLabel}`}
      </button>
    </form>
  )
}

export function CheckoutStripePayment({ clientSecret, returnUrl, totalLabel }: Props) {
  const stripePromise = useMemo(() => getStripeBrowser(), [])

  if (!isStripePublishableKeyConfigured()) {
    return (
      <div className="stack">
        <p className="error">
          Payments are not configured: <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> is missing.
        </p>
        <p className="muted">
          Set it in <code>.env.local</code> (and Vercel → Project Settings → Environment Variables)
          using the publishable key from the same Stripe account as your <code>STRIPE_SECRET_KEY</code>.
          Get it at <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer">dashboard.stripe.com/test/apikeys</a>.
        </p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PayForm clientSecret={clientSecret} returnUrl={returnUrl} totalLabel={totalLabel} />
    </Elements>
  )
}
