'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { getStripeBrowser, isUsingStripeDemoKey } from '@/lib/stripe-browser'

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
      setError('Checkout is still loading. Please wait a moment and try again.')
      return
    }

    setBusy(true)
    setError('')

    // Required by Stripe Payment Element before confirmPayment
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

    const timeoutMs = 120_000
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
        ? 'Payment is taking too long. If you were charged, check your email or Account → orders. Otherwise try again.'
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

    // Succeeded without redirect (common for test cards with no 3DS)
    const piId = paymentIntentIdFromClientSecret(clientSecret)
    if (piId) {
      router.push(`/checkout/success?payment_intent=${encodeURIComponent(piId)}`)
      return
    }

    router.push('/checkout/success')
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      {isUsingStripeDemoKey() && (
        <p className="muted">
          Demo Stripe key in use. For live payments, set matching{' '}
          <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and <code>STRIPE_SECRET_KEY</code> on Vercel.
        </p>
      )}
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

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PayForm clientSecret={clientSecret} returnUrl={returnUrl} totalLabel={totalLabel} />
    </Elements>
  )
}
