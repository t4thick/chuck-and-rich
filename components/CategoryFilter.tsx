'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const CATEGORIES = [
  'Beverages',
  'Bread',
  'Canned',
  'Caribbean product',
  'Cosmetics',
  'Dairy And Tea',
  'Flours & Rice',
  'Fresh Produce',
  'Frozen foods',
  'Meat and Seafood',
  'Motherland',
  'Non food',
  'Snack',
  'Spices',
]

export function CategoryFilter({ active }: { active?: string }) {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  function buildUrl(category?: string) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    const qs = params.toString()
    return `/shop${qs ? '?' + qs : ''}`
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <Link
        href={buildUrl()}
        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors shadow-sm ${
          !active
            ? 'bg-[#1a4731] text-white border-[#1a4731]'
            : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a4731]/40 hover:text-[#1a4731]'
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((name) => (
        <Link
          key={name}
          href={buildUrl(name)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors shadow-sm ${
            active === name
              ? 'bg-[#1a4731] text-white border-[#1a4731]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a4731]/40 hover:text-[#1a4731]'
          }`}
        >
          {name}
        </Link>
      ))}
    </div>
  )
}
