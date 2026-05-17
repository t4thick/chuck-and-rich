'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'Sample', 'Beverages', 'Bread', 'Canned', 'Caribbean product', 'Cosmetics',
  'Dairy And Tea', 'Flours & Rice', 'Fresh Produce', 'Frozen foods',
  'Meat and Seafood', 'Motherland', 'Non food', 'Snack', 'Spices',
]

type FormData = {
  name: string
  description: string
  price: string
  category: string
  image_url: string
  in_stock: boolean
}

type Props = {
  initialData?: Partial<FormData>
  productId?: string
}

export function ProductForm({ initialData, productId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? '',
    category: initialData?.category ?? 'Sample',
    image_url: initialData?.image_url ?? '',
    in_stock: initialData?.in_stock ?? true,
  })
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm((prev) => ({ ...prev, image_url: data.url }))
      } else {
        setError(data.error || 'Upload failed.')
      }
    } catch {
      setError('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = { ...form, price: parseFloat(form.price) }
    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = productId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <p>
        <label>Name <em>*</em>:<br />
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%' }} />
        </label>
      </p>
      <p>
        <label>Description:<br />
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: '100%' }} />
        </label>
      </p>
      <div className="row">
        <label>Price (USD) <em>*</em>:{' '}
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required style={{ width: '8em' }} />
        </label>
        <label>Category:{' '}
          <select name="category" value={form.category} onChange={handleChange} required>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <p>
        <label>Image:<br />
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          {uploading && <em> uploading…</em>}
        </label>
        {form.image_url && <><br /><small>URL: {form.image_url}</small></>}
      </p>
      <p>
        <label>
          <input type="checkbox" name="in_stock" checked={form.in_stock} onChange={handleChange} />{' '}
          In stock — visible to customers
        </label>
      </p>
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="submit" disabled={loading || uploading}>
          {loading ? 'Saving…' : productId ? 'Update product' : 'Add product'}
        </button>
        <button type="button" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  )
}
