import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div className="stack">
      <h2>Add new product</h2>
      <ProductForm />
      <p><Link href="/admin/products">← Back to products</Link></p>
    </div>
  )
}
