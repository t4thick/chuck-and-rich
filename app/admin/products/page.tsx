import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { requireAdminPage } from '@/lib/auth/require-admin-page'

export default async function AdminProductsPage() {
  await requireAdminPage()
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>Products ({products?.length ?? 0})</h2>
        <Link href="/admin/products/new"><strong>+ Add product</strong></Link>
      </div>

      {!products || products.length === 0 ? (
        <p>No products yet. <Link href="/admin/products/new">Add the first one</Link>.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${Number(product.price ?? 0).toFixed(2)}</td>
                <td>{product.in_stock ? 'In stock' : 'Out'}</td>
                <td>
                  <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>{' · '}
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
