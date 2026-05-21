'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { PageHeader } from '@/components/store/PageHeader'
import { Button } from '@/components/ui/button'

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
    const t = window.setTimeout(() => {
      void finalize()
    }, 0)
    return () => window.clearTimeout(t)
  }, [finalize])

  return (
    <div className="min-h-screen bg-cream">
      <PageHeader eyebrow="Checkout" title="Processing payment" subtitle="Please wait while we confirm your order." centered />

      <div className="store-container py-16">
        <div className="premium-card mx-auto max-w-md px-6 py-12 text-center">
          {!error && <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-600" />}
          {error ? (
            <p className="error">{error}</p>
          ) : (
            <p className="text-earth-700">{message}</p>
          )}
          <div className="mt-8 flex flex-col gap-2">
            <Link href="/account" className="no-underline">
              <Button variant="outline" className="w-full rounded-xl">
                Account & orders
              </Button>
            </Link>
            <Link href="/shop" className="no-underline">
              <Button variant="ghost" className="w-full">
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
