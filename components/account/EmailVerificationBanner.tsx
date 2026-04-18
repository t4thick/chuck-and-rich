'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  email: string | null | undefined
}

export function EmailVerificationBanner({ email }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function resend() {
    if (!email) return
    setStatus('sending')
    setMessage('')
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/account`,
      },
    })
    if (error) {
      setStatus('error')
      setMessage('Could not send right now. Try again in a few minutes.')
      return
    }
    setStatus('sent')
    setMessage('Check your inbox for a new verification link.')
  }

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 mb-6"
      role="region"
      aria-label="Email verification"
    >
      <p className="font-semibold">Verify your email</p>
      <p className="mt-1 text-amber-900/90">
        Confirm your email so we can reach you about orders and delivery.{' '}
        <Link href="/verify-email" className="underline font-medium text-amber-950">
          More options
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void resend()}
          disabled={status === 'sending' || !email}
          className="rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-950 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Resend verification email'}
        </button>
        {message && <span className="text-xs text-amber-900">{message}</span>}
      </div>
    </div>
  )
}
