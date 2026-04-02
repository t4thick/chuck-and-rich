import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-green-700 hover:bg-green-800 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-semibold">No products yet.</p>
            <Link href="/admin/products/new" className="text-green-700 text-sm mt-2 inline-block hover:underline">
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url
                          ? <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          : <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-lg shrink-0">📦</div>
                        }
                        <span className="font-semibold text-gray-900 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-green-700">${product.price?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 font-semibold hover:underline text-xs">
                          Edit
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
