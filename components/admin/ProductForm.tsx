'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Fabrics', 'Beauty', 'Food', 'Spices', 'Accessories']

type FormData = {
  name: string; description: string; price: string
  category: string; image_url: string; in_stock: boolean
}

type Props = {
  initialData?: Partial<FormData>
  productId?: string
}

export function ProductForm({ initialData, productId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name:        initialData?.name        ?? '',
    description: initialData?.description ?? '',
    price:       initialData?.price       ?? '',
    category:    initialData?.category    ?? 'Fabrics',
    image_url:   initialData?.image_url   ?? '',
    in_stock:    initialData?.in_stock    ?? true,
  })
  const [uploading, setUploading] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
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
        setForm(prev => ({ ...prev, image_url: data.url }))
      } else {
        setError(data.error || 'Upload failed. Make sure the product-images bucket exists in Supabase Storage.')
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
    const url    = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
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

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
        <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="e.g. Ankara Print Fabric" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
          className={`${inputClass} resize-none`} placeholder="Describe the product…" />
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (USD) <span className="text-red-500">*</span></label>
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className={inputClass} placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
          <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Image</label>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-700 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-green-800" />
            {uploading && <p className="text-xs text-green-600 mt-1">Uploading…</p>}
            {form.image_url && <p className="text-xs text-gray-400 mt-1 truncate">{form.image_url}</p>}
          </div>
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Requires a <strong>product-images</strong> bucket in Supabase Storage (set to public).</p>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
        <input type="checkbox" name="in_stock" id="in_stock" checked={form.in_stock} onChange={handleChange}
          className="w-4 h-4 accent-green-700" />
        <label htmlFor="in_stock" className="text-sm font-semibold text-gray-700 cursor-pointer">
          In Stock — visible and purchasable by customers
        </label>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading || uploading}
          className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
          {loading ? 'Saving…' : productId ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
