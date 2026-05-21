import Link from 'next/link'
import Image from 'next/image'
import { Package, Plus } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { Button } from '@/components/ui/button'

export default async function AdminProductsPage() {
  await requireAdminPage()
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, category, price, image_url, in_stock, created_at')
    .order('created_at', { ascending: false })

  const total = products?.length ?? 0
  const inStock = (products ?? []).filter((p) => p.in_stock).length
  const outOfStock = total - inStock

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="mt-1 text-sm text-earth-500">
            {total} total · {inStock} in stock · {outOfStock} out of stock
          </p>
        </div>
        <Link href="/admin/products/new" className="no-underline">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add product
          </Button>
        </Link>
      </div>

      {total === 0 ? (
        <div className="admin-card flex flex-col items-center text-center">
          <Package className="h-10 w-10 text-earth-300" strokeWidth={1.5} aria-hidden />
          <p className="mt-3 text-sm text-earth-600">No products yet.</p>
          <Link href="/admin/products/new" className="mt-4 no-underline">
            <Button size="sm">Add the first one</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap hidden overflow-x-auto sm:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products!.map((p) => (
                  <tr key={p.id}>
                    <td style={{ width: 56 }}>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-earth-200 bg-earth-50">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-4 w-4 text-earth-300" aria-hidden />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="font-medium text-earth-900">{p.name}</td>
                    <td className="text-earth-600">{p.category}</td>
                    <td className="tabular-nums font-medium text-earth-900">
                      ${Number(p.price ?? 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`admin-status-pill ${
                          p.in_stock
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {p.in_stock ? 'In stock' : 'Out'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-3 text-sm">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="font-medium text-brand-700 no-underline hover:text-brand-800"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2 sm:hidden">
            {products!.map((p) => (
              <li key={p.id} className="admin-card flex gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-earth-200 bg-earth-50">
                  {p.image_url ? (
                    <Image src={p.image_url} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-5 w-5 text-earth-300" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate font-medium text-earth-900">{p.name}</p>
                  <p className="mt-0.5 text-xs text-earth-500">{p.category}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="tabular-nums text-sm font-semibold text-earth-900">
                      ${Number(p.price ?? 0).toFixed(2)}
                    </span>
                    <span
                      className={`admin-status-pill ${
                        p.in_stock
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {p.in_stock ? 'In stock' : 'Out'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="font-medium text-brand-700 no-underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
