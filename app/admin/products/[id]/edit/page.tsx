import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ProductForm } from '@/components/admin/ProductForm'
import { requireAdminPage } from '@/lib/auth/require-admin-page'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminPage()
  const { id } = await params
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="stack">
      <h2>Edit product</h2>
      <p className="muted">{product.name}</p>
      <ProductForm
        productId={product.id}
        initialData={{
          name: product.name,
          description: product.description ?? '',
          price: String(product.price),
          category: product.category,
          image_url: product.image_url ?? '',
          in_stock: product.in_stock,
        }}
      />
      <p><Link href="/admin/products">← Back to products</Link></p>
    </div>
  )
}
