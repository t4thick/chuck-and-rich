'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(true)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button type="button" onClick={handleDelete} disabled={loading}>
      {loading ? '…' : 'Delete'}
    </button>
  )
}
