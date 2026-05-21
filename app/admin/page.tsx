import Link from 'next/link'
import { DateTime } from 'luxon'
import {
  AlertTriangle,
  Box,
  ChevronRight,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_LABEL, normalizeOrderStatus, type OrderStatus } from '@/lib/order-status'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import {
  computeRevenueSnapshot,
  getReportTimeZone,
  money,
  type OrderMoneyRow,
} from '@/lib/admin/revenue-stats'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

const STATUS_PILL_COLORS: Record<OrderStatus, string> = {
  ordered: 'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-violet-50 text-violet-700',
  out_for_delivery: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
}

function pill(status: OrderStatus) {
  return (
    <span className={`admin-status-pill ${STATUS_PILL_COLORS[status] ?? 'bg-earth-100 text-earth-700'}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}

export default async function AdminDashboard() {
  await requireAdminPage()
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS).toISOString()
  const lookbackIso = DateTime.now().minus({ days: 420 }).toUTC().toISO()!

  let moneyRows: OrderMoneyRow[] = []
  {
    const attempt = await supabaseAdmin
      .from('orders')
      .select('total_amount, created_at, status, refunded_at')
      .gte('created_at', lookbackIso)
    if (attempt.error) {
      const fb = await supabaseAdmin
        .from('orders')
        .select('total_amount, created_at, status')
        .gte('created_at', lookbackIso)
      moneyRows = (fb.data ?? []) as OrderMoneyRow[]
    } else {
      moneyRows = (attempt.data ?? []) as OrderMoneyRow[]
    }
  }

  const revenue = computeRevenueSnapshot(moneyRows)
  const paceMomPct =
    revenue.priorMonthPartialThroughSameDayGross > 0
      ? ((revenue.monthToDateGross - revenue.priorMonthPartialThroughSameDayGross) /
          revenue.priorMonthPartialThroughSameDayGross) *
        100
      : null

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { count: lowStockCount },
    { data: weekRevenueRows },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', false),
    supabaseAdmin.from('orders').select('total_amount').gte('created_at', sevenDaysAgo),
    supabaseAdmin
      .from('orders')
      .select('id, customer_name, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const weekRevenueRaw = (weekRevenueRows ?? []).reduce(
    (s, o) => s + Number(o.total_amount ?? 0),
    0
  )
  const openOrders = (recentOrders ?? []).filter((o) => {
    const st = normalizeOrderStatus(o.status)
    return st === 'ordered' || st === 'processing'
  }).length

  const todayPct =
    revenue.yesterdayGross > 0
      ? ((revenue.todayGross - revenue.yesterdayGross) / revenue.yesterdayGross) * 100
      : null

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="mt-1 text-sm text-earth-500">
          Calendar boundaries: <code className="rounded bg-earth-100 px-1 py-0.5 text-[11px] text-earth-700">{getReportTimeZone()}</code>
          {' '}· Gross excludes cancelled & refunded orders.
        </p>
      </header>

      <section>
        <h2 className="admin-section-title mb-3">Revenue</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Kpi
            icon={DollarSign}
            label="Today"
            value={money(revenue.todayGross)}
            delta={todayPct}
            deltaLabel="vs yesterday"
          />
          <Kpi
            icon={Clock}
            label="Trailing 7d"
            value={money(revenue.trailing7Gross)}
            sub={`AOV ${money(revenue.averageOrderValueTrailing30)}`}
          />
          <Kpi
            icon={TrendingUp}
            label="Trailing 30d"
            value={money(revenue.trailing30Gross)}
            sub={`${revenue.orderCountTrailing30} orders`}
          />
          <Kpi
            icon={TrendingUp}
            label="Month-to-date"
            value={money(revenue.monthToDateGross)}
            delta={paceMomPct}
            deltaLabel="vs prior month pace"
          />
        </div>
      </section>

      <section>
        <h2 className="admin-section-title mb-3">Operations</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <OpCard
            icon={Package}
            label="Products"
            value={productsCount ?? 0}
            href="/admin/products"
            cta="Manage"
          />
          <OpCard
            icon={AlertTriangle}
            label="Out of stock"
            value={lowStockCount ?? 0}
            href="/admin/products"
            cta="Restock"
            tone={Number(lowStockCount ?? 0) > 0 ? 'warning' : 'neutral'}
          />
          <OpCard
            icon={ShoppingBag}
            label="Orders (all-time)"
            value={ordersCount ?? 0}
            href="/admin/orders"
            cta="View"
            sub={`${money(weekRevenueRaw)} last 7d`}
          />
          <OpCard
            icon={Box}
            label="Open orders"
            value={openOrders}
            href="/admin/orders?status=ordered"
            cta="Process"
            tone={openOrders > 0 ? 'attention' : 'neutral'}
          />
          <OpCard
            icon={Users}
            label="Customers"
            value={customersCount ?? 0}
            href="/admin/customers"
            cta="View"
          />
          <OpCard
            label="Prior month gross"
            value={money(revenue.priorCalendarMonthGross)}
            sub="Last complete calendar month"
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="admin-section-title">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-0.5 text-sm font-medium text-brand-700 no-underline hover:text-brand-800"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {!recentOrders || recentOrders.length === 0 ? (
          <div className="admin-card text-center">
            <p className="text-sm text-earth-600">No orders yet.</p>
          </div>
        ) : (
          <div className="admin-table-wrap overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const st = normalizeOrderStatus(order.status)
                  return (
                    <tr key={order.id}>
                      <td className="font-medium text-earth-900">{order.customer_name ?? '—'}</td>
                      <td className="tabular-nums">{money(Number(order.total_amount ?? 0))}</td>
                      <td>{pill(st)}</td>
                      <td className="text-earth-600">
                        {new Date(order.created_at).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
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
        )}
      </section>
    </div>
  )
}

type IconCmp = React.ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  deltaLabel,
  sub,
}: {
  icon: IconCmp
  label: string
  value: string
  delta?: number | null
  deltaLabel?: string
  sub?: string
}) {
  const positive = typeof delta === 'number' && delta >= 0
  const DeltaIcon = positive ? TrendingUp : TrendingDown
  return (
    <div className="admin-kpi">
      <div className="flex items-center justify-between">
        <p className="admin-kpi-label">{label}</p>
        <Icon className="h-4 w-4 text-earth-400" strokeWidth={1.75} aria-hidden />
      </div>
      <p className="admin-kpi-value">{value}</p>
      {typeof delta === 'number' && (
        <p
          className={`admin-kpi-delta inline-flex items-center gap-1 ${
            positive ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          <DeltaIcon className="h-3 w-3" strokeWidth={2} aria-hidden />
          {positive ? '+' : ''}
          {delta.toFixed(1)}%
          {deltaLabel && <span className="font-normal text-earth-500"> {deltaLabel}</span>}
        </p>
      )}
      {sub && !delta && <p className="admin-kpi-delta text-earth-500">{sub}</p>}
    </div>
  )
}

function OpCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  cta,
  tone = 'neutral',
}: {
  icon?: IconCmp
  label: string
  value: number | string
  sub?: string
  href?: string
  cta?: string
  tone?: 'neutral' | 'warning' | 'attention'
}) {
  const toneClass =
    tone === 'warning'
      ? 'text-amber-700'
      : tone === 'attention'
        ? 'text-blue-700'
        : 'text-earth-900'

  return (
    <div className="admin-kpi flex flex-col">
      <div className="flex items-center justify-between">
        <p className="admin-kpi-label">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-earth-400" strokeWidth={1.75} aria-hidden />}
      </div>
      <p className={`admin-kpi-value ${toneClass}`}>{value}</p>
      {sub && <p className="admin-kpi-delta text-earth-500">{sub}</p>}
      {href && cta && (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-0.5 text-xs font-semibold text-brand-700 no-underline hover:text-brand-800"
        >
          {cta} <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}
