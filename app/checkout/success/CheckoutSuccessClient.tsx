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

  const [message, setMessage] = useState('Confirming your payment…')
  const [error, setError] = useState('')

  const finalize = useCallback(async () => {
    if (!sessionId) {
      setError('Missing payment session. Return to checkout and try again.')
      return
    }

    const started = Date.now()
    const poll = async () => {
      const res = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`)
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
        setMessage(
          'Your payment was received. Your order may take a moment to appear — check your email or account orders.'
        )
        return
      }

      setMessage(data.message || 'Finalizing your order…')
      window.setTimeout(poll, 1200)
    }

    await poll()
  }, [sessionId, clearCart, router])

  useEffect(() => {
    void finalize()
  }, [finalize])

  return (
    <main className="page-shell flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Payment</h1>
        {error ? (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        ) : (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
        <div className="mt-6 flex flex-col gap-2 text-sm">
          <Link href="/account" className="font-semibold text-[#0f3d2e] hover:underline">
            Account &amp; orders
          </Link>
          <Link href="/shop" className="text-gray-500 hover:text-gray-800">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
