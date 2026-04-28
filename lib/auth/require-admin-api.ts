import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth/admin-session'

/**
 * Server-side admin check for /api/admin routes (defense in depth; middleware also gates these paths).
 * Allows (1) signed admin session cookie set by /api/admin/login, or
 *        (2) Supabase user with profiles.role === 'admin'.
 */
export async function requireAdminApi(): Promise<
  { ok: true } | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (await verifyAdminSessionToken(session)) {
    return { ok: true }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('[requireAdminApi] profiles:', error.message)
    return { ok: false, response: NextResponse.json({ error: 'Forbidden.' }, { status: 403 }) }
  }

  if (profile?.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden.' }, { status: 403 }) }
  }

  return { ok: true }
}
