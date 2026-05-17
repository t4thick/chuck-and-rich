import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { ChangePasswordForm } from './ChangePasswordForm'

export const dynamic = 'force-dynamic'

export default async function ChangePasswordPage() {
  const supabase = await createClientOptional()
  if (!supabase) redirect('/login?next=/account/password&error=configuration')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account/password')

  return (
    <div className="stack">
      <h2>Change password</h2>
      <ChangePasswordForm />
      <p><Link href="/account">← Back to account</Link></p>
    </div>
  )
}
