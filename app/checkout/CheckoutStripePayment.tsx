'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useMemo, useState } from 'react'
import { getStripeBrowser } from '@/lib/stripe-browser'

type Props = {
  clientSecret: string
  returnUrl: string
  totalLabel: string
}

function PayForm({ returnUrl, totalLabel }: { returnUrl: string; totalLabel: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setBusy(true)
    setError('')
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    })
    if (stripeError) {
      setError(stripeError.message ?? 'Payment could not be completed.')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <PaymentElement />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={!stripe || busy}>
        {busy ? 'Processing…' : `Pay ${totalLabel}`}
      </button>
    </form>
  )
}

export function CheckoutStripePayment({ clientSecret, returnUrl, totalLabel }: Props) {
  const stripePromise = useMemo(() => getStripeBrowser(), [])

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PayForm returnUrl={returnUrl} totalLabel={totalLabel} />
    </Elements>
  )
}
