'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react'
import { createClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AdminLoginClient({
  allowSupabaseAdmin,
  forbidden,
}: {
  allowSupabaseAdmin: boolean
  forbidden: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [showStaffPassword, setShowStaffPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [mode, setMode] = useState<'staff' | 'supabase'>('staff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rateLimited, setRateLimited] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      try {
        setCapsLock(e.getModifierState('CapsLock'))
      } catch {
        /* ignore older browsers */
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [])

  async function handleSupabase(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseBrowserConfigured()) {
      setError('Admin sign-in is temporarily unavailable.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)
    if (signError) {
      setError(signError.message)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  async function handleStaffPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRateLimited(false)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ password: staffPassword }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
      router.refresh()
      return
    }

    const data = await res.json().catch(() => ({}))
    if (res.status === 429) {
      setRateLimited(true)
      setError(
        typeof data.error === 'string'
          ? data.error
          : 'Too many login attempts. Try again later.'
      )
      return
    }
    if (res.status === 503) {
      setError(
        typeof data.error === 'string'
          ? `${data.error} If this is a Preview deployment, add ADMIN_PASSWORD for the Preview environment in Vercel.`
          : 'Admin login is not configured on this deployment.'
      )
      return
    }
    setError(typeof data.error === 'string' ? data.error : 'Invalid password.')
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-earth-50">
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-earth-600 no-underline transition-colors hover:text-earth-900"
          >
            ← Back to store
          </Link>

          <div className="rounded-xl border border-earth-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-earth-900 text-white">
              <Lock className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-earth-900">
              Staff sign in
            </h1>
            <p className="mt-1 text-sm text-earth-600">
              Enter the staff password to access the admin dashboard.
            </p>

            {forbidden && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
                <span>
                  {allowSupabaseAdmin
                    ? 'Access denied. Enter the correct staff password or use an authorized Supabase admin account.'
                    : 'Access denied. Staff password only — sign in below.'}
                </span>
              </div>
            )}

            {allowSupabaseAdmin && (
              <div className="mt-5 flex gap-3 rounded-lg border border-earth-200 bg-earth-50 p-2 text-sm">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 transition-colors data-[active=true]:bg-white data-[active=true]:font-semibold data-[active=true]:shadow-sm"
                  data-active={mode === 'staff'}>
                  <input
                    type="radio"
                    className="sr-only"
                    checked={mode === 'staff'}
                    onChange={() => setMode('staff')}
                  />
                  Staff password
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 transition-colors data-[active=true]:bg-white data-[active=true]:font-semibold data-[active=true]:shadow-sm"
                  data-active={mode === 'supabase'}>
                  <input
                    type="radio"
                    className="sr-only"
                    checked={mode === 'supabase'}
                    onChange={() => setMode('supabase')}
                  />
                  Supabase admin
                </label>
              </div>
            )}

            {allowSupabaseAdmin && mode === 'supabase' ? (
              <form onSubmit={handleSupabase} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="admin-email" className="form-label">
                    Email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="admin-pass" className="form-label">
                    Password
                  </label>
                  <Input
                    id="admin-pass"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm font-medium text-red-700" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleStaffPassword} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="staff-pass" className="form-label">
                    Staff password
                  </label>
                  <div className="relative">
                    <Input
                      id="staff-pass"
                      type={showStaffPassword ? 'text' : 'password'}
                      autoComplete="off"
                      required
                      autoFocus
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="pr-10"
                      spellCheck={false}
                      autoCapitalize="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-earth-500 transition-colors hover:bg-earth-100 hover:text-earth-700"
                      aria-label={showStaffPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showStaffPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden />
                      )}
                    </button>
                  </div>
                  {capsLock && (
                    <p className="flex items-center gap-1 text-xs font-medium text-amber-700">
                      <AlertTriangle className="h-3 w-3" aria-hidden />
                      Caps Lock is on
                    </p>
                  )}
                </div>

                {error && (
                  <div
                    className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                      rateLimited
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-red-50 text-red-700'
                    }`}
                    role="alert"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>

                <details className="text-xs text-earth-500">
                  <summary className="cursor-pointer font-medium hover:text-earth-700">
                    Can&apos;t sign in?
                  </summary>
                  <ul className="mt-2 space-y-1.5 pl-1">
                    <li>• The password is case-sensitive — check Caps Lock.</li>
                    <li>• If you typed it wrong 5 times, you&apos;re locked out for 15 minutes from this device.</li>
                    <li>
                      • Your password is set on the server as the{' '}
                      <code className="rounded bg-earth-100 px-1 py-0.5">ADMIN_PASSWORD</code>{' '}
                      environment variable. Locally it&apos;s in{' '}
                      <code className="rounded bg-earth-100 px-1 py-0.5">.env.local</code>; on
                      Vercel it&apos;s under Settings → Environment Variables.
                    </li>
                    <li>
                      • If you forgot it, change <code className="rounded bg-earth-100 px-1 py-0.5">ADMIN_PASSWORD</code>{' '}
                      and redeploy — there&apos;s no reset email.
                    </li>
                  </ul>
                </details>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
