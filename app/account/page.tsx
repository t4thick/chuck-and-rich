import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { AccountSignOut } from '@/components/AccountSignOut'
import { EmailVerificationBanner } from '@/components/account/EmailVerificationBanner'
import { ORDER_STATUS_LABEL, normalizeOrderStatus } from '@/lib/order-status'

type AccountOrderRow = {
  id: string
  total_amount: number
  status: string
  created_at: string
  customer_email: string | null
}

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClientOptional()
  if (!supabase) redirect('/login?next=/account&error=configuration')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const { data: orders } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at, customer_email')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(25)

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>My account</h2>
        <AccountSignOut />
      </div>
      <p className="muted">{user.email}</p>

      {!user.email_confirmed_at && <EmailVerificationBanner email={user.email} />}

      <h3>Settings</h3>
      <ul>
        <li><Link href="/account/profile">Edit profile (name, phone)</Link></li>
        <li><Link href="/account/addresses">Manage addresses</Link></li>
        <li><Link href="/account/password">Change password</Link></li>
      </ul>

      <h3>Profile</h3>
      <table>
        <tbody>
          <tr><th>Name</th><td>{profile?.full_name || '—'}</td></tr>
          <tr><th>Phone</th><td>{profile?.phone || '—'}</td></tr>
          <tr><th>Email</th><td>{user.email}</td></tr>
        </tbody>
      </table>

      <h3>Orders</h3>
      {!orders?.length ? (
        <p>No orders linked to this account yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Placed</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: AccountOrderRow) => {
              const st = normalizeOrderStatus(o.status)
              return (
                <tr key={o.id}>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td>${Number(o.total_amount).toFixed(2)}</td>
                  <td>{ORDER_STATUS_LABEL[st]}</td>
                  <td>
                    <Link href={`/track-order?id=${encodeURIComponent(o.id)}`}>Track</Link>
                    {' · '}
                    <Link href={`/account/reorder/${encodeURIComponent(o.id)}`}>Reorder</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <p><Link href="/shop">← Continue shopping</Link></p>
    </div>
  )
}
