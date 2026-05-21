'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = q.trim()
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop')
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="group flex items-center gap-2 rounded-xl border border-earth-200 bg-white p-1.5 shadow-[var(--shadow-card)] transition focus-within:border-brand-500 focus-within:shadow-[var(--shadow-card-hover)] focus-within:ring-4 focus-within:ring-brand-500/15"
    >
      <Search className="ml-2 h-5 w-5 shrink-0 text-earth-400" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for jollof rice, palm oil, plantain…"
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-earth-900 placeholder:text-earth-400 focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-800"
      >
        Search
      </button>
    </form>
  )
}
