'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mapPasswordResetError } from '@/lib/auth/map-auth-error'
import { AuthTrustFooter } from '@/components/auth/AuthTrustFooter'

function ForgotPasswordInner() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next')?.startsWith('/') ? searchParams.get('next')! : '/account'
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    })
    setLoading(false)

    if (resetError) {
      const mapped = mapPasswordResetError(resetError.message)
      if (mapped) {
        setError(mapped)
        return
      }
    }

    setSent(true)
  }

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="panel w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#c8811a] font-semibold mb-2">Account recovery</p>
        <h1 className="section-title mb-1">Reset password</h1>
        <p className="section-subtitle mb-6">We’ll email you a secure link to choose a new password.</p>

        {sent ? (
          <div className="space-y-3" role="status">
            <p className="text-sm text-gray-700">
              If an account exists for that email, we sent a reset link. Check your inbox and spam folder.
            </p>
            <p className="text-xs text-gray-500">
              For your security, we don’t confirm whether an email is registered.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
              />
            </div>
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
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-[#236641] font-medium hover:underline">
            Back to sign in
          </Link>
        </p>

        <AuthTrustFooter className="mt-8 pt-6 border-t border-gray-100" />
      </div>
    </main>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] flex items-center justify-center px-5 py-16">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <ForgotPasswordInner />
    </Suspense>
  )
}
