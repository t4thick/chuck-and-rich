import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { AddressesManager, type AddressRow } from './AddressesManager'

export const dynamic = 'force-dynamic'

export default async function AddressesPage() {
  const supabase = await createClientOptional()
  if (!supabase) redirect('/login?next=/account/addresses&error=configuration')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account/addresses')

  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="stack">
      <h2>Saved addresses</h2>
      {error && <p className="error">Could not load addresses: {error.message} <br /><em>(Run supabase/mvp-features.sql to create the addresses table.)</em></p>}
      <AddressesManager userId={user.id} initial={(addresses ?? []) as AddressRow[]} />
      <p><Link href="/account">← Back to account</Link></p>
    </div>
  )
}
