'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function ShopSearchBar({ className, compact }: { className?: string; compact?: boolean }) {
  const router = useRouter()
  const [q, setQ] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = q.trim()
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop')
  }

  return (
    <form onSubmit={submit} className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
      <Input
        type="search"
        placeholder={compact ? 'Search…' : 'Search spices, rice, snacks…'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className={cn('rounded-xl border-earth-200 bg-white pl-9 shadow-sm focus-visible:ring-brand-500/25', compact ? 'h-9 text-sm' : 'h-11')}
      />
    </form>
  )
}
