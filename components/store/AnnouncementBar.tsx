'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const DISMISS_KEY = 'lq_bar_v1'

export function AnnouncementBar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') setHidden(true)
    } catch { /* ignore */ }
  }, [])

  function dismiss() {
    setHidden(true)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
  }

  if (hidden) return null

  return (
    <div className="relative bg-brand-700 py-2.5 text-center text-[13px] font-medium text-white">
      <span className="px-10">
        Free in-store pickup &middot; Same-day Columbus delivery &middot; Ships within 24h
      </span>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
