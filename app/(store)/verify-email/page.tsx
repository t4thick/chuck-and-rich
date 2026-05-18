'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) {
      setReady(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(!!user)
      setVerified(!!user?.email_confirmed_at)
      setEmail(user?.email ?? null)
      setReady(true)
      if (user?.email_confirmed_at) router.replace('/account')
    })
  }, [router])

  async function resend() {
    if (!email) return
    setStatus('sending')
    const supabase = createClient()
    const origin = getAuthSiteOrigin()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/account` },
    })
    setStatus(error ? 'error' : 'sent')
  }

  if (!ready) return <p>Loading…</p>

  if (!signedIn) {
    return (
      <div className="stack">
        <h2>Sign in required</h2>
        <p>Log in to resend your verification email.</p>
        <p><Link href="/login?next=/verify-email">Sign in</Link></p>
      </div>
    )
  }

  if (verified) return null

  return (
    <div className="stack">
      <h2>Verify your email</h2>
      <p>We sent a link to <strong>{email}</strong>. Open it to activate your account.</p>
      <button type="button" onClick={() => void resend()} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Resend verification email'}
      </button>
      {status === 'sent' && <p className="success" role="status">If an account exists, we sent a new link. Check spam.</p>}
      {status === 'error' && <p className="error" role="alert">Could not send right now.</p>}
      <p><Link href="/account">← Back to account</Link></p>
    </div>
  )
}
