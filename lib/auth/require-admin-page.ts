import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth/admin-session'

/**
 * Server-component admin gate for `/admin/**` pages — defense in depth on top of
 * `proxy.ts`. If both checks fail (cookie + Supabase admin role), redirects to
 * `/admin/login` so the page does not render any privileged content.
 *
 * Use this at the top of every privileged admin server page (not `/admin/login`).
 */
export async function requireAdminPage(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (await verifyAdminSessionToken(sessionToken)) return

  const supabase = await createClientOptional()
  if (!supabase) {
    redirect('/admin/login?error=configuration')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (error || profile?.role !== 'admin') {
    redirect('/admin/login?error=forbidden')
  }
}
