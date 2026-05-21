import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Package, Settings, User } from 'lucide-react'
import { createClientOptional } from '@/lib/supabase/server'
import { AccountSignOut } from '@/components/AccountSignOut'
import { EmailVerificationBanner } from '@/components/account/EmailVerificationBanner'
import { ORDER_STATUS_LABEL, normalizeOrderStatus } from '@/lib/order-status'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/utils'
import { formatOrderNumber } from '@/lib/orders/order-number'

type AccountOrderRow = {
  id: string
  order_number: number | null
  total_amount: number
  status: string
  created_at: string
  customer_email: string | null
}

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClientOptional()
  if (!supabase) redirect('/login?next=/account&error=configuration')

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, created_at, customer_email')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(25)

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-eyebrow">Overview</p>
          <h1 className="section-title mt-2">Welcome back</h1>
          <p className="section-subtitle mt-2">{user.email}</p>
        </div>
        <AccountSignOut />
      </div>

      {!user.email_confirmed_at && (
        <div className="mt-6">
          <EmailVerificationBanner email={user.email} />
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/account/profile', icon: User, label: 'Edit profile', desc: 'Name & phone' },
          { href: '/account/addresses', icon: Settings, label: 'Addresses', desc: 'Delivery locations' },
          { href: '/track-order', icon: Package, label: 'Track order', desc: 'Order status' },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="premium-card premium-card-hover block p-5 no-underline"
          >
            <Icon className="h-5 w-5 text-brand-700" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-earth-900">{label}</p>
            <p className="mt-1 text-sm text-earth-600">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="premium-card mt-10 p-6">
        <h2 className="text-base font-semibold text-earth-900">Profile</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-earth-500">Name</dt>
            <dd className="mt-1 font-medium text-earth-900">{profile?.full_name || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-earth-500">Phone</dt>
            <dd className="mt-1 font-medium text-earth-900">{profile?.phone || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-earth-500">Email</dt>
            <dd className="mt-1 font-medium text-earth-900">{user.email}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-earth-900">Recent orders</h2>
          <Link href="/shop" className="text-sm font-semibold text-brand-700 no-underline">
            Shop again
          </Link>
        </div>

        {!orders?.length ? (
          <div className="premium-card mt-6 px-6 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-earth-300" strokeWidth={1.25} />
            <p className="mt-4 font-medium text-earth-800">No orders yet</p>
            <p className="mt-1 text-sm text-earth-600">When you place an order, it will show up here.</p>
            <Link href="/shop" className="mt-6 inline-block no-underline">
              <Button variant="accent" className="rounded-xl">
                Start shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((o: AccountOrderRow) => {
              const st = normalizeOrderStatus(o.status)
              const number = formatOrderNumber(o.order_number)
              return (
                <article
                  key={o.id}
                  className="premium-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-earth-900">
                        {number || '—'}
                      </span>
                      <span className="text-xs text-earth-400">·</span>
                      <p className="text-xs font-bold uppercase tracking-wider text-earth-500">
                        {new Date(o.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <p className="mt-2 text-base font-semibold text-earth-900 tabular-nums">
                      {formatMoney(Number(o.total_amount))}
                    </p>
                    <p className="mt-1 text-sm text-earth-600">{ORDER_STATUS_LABEL[st]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/track-order?id=${encodeURIComponent(number || o.id)}`}
                      className="no-underline"
                    >
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Track
                      </Button>
                    </Link>
                    <Link href={`/account/reorder/${encodeURIComponent(o.id)}`} className="no-underline">
                      <Button variant="default" size="sm" className="gap-1 rounded-xl">
                        Reorder <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
