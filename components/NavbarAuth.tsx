'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const linkClassLight =
  'px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm font-medium text-gray-600'

const linkClassDark =
  'px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-sm font-medium text-white/85'

export function NavbarAuth({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const linkClass = variant === 'dark' ? linkClassDark : linkClassLight
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSignedIn(!!session?.user)
      setReady(true)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!ready) {
    return <span className={`${linkClass} opacity-0 pointer-events-none select-none`}>Sign in</span>
  }

  if (signedIn) {
    return (
      <Link href="/account" className={linkClass}>
        Account
      </Link>
    )
  }

  return (
    <Link href="/login" className={linkClass}>
      Sign in
    </Link>
  )
}
