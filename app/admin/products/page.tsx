import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle, Package, Plus, Search } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type StockFilter = 'all' | 'in' | 'out'

type AdminProduct = {
  id: string
  name: string
  category: string | null
  price: number | null
  image_url: string | null
  in_stock: boolean | null
  created_at: string
}

function normalizeStock(raw: string | undefined): StockFilter {
  if (raw === 'in' || raw === 'out') return raw
  return 'all'
}

function buildQuery(
  params: Record<string, string | undefined>,
  override: Record<string, string | undefined>
): string {
  const merged = { ...params, ...override }
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(merged)) {
    if (v && v.length > 0) sp.set(k, v)
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; stock?: string }>
}) {
  await requireAdminPage()
  const sp = await searchParams
  const activeCategory = sp.cat?.trim() || null
  const search = sp.q?.trim() || ''
  const stock = normalizeStock(sp.stock)

  const linkParams = { cat: sp.cat, q: sp.q, stock: sp.stock }

  // Single source of truth: pull everything, then filter / group in memory.
  // With ~175 products this is far cheaper than multiple round-trips.
  const { data } = await supabaseAdmin
    .from('products')
    .select('id, name, category, price, image_url, in_stock, created_at')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  const allProducts = (data ?? []) as AdminProduct[]
  const total = allProducts.length
  const inStockCount = allProducts.filter((p) => p.in_stock).length
  const outOfStockCount = total - inStockCount

  // Visible products after applying search + stock + category filters
  const searchLower = search.toLowerCase()
  const matchesFilters = (p: AdminProduct) => {
    if (stock === 'in' && !p.in_stock) return false
    if (stock === 'out' && p.in_stock) return false
    if (searchLower && !p.name.toLowerCase().includes(searchLower)) return false
    if (activeCategory && (p.category ?? '') !== activeCategory) return false
    return true
  }

  const visible = allProducts.filter(matchesFilters)

  // For the chip strip we want category counts AFTER search/stock filters but
  // BEFORE category filter is applied — that way you can see how many results
  // each category would yield from your current search.
  const productsAfterNonCatFilters = allProducts.filter((p) => {
    if (stock === 'in' && !p.in_stock) return false
    if (stock === 'out' && p.in_stock) return false
    if (searchLower && !p.name.toLowerCase().includes(searchLower)) return false
    return true
  })

  const categoryStats = new Map<string, { total: number; outOfStock: number }>()
  for (const p of productsAfterNonCatFilters) {
    const cat = p.category ?? 'Uncategorized'
    const e = categoryStats.get(cat) ?? { total: 0, outOfStock: 0 }
    e.total += 1
    if (!p.in_stock) e.outOfStock += 1
    categoryStats.set(cat, e)
  }
  const sortedCategories = [...categoryStats.entries()].sort(
    (a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0])
  )

  // Grouped view: products in `visible`, bucketed by category, only categories
  // with at least one product after filtering.
  const grouped = new Map<string, AdminProduct[]>()
  for (const p of visible) {
    const cat = p.category ?? 'Uncategorized'
    const list = grouped.get(cat) ?? []
    list.push(p)
    grouped.set(cat, list)
  }
  const groupedEntries = [...grouped.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="mt-1 text-sm text-earth-500">
            {visible.length} shown · {total} total · {inStockCount} in stock ·{' '}
            {outOfStockCount} out of stock
          </p>
        </div>
        <Link href="/admin/products/new" className="no-underline">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add product
          </Button>
        </Link>
      </div>

      {/* Search + stock filter */}
      <form method="GET" className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400"
            aria-hidden
          />
          <Input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search by name…"
            className="pl-10"
          />
        </div>
        {activeCategory && <input type="hidden" name="cat" value={activeCategory} />}
        {stock !== 'all' && <input type="hidden" name="stock" value={stock} />}
        <Button type="submit" size="sm">
          Search
        </Button>

        <div className="flex flex-1 justify-end gap-1.5">
          {([
            { id: 'all', label: 'All' },
            { id: 'in', label: 'In stock' },
            { id: 'out', label: 'Out' },
          ] as Array<{ id: StockFilter; label: string }>).map((opt) => {
            const active = opt.id === stock
            return (
              <Link
                key={opt.id}
                href={`/admin/products${buildQuery(linkParams, { stock: opt.id === 'all' ? undefined : opt.id })}`}
                className={`admin-status-pill no-underline ${
                  active
                    ? 'bg-earth-900 text-white'
                    : 'bg-white text-earth-700 ring-1 ring-earth-200 hover:bg-earth-50'
                }`}
              >
                {opt.label}
              </Link>
            )
          })}
        </div>
      </form>

      {/* Category chips */}
      <div className="-mx-1 flex flex-wrap gap-1.5 px-1">
        <Link
          href={`/admin/products${buildQuery(linkParams, { cat: undefined })}`}
          className={`admin-status-pill no-underline ${
            !activeCategory
              ? 'bg-earth-900 text-white'
              : 'bg-white text-earth-700 ring-1 ring-earth-200 hover:bg-earth-50'
          }`}
        >
          All categories ({productsAfterNonCatFilters.length})
        </Link>
        {sortedCategories.map(([cat, stats]) => {
          const active = activeCategory === cat
          return (
            <Link
              key={cat}
              href={`/admin/products${buildQuery(linkParams, { cat })}`}
              className={`admin-status-pill inline-flex items-center gap-1 no-underline ${
                active
                  ? 'bg-earth-900 text-white'
                  : 'bg-white text-earth-700 ring-1 ring-earth-200 hover:bg-earth-50'
              }`}
              title={
                stats.outOfStock > 0
                  ? `${stats.outOfStock} out of stock`
                  : undefined
              }
            >
              {cat} ({stats.total})
              {stats.outOfStock > 0 && (
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
              )}
            </Link>
          )
        })}
      </div>

      {/* Empty / no results */}
      {visible.length === 0 ? (
        <div className="admin-card flex flex-col items-center text-center">
          <Package className="h-10 w-10 text-earth-300" strokeWidth={1.5} aria-hidden />
          {total === 0 ? (
            <>
              <p className="mt-3 text-sm text-earth-600">No products yet.</p>
              <Link href="/admin/products/new" className="mt-4 no-underline">
                <Button size="sm">Add the first one</Button>
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-earth-600">No products match these filters.</p>
              <Link href="/admin/products" className="mt-4 no-underline">
                <Button size="sm" variant="outline">
                  Clear filters
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : activeCategory ? (
        // Single-category flat view
        <ProductTable products={visible} />
      ) : (
        // Grouped view — one collapsible section per category
        <div className="space-y-4">
          {groupedEntries.map(([cat, items]) => {
            const outOfStock = items.filter((p) => !p.in_stock).length
            return (
              <details
                key={cat}
                open
                className="admin-card group overflow-hidden p-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-earth-50">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-earth-900">{cat}</h2>
                    <span className="admin-status-pill bg-earth-100 text-earth-700">
                      {items.length}
                    </span>
                    {outOfStock > 0 && (
                      <span className="admin-status-pill inline-flex items-center gap-1 bg-amber-50 text-amber-700">
                        <AlertTriangle className="h-3 w-3" aria-hidden />
                        {outOfStock} out
                      </span>
                    )}
                  </div>
                  <span
                    className="text-earth-400 transition-transform group-open:rotate-180"
                    aria-hidden
                  >
                    ▾
                  </span>
                </summary>
                <div className="border-t border-earth-100">
                  <ProductTable products={items} compact />
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProductTable({
  products,
  compact = false,
}: {
  products: AdminProduct[]
  compact?: boolean
}) {
  return (
    <>
      <div
        className={`admin-table-wrap hidden overflow-x-auto sm:block ${
          compact ? '' : 'rounded-xl border border-earth-200'
        }`}
      >
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
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
        {products.map((p) => (
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
              <p className="mt-0.5 text-xs text-earth-500">{p.category ?? '—'}</p>
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
  )
}
