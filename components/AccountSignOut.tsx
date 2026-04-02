'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AccountSignOut() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
