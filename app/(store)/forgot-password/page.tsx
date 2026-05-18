'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import { useClientSearchParams } from '@/lib/hooks/use-client-search-params'
import { mapPasswordResetError } from '@/lib/auth/map-auth-error'
import { getAuthSiteOrigin } from '@/lib/site-url-client'

export default function ForgotPasswordPage() {
  const { next } = useClientSearchParams()
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
    if (!isSupabaseBrowserConfigured()) {
      setError('Reset is temporarily unavailable.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const origin = getAuthSiteOrigin()
    const resetTarget = `/reset-password?next=${encodeURIComponent(next)}`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(resetTarget)}`,
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
    <div className="stack">
      <h2>Forgot password</h2>

      {sent ? (
        <div className="stack" role="status">
          <p className="success">If an account exists for that email, we sent a reset link.</p>
          <p className="muted">Check your inbox and spam folder. We don&apos;t confirm whether an email is registered.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="stack">
          <p>
            <label>
              Email:<br />
              <input
                ref={emailRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </p>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p>
        <Link href={`/login?next=${encodeURIComponent(next)}`}>← Back to sign in</Link>
      </p>
    </div>
  )
}
