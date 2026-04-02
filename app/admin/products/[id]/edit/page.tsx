import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Product</h1>
        <p className="text-gray-400 text-sm mt-1 truncate max-w-xl">{product.name}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <ProductForm
          productId={product.id}
          initialData={{
            name:        product.name,
            description: product.description ?? '',
            price:       String(product.price),
            category:    product.category,
            image_url:   product.image_url ?? '',
            in_stock:    product.in_stock,
          }}
        />
      </div>
    </div>
  )
}
