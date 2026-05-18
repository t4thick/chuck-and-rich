import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'
import { requireAdminPage } from '@/lib/auth/require-admin-page'

export default async function NewProductPage() {
  await requireAdminPage()
  return (
    <div className="stack">
      <h2>Add new product</h2>
      <ProductForm />
      <p><Link href="/admin/products">← Back to products</Link></p>
    </div>
  )
}
