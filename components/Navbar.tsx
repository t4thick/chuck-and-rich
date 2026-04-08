'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { NavbarAuth } from '@/components/NavbarAuth'
import { SearchBar } from '@/components/SearchBar'

function SearchFallback() {
  return <div className="h-10 w-full max-w-2xl rounded-xl border border-neutral-200 bg-neutral-100 animate-pulse" aria-hidden />
}

export function Navbar() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/90 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-2 md:h-16 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4 md:py-0">
        <Link href="/" className="col-start-1 row-start-1 flex shrink-0 items-center rounded-lg py-1">
          <Image
            src="/logo.png"
            alt="Lovely Queen African Market"
            width={160}
            height={48}
            className="h-8 w-auto object-contain md:h-9"
            priority
          />
        </Link>

        <div className="col-span-2 col-start-1 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1 md:px-2">
          <Suspense fallback={<SearchFallback />}>
            <SearchBar variant="compact" />
          </Suspense>
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-1 sm:gap-2">
          <Link
            href="/shop"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-[#0f3d2e] lg:inline-flex"
          >
            Shop
          </Link>
          <NavbarAuth variant="light" />
          <Link
            href="/cart"
            className="relative flex h-11 min-w-[44px] items-center justify-center rounded-xl text-neutral-800 transition hover:bg-neutral-100"
            aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f4b400] px-1 text-[10px] font-bold text-neutral-900">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-800 transition hover:bg-neutral-100 md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-neutral-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop all', href: '/shop' },
              { label: 'Categories', href: '/#categories' },
              { label: 'Track order', href: '/track-order' },
              { label: `Cart${totalItems > 0 ? ` (${totalItems})` : ''}`, href: '/cart' },
            ].map(({ label, href }) => (
              <Link
                key={href + label}
                href={href}
                onClick={() => setOpen(false)}
                className="min-h-[44px] rounded-xl px-3 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
