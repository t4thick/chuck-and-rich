import Link from 'next/link'
import { DateTime } from 'luxon'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ORDER_STATUS_LABEL, normalizeOrderStatus } from '@/lib/order-status'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import {
  computeRevenueSnapshot,
  getReportTimeZone,
  money,
  type OrderMoneyRow,
} from '@/lib/admin/revenue-stats'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

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
    { data: revenueRowsAll },
    { data: weekRevenueRows },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false),
    supabaseAdmin.from('orders').select('total_amount'),
    supabaseAdmin.from('orders').select('total_amount').gte('created_at', sevenDaysAgo),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const allTimeRaw = (revenueRowsAll ?? []).reduce((s, o) => s + Number(o.total_amount ?? 0), 0)
  const weekRevenueRaw = (weekRevenueRows ?? []).reduce((s, o) => s + Number(o.total_amount ?? 0), 0)

  const openOrders = (recentOrders ?? []).filter((o) => {
    const st = normalizeOrderStatus(o.status)
    return st === 'ordered' || st === 'processing'
  }).length

  return (
    <div className="stack">
      <h2>Dashboard</h2>

      <section className="stack">
        <h3>Sales & revenue (internal)</h3>
        <p className="muted">
          Calendar boundaries use <strong>{getReportTimeZone()}</strong> — set <code>STORE_REPORT_TIMEZONE</code>{' '}
          (IANA, e.g. <code>America/New_York</code>) to match your books. Gross excludes{' '}
          <strong>cancelled</strong> orders and rows with <strong>refunded_at</strong> set (when that column
          exists). Not audited net revenue — operations snapshot only.
        </p>
        <table>
          <tbody>
            <tr>
              <th>Today ({revenue.todayKey})</th>
              <td>{money(revenue.todayGross)}</td>
            </tr>
            <tr>
              <th>Yesterday</th>
              <td>{money(revenue.yesterdayGross)}</td>
            </tr>
            <tr>
              <th>Trailing 7 days</th>
              <td>{money(revenue.trailing7Gross)}</td>
            </tr>
            <tr>
              <th>Trailing 30 days</th>
              <td>{money(revenue.trailing30Gross)}</td>
            </tr>
            <tr>
              <th>Avg daily gross (÷30)</th>
              <td>{money(revenue.averageDailyGrossTrailing30)}</td>
            </tr>
            <tr>
              <th>Orders (trailing 30 days)</th>
              <td>{revenue.orderCountTrailing30}</td>
            </tr>
            <tr>
              <th>Avg order value (trailing 30)</th>
              <td>{money(revenue.averageOrderValueTrailing30)}</td>
            </tr>
            <tr>
              <th>Month-to-date gross</th>
              <td>{money(revenue.monthToDateGross)}</td>
            </tr>
            <tr>
              <th>Prior month (same # of days elapsed)</th>
              <td>{money(revenue.priorMonthPartialThroughSameDayGross)}</td>
            </tr>
            <tr>
              <th>MTD vs prior-month pace</th>
              <td>
                {paceMomPct == null ? '—' : `${paceMomPct >= 0 ? '+' : ''}${paceMomPct.toFixed(1)}%`}
              </td>
            </tr>
            <tr>
              <th>Last complete calendar month</th>
              <td>{money(revenue.priorCalendarMonthGross)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <h3>Operations</h3>
      <table>
        <tbody>
          <tr>
            <th>Products</th>
            <td>{productsCount ?? 0}</td>
            <td>
              <Link href="/admin/products">Manage</Link>
            </td>
          </tr>
          <tr>
            <th>Out of stock</th>
            <td>{lowStockCount ?? 0}</td>
            <td>
              <Link href="/admin/products">Restock</Link>
            </td>
          </tr>
          <tr>
            <th>Orders (all time, raw)</th>
            <td>{ordersCount ?? 0}</td>
            <td>
              <Link href="/admin/orders">View</Link>
            </td>
          </tr>
          <tr>
            <th>Gross all orders (all time, raw)</th>
            <td>{money(allTimeRaw)}</td>
            <td className="muted">
              includes cancelled/refunded — use Sales section for comparable gross
            </td>
          </tr>
          <tr>
            <th>Gross last 7 days (raw)</th>
            <td>{money(weekRevenueRaw)}</td>
            <td />
          </tr>
          <tr>
            <th>Open orders (recent sample)</th>
            <td>{openOrders}</td>
            <td>
              <Link href="/admin/orders?status=ordered">Process</Link>
            </td>
          </tr>
          <tr>
            <th>Customers</th>
            <td>{customersCount ?? 0}</td>
            <td>
              <Link href="/admin/customers">View</Link>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Recent orders</h3>
      {!recentOrders || recentOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.customer_name ?? '—'}</td>
                <td>{money(Number(order.total_amount ?? 0))}</td>
                <td>{ORDER_STATUS_LABEL[normalizeOrderStatus(order.status)]}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <Link href={`/admin/orders/${order.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
