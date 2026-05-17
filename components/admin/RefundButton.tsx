'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RefundButton({ orderId, maxAmount }: { orderId: string; maxAmount: number }) {
  const router = useRouter()
  const [amount, setAmount] = useState(maxAmount.toFixed(2))
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function refund(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm(`Refund $${amount} for order ${orderId}? This cannot be undone.`)) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), reason }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Refund failed.')
        return
      }
      setDone(true)
      router.refresh()
    } catch {
      setError('Network error.')
    } finally {
      setBusy(false)
    }
  }

  if (done) return <p className="success">Refund issued.</p>

  return (
    <form onSubmit={refund} className="stack">
      <p>
        <label>
          Amount ($):{' '}
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={maxAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '8em' }}
          />
        </label>{' '}
        of ${maxAmount.toFixed(2)} max
      </p>
      <p>
        <label>
          Reason (optional):{' '}
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: '20em' }} />
        </label>
      </p>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Refunding…' : 'Issue refund via Stripe'}</button>
    </form>
  )
}
