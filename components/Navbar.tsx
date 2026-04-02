'use client'



import Link from 'next/link'

import Image from 'next/image'

import { useState } from 'react'

import { useCart } from '@/context/CartContext'

import { NavbarAuth } from '@/components/NavbarAuth'



export function Navbar() {

  const { totalItems } = useCart()

  const [open, setOpen] = useState(false)



  const navLink =

    'px-3 py-2 rounded-lg text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors'



  return (

    <header className="bg-[#0d3d2f] sticky top-0 z-50 border-b border-emerald-950/50">

      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">



        <Link href="/" className="flex items-center shrink-0 bg-white/95 rounded-md px-2 py-1">

          <Image

            src="/logo.png"

            alt="Lovely Queen African Market"

            width={160}

            height={48}

            className="h-9 w-auto object-contain"

            priority

          />

        </Link>



        <nav className="hidden md:flex items-center gap-1">

          <Link href="/" className={navLink}>

            Home

          </Link>

          <Link href="/shop" className={navLink}>

            Shop

          </Link>

          <Link href="/shop?category=Beverages" className={navLink}>

            Beverages

          </Link>

          <Link href="/shop?category=Flours%20%26%20Rice" className={navLink}>

            Flours &amp; Rice

          </Link>

          <Link href="/track-order" className={navLink}>

            Track Order

          </Link>

          <NavbarAuth variant="dark" />

        </nav>



        <div className="flex items-center gap-2">

          <Link

            href="/cart"

            className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 text-white transition-colors"

            aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}

          >

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">

              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />

            </svg>

            {totalItems > 0 && (

              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-0.5">

                {totalItems > 9 ? '9+' : totalItems}

              </span>

            )}

          </Link>



          <Link

            href="/shop"

            className="hidden md:inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"

          >

            Shop Now

          </Link>



          <button

            type="button"

            onClick={() => setOpen((o) => !o)}

            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 text-white transition-colors"

            aria-expanded={open}

            aria-label="Toggle menu"

          >

            {open ? (

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">

                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />

              </svg>

            ) : (

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">

                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />

              </svg>

            )}

          </button>

        </div>

      </div>



      {open && (

        <nav className="md:hidden border-t border-white/10 bg-[#0a3328] px-4 py-3 flex flex-col gap-0.5">

          {[

            { label: 'Home', href: '/' },

            { label: 'Shop All', href: '/shop' },

            { label: 'Beverages', href: '/shop?category=Beverages' },

            { label: 'Flours & Rice', href: '/shop?category=Flours%20%26%20Rice' },

            { label: 'Meat & Seafood', href: '/shop?category=Meat%20and%20Seafood' },

            { label: 'Track Order', href: '/track-order' },

            { label: 'Account / Sign in', href: '/account' },

            { label: `Cart${totalItems > 0 ? ` (${totalItems})` : ''}`, href: '/cart' },

          ].map(({ label, href }) => (

            <Link

              key={href}

              href={href}

              onClick={() => setOpen(false)}

              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-3 rounded-lg text-sm font-medium transition-colors"

            >

              {label}

            </Link>

          ))}

        </nav>

      )}

    </header>

  )

}

