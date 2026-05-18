'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import type { Product } from '@/types'

type OrderItem = {
  product_id: string | null
  product_name: string
  product_price: number
  quantity: number
}

export function ReorderClient({ items }: { items: OrderItem[] }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState<{ added: number; missing: string[] } | null>(null)

  async function reorder() {
    setBusy(true)
    setReport(null)
    const added: string[] = []
    const missing: string[] = []

    if (!isSupabaseBrowserConfigured()) {
      setReport({ added: 0, missing: items.map((i) => i.product_name) })
      setBusy(false)
      return
    }

    const supabase = createClient()

    for (const item of items) {
      if (!item.product_id) {
        missing.push(item.product_name)
        continue
      }
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .maybeSingle()
      if (!data) {
        missing.push(item.product_name)
        continue
      }
      addItem(data as Product, item.quantity)
      added.push(item.product_name)
    }
    setReport({ added: added.length, missing })
    setBusy(false)
  }

  return (
    <div className="stack">
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Was</th></tr></thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td>{it.product_name}</td>
              <td>{it.quantity}</td>
              <td>${Number(it.product_price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {report && (
        <p className="success">
          Added {report.added} item{report.added === 1 ? '' : 's'} to cart.
          {report.missing.length > 0 && (
            <> Could not re-add: {report.missing.join(', ')} (no longer available).</>
          )}
        </p>
      )}

      <div className="row">
        <button type="button" onClick={() => void reorder()} disabled={busy}>
          {busy ? 'Adding…' : 'Add all to cart'}
        </button>
        {report && <button type="button" onClick={() => router.push('/cart')}>Go to cart</button>}
        <Link href="/shop">Continue shopping</Link>
      </div>
    </div>
  )
}
