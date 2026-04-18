'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthTrustFooter } from '@/components/auth/AuthTrustFooter'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(!!user)
      setVerified(!!user?.email_confirmed_at)
      setEmail(user?.email ?? null)
      setReady(true)
      if (user?.email_confirmed_at) {
        router.replace('/account')
      }
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
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/account`,
      },
    })
    if (error) {
      setStatus('error')
      return
    }
    setStatus('sent')
  }

  if (!ready) {
    return (
      <main className="page-shell flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    )
  }

  if (!signedIn) {
    return (
      <main className="page-shell flex items-center justify-center">
        <div className="panel w-full max-w-md p-8 text-center">
          <h1 className="section-title mb-2">Sign in required</h1>
          <p className="text-sm text-gray-600 mb-6">Log in to resend your verification email.</p>
          <Link
            href="/login?next=/verify-email"
            className="inline-flex justify-center w-full bg-[#1a4731] hover:bg-[#236641] text-white font-semibold py-3 rounded-xl text-sm"
          >
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  if (verified) {
    return null
  }

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="panel w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Almost there</p>
        <h1 className="section-title mb-2">Verify your email</h1>
        <p className="section-subtitle mb-6">
          We sent a link to <span className="font-medium text-gray-900">{email}</span>. Open it to activate your account and
          unlock order tracking.
        </p>
        <button
          type="button"
          onClick={() => void resend()}
          disabled={status === 'sending'}
          className="w-full bg-[#1a4731] hover:bg-[#236641] text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Resend verification email'}
        </button>
        {status === 'sent' && (
          <p className="text-sm text-[#236641] mt-3" role="status">
            If an account exists for that email, we sent a new link. Check spam.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600 mt-3" role="alert">
            Could not send right now. Please try again in a few minutes.
          </p>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/account" className="text-[#236641] font-medium hover:underline">
            Back to account
          </Link>
        </p>
        <AuthTrustFooter className="mt-8 pt-6 border-t border-gray-100" />
      </div>
    </main>
  )
}
