'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'

export function CheckoutSuccessClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const sessionId = searchParams.get('session_id')
  const paymentIntentId = searchParams.get('payment_intent')

  const [message, setMessage] = useState('Confirming your payment…')
  const [error, setError] = useState('')

  const finalize = useCallback(async () => {
    const idParam = paymentIntentId || sessionId
    if (!idParam) {
      setError('Missing payment confirmation.')
      return
    }

    const started = Date.now()
    const qs = paymentIntentId
      ? `payment_intent=${encodeURIComponent(paymentIntentId)}`
      : `session_id=${encodeURIComponent(sessionId!)}`

    const poll = async () => {
      const res = await fetch(`/api/checkout/status?${qs}`)
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not verify payment.')
        return
      }

      if (data.status === 'complete' && data.orderId) {
        clearCart()
        router.replace(`/order-confirmation?id=${encodeURIComponent(data.orderId)}`)
        return
      }

      if (data.status === 'unpaid') {
        setError('Payment was not completed.')
        return
      }

      if (Date.now() - started > 60_000) {
        setMessage('Payment received. Check your email or account orders.')
        return
      }

      setMessage(data.message || 'Finalizing your order…')
      window.setTimeout(poll, 1200)
    }

    await poll()
  }, [sessionId, paymentIntentId, clearCart, router])

  useEffect(() => {
    const t = window.setTimeout(() => { void finalize() }, 0)
    return () => window.clearTimeout(t)
  }, [finalize])

  return (
    <div className="stack">
      <h2>Payment</h2>
      {error ? <p className="error">{error}</p> : <p>{message}</p>}
      <p>
        <Link href="/account">Account &amp; orders</Link> · <Link href="/shop">Continue shopping</Link>
      </p>
    </div>
  )
}
