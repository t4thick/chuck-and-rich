'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

export function EmailVerificationBanner({ email }: { email: string | null | undefined }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function resend() {
    if (!email || !isSupabaseBrowserConfigured()) return
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

  return (
    <div role="region" aria-label="Email verification">
      <p>
        <strong>⚠ Verify your email.</strong> Confirm your address so we can reach you about orders.{' '}
        <Link href="/verify-email">More options</Link>
      </p>
      <button type="button" onClick={() => void resend()} disabled={status === 'sending' || !email}>
        {status === 'sending' ? 'Sending…' : 'Resend verification email'}
      </button>
      {status === 'sent' && <span className="muted"> — Sent! Check your inbox.</span>}
      {status === 'error' && <span className="error"> — Could not send.</span>}
    </div>
  )
}
