'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isPasswordAcceptableForSignup } from '@/lib/auth/password-strength'
import { PasswordField } from '@/components/auth/PasswordField'
import { AuthTrustFooter } from '@/components/auth/AuthTrustFooter'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRaw = searchParams.get('next') ?? '/account'
  const next = nextRaw.startsWith('/') ? nextRaw : '/account'

  const [ready, setReady] = useState<'checking' | 'ready' | 'no-session'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    void (async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      setReady(data.session ? 'ready' : 'no-session')
    })()

    // The Supabase client also fires PASSWORD_RECOVERY when the recovery email
    // link establishes a session — this catches the rare race where getSession
    // resolves a tick before the session is committed.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || session) {
        setReady('ready')
      }
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    if (!isPasswordAcceptableForSignup(password)) {
      setError('Use a stronger password: at least 8 characters with upper, lower, number, and special character.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message || 'Could not update password. Try requesting a new reset link.')
      return
    }

    setDone(true)
    setTimeout(() => {
      router.push(next)
      router.refresh()
    }, 1200)
  }

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="panel w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Account recovery</p>
        <h1 className="section-title mb-1">Choose a new password</h1>
        <p className="section-subtitle mb-6">Set a strong password — you’ll be signed in right after.</p>

        {ready === 'checking' && (
          <p className="text-sm text-gray-500" role="status">
            Verifying your reset link…
          </p>
        )}

        {ready === 'no-session' && (
          <div className="space-y-3" role="alert">
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              This reset link is no longer valid (it may have expired or been used already).
            </p>
            <p className="text-sm text-gray-600">
              Request a new one and try again.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full text-center bg-[#1a4731] hover:bg-[#236641] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Send a new reset email
            </Link>
          </div>
        )}

        {ready === 'ready' && !done && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
              label="New password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              disabled={loading}
              showStrengthMeter
            />
            <PasswordField
              label="Confirm password"
              name="confirm"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              disabled={loading}
            />

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a4731] hover:bg-[#236641] text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}

        {done && (
          <p className="text-sm text-[#236641] bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2" role="status">
            Password updated. Redirecting…
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-[#236641] font-medium hover:underline">
            Back to sign in
          </Link>
        </p>

        <AuthTrustFooter className="mt-8 pt-6 border-t border-gray-100" />
      </div>
    </main>
  )
}
