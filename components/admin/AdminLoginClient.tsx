'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
  const [mode, setMode] = useState<'staff' | 'supabase'>('staff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    } else {
      const data = await res.json().catch(() => ({}))
      const msg =
        res.status === 503
          ? typeof data.error === 'string'
            ? `${data.error} If this is a Preview deployment, add ADMIN_PASSWORD for the Preview environment in Vercel.`
            : 'Admin login is not configured on this deployment.'
          : typeof data.error === 'string'
            ? data.error
            : 'Invalid password.'
      setError(msg)
    }
  }

  return (
    <div className="page-section">
      <div className="auth-card">
        <h1 className="text-2xl">Staff admin</h1>
        <p className="muted mt-2">
          Bookmark <strong>/admin/login</strong>. Sign in with your deployment&apos;s staff password.
        </p>

        {forbidden && (
          <p className="error mt-4">
            {allowSupabaseAdmin
              ? 'Access denied. Enter the correct staff password or use an authorized Supabase admin account.'
              : 'Access denied. Staff password only — sign in below.'}
          </p>
        )}

        {!allowSupabaseAdmin && (
          <p className="muted mt-4 rounded-lg bg-stone-50 p-3 text-xs">
            Supabase admin bypass is disabled. Emergency only: set{' '}
            <code className="rounded bg-stone-200 px-1">ADMIN_ALLOW_SUPABASE_ROLE=1</code> on the server.
          </p>
        )}

        {allowSupabaseAdmin && (
          <div className="mt-4 flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={mode === 'staff'} onChange={() => setMode('staff')} />
              Staff password
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={mode === 'supabase'} onChange={() => setMode('supabase')} />
              Supabase admin
            </label>
          </div>
        )}

        {allowSupabaseAdmin && mode === 'supabase' ? (
          <form onSubmit={handleSupabase} className="mt-6 space-y-4">
            <div>
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
            <div>
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
            {error && <p className="error">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleStaffPassword} className="mt-6 space-y-4">
            <div>
              <label htmlFor="staff-pass" className="form-label">
                Staff password
              </label>
              <Input
                id="staff-pass"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}
