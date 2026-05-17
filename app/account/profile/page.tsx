import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { ProfileForm } from './ProfileForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClientOptional()
  if (!supabase) redirect('/login?next=/account/profile&error=configuration')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account/profile')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  return (
    <div className="stack">
      <h2>Edit profile</h2>
      <ProfileForm
        userId={user.id}
        initial={{
          full_name: profile?.full_name ?? '',
          phone: profile?.phone ?? '',
          marketing_opt_in: !!profile?.marketing_opt_in,
        }}
      />
      <p><Link href="/account">← Back to account</Link></p>
    </div>
  )
}
