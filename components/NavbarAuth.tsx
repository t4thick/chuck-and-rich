'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'

export function NavbarAuth() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) {
      setReady(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSignedIn(!!session?.user)
      setReady(true)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!ready) return <span>—</span>
  if (signedIn) return null

  return (
    <>
      <Link href="/login">Sign in</Link>
      <Link href="/signup">Sign up</Link>
    </>
  )
}
