'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
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
        update('image_url', data.url)
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
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-5">
      <div className="space-y-1.5">
        <label className="form-label" htmlFor="name">
          Name <span className="text-red-600">*</span>
        </label>
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="form-input"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="price">
            Price (USD) <span className="text-red-600">*</span>
          </label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="form-select"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="form-label">Image</label>
        <div className="flex items-start gap-4">
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-earth-300 bg-earth-50 text-earth-500 transition-colors hover:border-earth-400 hover:bg-earth-100">
            {form.image_url ? (
              <Image
                src={form.image_url}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          <div className="flex-1 text-sm text-earth-600">
            {uploading && <p>Uploading…</p>}
            {!uploading && form.image_url && (
              <>
                <p className="font-medium text-earth-700">Image set.</p>
                <p className="mt-1 break-all font-mono text-[11px] text-earth-400">
                  {form.image_url}
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
                  onClick={() => update('image_url', '')}
                >
                  Remove
                </button>
              </>
            )}
            {!uploading && !form.image_url && (
              <p className="text-earth-500">PNG, JPEG, WebP, or GIF.</p>
            )}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-earth-800">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-earth-300 text-brand-700 focus:ring-brand-500"
          checked={form.in_stock}
          onChange={(e) => update('in_stock', e.target.checked)}
        />
        In stock — visible to customers
      </label>

      {error && <p className="error">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Saving…' : productId ? 'Update product' : 'Add product'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
