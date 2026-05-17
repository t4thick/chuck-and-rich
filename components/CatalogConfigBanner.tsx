import Link from 'next/link'
import { getSupabasePublicConfig } from '@/lib/supabase/config'

/** Shown site-wide when Supabase public env vars are missing (e.g. Vercel not configured). */
export function CatalogConfigBanner() {
  const { configured } = getSupabasePublicConfig()
  if (configured) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-950">
      <p className="font-semibold">Store catalog is in setup mode</p>
      <p className="mt-1 text-amber-900/90">
        Online browsing may be limited. You can still call us at{' '}
        <a href="tel:+16144460893" className="font-semibold underline">
          (614) 446-0893
        </a>{' '}
        or{' '}
        <Link href="/shop" className="font-semibold underline">
          try the shop
        </Link>
        .
      </p>
    </div>
  )
}

