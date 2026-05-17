import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabasePublicConfig, SupabaseConfigError } from '@/lib/supabase/config'

export async function createClient() {
  const { url, anonKey, configured } = getSupabasePublicConfig()

  if (!configured) {
    throw new SupabaseConfigError()
  }

  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — ignore if read-only
        }
      },
    },
  })
}
