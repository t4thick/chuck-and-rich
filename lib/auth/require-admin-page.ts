import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClientOptional } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth/admin-session'

/**
 * Server-component admin gate for `/admin/**` pages — defense in depth on top of
 * `proxy.ts`. If both checks fail (cookie + Supabase admin role), redirects to
 * `/admin/login` so the page does not render any privileged content.
 *
 * Use this at the top of every admin server component (including layout). It
 * is safe to call from inside a layout: Next.js dedupes the redirect.
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

/**
 * Same check as `requireAdminPage` but non-redirecting — returns `true` if the
 * current viewer is an admin. Useful for conditional UI (e.g. nav links).
 */
export async function isViewerAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (await verifyAdminSessionToken(sessionToken)) return true

  const supabase = await createClientOptional()
  if (!supabase) return false

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return profile?.role === 'admin'
}
