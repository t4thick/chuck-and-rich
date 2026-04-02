import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckoutClient } from './CheckoutClient'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/checkout')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <CheckoutClient
      initialAccount={{
        email: user.email ?? '',
        fullName:
          profile?.full_name?.trim() ||
          String(user.user_metadata?.full_name ?? '').trim(),
        phone: profile?.phone?.trim() || '',
      }}
    />
  )
}
