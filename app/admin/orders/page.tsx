import Link from 'next/link'
import { Download, Search } from 'lucide-react'
import { DateTime } from 'luxon'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUSES,
  normalizeOrderStatus,
  type OrderStatus,
} from '@/lib/order-status'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatOrderNumber, parseOrderRef } from '@/lib/orders/order-number'
import { getReportTimeZone } from '@/lib/admin/revenue-stats'

const STATUS_PILL_COLORS: Record<OrderStatus, string> = {
  ordered: 'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-violet-50 text-violet-700',
  out_for_delivery: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; when?: string }>
}) {
  await requireAdminPage()
  const { status: rawStatus, q, when } = await searchParams
  const activeStatus = rawStatus ? normalizeOrderStatus(rawStatus) : undefined

  // Quick-day filter: ?when=today | ?when=yesterday | ?when=7d
  const zone = getReportTimeZone()
  const now = DateTime.now().setZone(zone)
  const todayStart = now.startOf('day')
  let whenStart: DateTime | null = null
  let whenEnd: DateTime | null = null
  if (when === 'today') {
    whenStart = todayStart
    whenEnd = todayStart.plus({ days: 1 })
  } else if (when === 'yesterday') {
    whenStart = todayStart.minus({ days: 1 })
    whenEnd = todayStart
  } else if (when === '7d') {
    whenStart = todayStart.minus({ days: 6 })
    whenEnd = todayStart.plus({ days: 1 })
  }

  let query = supabaseAdmin
    .from('orders')
    .select(
      'id, order_number, customer_name, customer_email, city, total_amount, status, created_at'
    )
    .order('created_at', { ascending: false })
  if (whenStart && whenEnd) {
    query = query
      .gte('created_at', whenStart.toUTC().toISO()!)
      .lt('created_at', whenEnd.toUTC().toISO()!)
  }
  if (q?.trim()) {
    const term = q.trim()
    const ref = parseOrderRef(term)
    if (ref?.type === 'number') {
      query = query.or(
        `customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,order_number.eq.${ref.value}`
      )
    } else if (ref?.type === 'uuid') {
      query = query.or(
        `customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,id.eq.${ref.value}`
      )
    } else {
      query = query.or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`)
    }
  }
  const { data: orders } = await query

  const filtered = activeStatus
    ? (orders ?? []).filter((o) => normalizeOrderStatus(o.status) === activeStatus)
    : (orders ?? [])

  const filteredRevenue = (filtered ?? []).reduce(
    (s, o) => s + Number(o.total_amount ?? 0),
    0
  )

  const counts = ORDER_STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = (orders ?? []).filter((o) => normalizeOrderStatus(o.status) === status).length
    return acc
  }, {})

  const exportHref =
    when === 'today'
      ? '/api/admin/orders/export?range=today'
      : when === 'yesterday'
        ? '/api/admin/orders/export?range=yesterday'
        : when === '7d'
          ? '/api/admin/orders/export?range=7d'
          : '/api/admin/orders/export?range=all'

  const whenOptions: Array<{ id: 'today' | 'yesterday' | '7d' | undefined; label: string }> = [
    { id: undefined, label: 'Any time' },
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7d', label: 'Last 7 days' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="mt-1 text-sm text-earth-500">
            {filtered.length} shown · {orders?.length ?? 0} total · $
            {filteredRevenue.toFixed(2)} gross in view
          </p>
        </div>
        <Link href={exportHref} className="no-underline">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {whenOptions.map((opt) => {
          const active = (opt.id ?? '') === (when ?? '')
          const sp = new URLSearchParams()
          if (opt.id) sp.set('when', opt.id)
          if (q) sp.set('q', q)
          if (activeStatus) sp.set('status', activeStatus)
          const href = `/admin/orders${sp.toString() ? `?${sp.toString()}` : ''}`
          return (
            <Link
              key={opt.id ?? 'any'}
              href={href}
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

      <form method="GET" className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400"
            aria-hidden
          />
          <Input
            type="search"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search by name, email, or LQ-1042"
            className="pl-10"
          />
        </div>
        {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
        {when && <input type="hidden" name="when" value={when} />}
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {(() => {
          const sp = new URLSearchParams()
          if (q) sp.set('q', q)
          if (when) sp.set('when', when)
          const allHref = `/admin/orders${sp.toString() ? `?${sp.toString()}` : ''}`
          return (
            <Link
              href={allHref}
              className={`admin-status-pill no-underline ${
                !activeStatus
                  ? 'bg-earth-900 text-white'
                  : 'bg-white text-earth-700 ring-1 ring-earth-200 hover:bg-earth-50'
              }`}
            >
              All ({orders?.length ?? 0})
            </Link>
          )
        })()}
        {ORDER_STATUSES.map((status) => {
          const sp = new URLSearchParams()
          sp.set('status', status)
          if (q) sp.set('q', q)
          if (when) sp.set('when', when)
          const href = `/admin/orders?${sp.toString()}`
          const isActive = activeStatus === status
          return (
            <Link
              key={status}
              href={href}
              className={`admin-status-pill no-underline ${
                isActive
                  ? 'bg-earth-900 text-white'
                  : `${STATUS_PILL_COLORS[status]} hover:opacity-80`
              }`}
            >
              {ORDER_STATUS_LABEL[status]} ({counts[status] ?? 0})
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card text-center">
          <p className="text-sm text-earth-600">No orders in this view.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap hidden overflow-x-auto sm:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const st = normalizeOrderStatus(order.status)
                  return (
                    <tr key={order.id}>
                      <td className="font-mono text-xs font-semibold text-earth-900">
                        {formatOrderNumber(order.order_number) || '—'}
                      </td>
                      <td className="font-medium text-earth-900">{order.customer_name}</td>
                      <td className="text-earth-600">{order.customer_email}</td>
                      <td className="text-earth-600">{order.city ?? '—'}</td>
                      <td className="tabular-nums font-medium text-earth-900">
                        ${Number(order.total_amount ?? 0).toFixed(2)}
                      </td>
                      <td>
                        <span className={`admin-status-pill ${STATUS_PILL_COLORS[st]}`}>
                          {ORDER_STATUS_LABEL[st]}
                        </span>
                      </td>
                      <td className="text-earth-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-sm font-medium text-brand-700 no-underline hover:text-brand-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2 sm:hidden">
            {filtered.map((order) => {
              const st = normalizeOrderStatus(order.status)
              return (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="admin-card flex flex-col gap-1 no-underline"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs font-semibold text-earth-900">
                          {formatOrderNumber(order.order_number) || '—'}
                        </p>
                        <p className="text-sm font-medium text-earth-800">{order.customer_name}</p>
                      </div>
                      <span className="tabular-nums text-sm font-semibold text-earth-900">
                        ${Number(order.total_amount ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-earth-500">{order.customer_email}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className={`admin-status-pill ${STATUS_PILL_COLORS[st]}`}>
                        {ORDER_STATUS_LABEL[st]}
                      </span>
                      <span className="text-xs text-earth-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
