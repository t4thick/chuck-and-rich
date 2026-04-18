import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountSignOut } from '@/components/AccountSignOut'
import { EmailVerificationBanner } from '@/components/account/EmailVerificationBanner'
import { ORDER_STATUS_LABEL, normalizeOrderStatus } from '@/lib/order-status'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/account')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at, customer_email')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(25)

  return (
    <main className="page-shell">
      <div className="page-container max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Account</p>
            <h1 className="section-title">Your account</h1>
            <p className="section-subtitle mt-1">{user.email}</p>
          </div>
          <AccountSignOut />
        </div>

        {!user.email_confirmed_at && <EmailVerificationBanner email={user.email} />}

        <section className="panel p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Profile</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900 font-medium text-right">{profile?.full_name || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900 font-medium text-right">{profile?.phone || '—'}</dd>
            </div>
          </dl>
          <p className="text-xs text-gray-400 mt-4">
            Edit profile in Supabase dashboard for now, or we can add an edit form next.
          </p>
        </section>

        <section className="panel p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Your orders</h2>
          {!orders?.length ? (
            <p className="text-sm text-gray-500">No orders linked to this account yet. Orders placed while signed in appear here.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((o) => {
                const st = normalizeOrderStatus(o.status)
                return (
                  <li key={o.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${Number(o.total_amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(o.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                        {ORDER_STATUS_LABEL[st]}
                      </span>
                      <Link
                        href={`/track-order?id=${encodeURIComponent(o.id)}`}
                        className="text-xs font-semibold text-[#236641] hover:text-[#1a4731] hover:underline"
                      >
                        Track
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <p className="text-center mt-8">
          <Link href="/shop" className="text-sm font-semibold text-[#236641] hover:underline">
            Continue shopping
          </Link>
        </p>
      </div>
    </main>
  )
}
