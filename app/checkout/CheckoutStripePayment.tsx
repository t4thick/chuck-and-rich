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
      confirmParams: {
        return_url: returnUrl,
      },
    })
    if (stripeError) {
      setError(stripeError.message ?? 'Payment could not be completed.')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="w-full font-bold py-4 rounded-xl text-base bg-[#c8811a] hover:bg-[#b5731a] text-white shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? 'Processing…' : `Pay ${totalLabel}`}
      </button>
    </form>
  )
}

export function CheckoutStripePayment({ clientSecret, returnUrl, totalLabel }: Props) {
  const stripePromise = useMemo(() => getStripeBrowser(), [])

  if (!stripePromise) {
    return (
      <p className="text-sm text-red-600">
        Missing <code className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> — add your Stripe publishable
        key (pk_test_…) to environment variables and redeploy.
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1a4731',
            borderRadius: '12px',
          },
        },
      }}
    >
      <PayForm returnUrl={returnUrl} totalLabel={totalLabel} />
    </Elements>
  )
}
