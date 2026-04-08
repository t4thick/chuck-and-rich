'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function SearchBar({
  defaultValue = '',
  variant = 'default',
}: {
  defaultValue?: string
  variant?: 'default' | 'compact'
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value.trim())
    } else {
      params.delete('q')
    }
    router.push(`/shop?${params.toString()}`)
  }

  function clearSearch() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/shop?${params.toString()}`)
  }

  const isCompact = variant === 'compact'

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.8} stroke="currentColor"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-400 ${
          isCompact ? 'left-3 h-4 w-4' : 'left-4 h-4.5 w-4.5'
        }`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search groceries, spices, brands…"
        className={`w-full rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm transition-shadow placeholder:text-neutral-400 focus:border-[#0f3d2e]/35 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/20 ${
          isCompact ? 'py-2.5 pl-10 pr-9 text-sm' : 'py-3 pl-11 pr-10 text-sm'
        }`}
      />

      {value && (
        <button
          type="button"
          onClick={clearSearch}
          className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 ${
            isCompact ? 'right-2.5' : 'right-3.5'
          }`}
          aria-label="Clear search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}
