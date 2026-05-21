import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-brand-950 text-stone-300">
      <div className="store-container py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-white">{STORE.shortName}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-400">{STORE.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Visit us</p>
            <p className="mt-3 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden />
              <span>{STORE.address}</span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-brand-400" aria-hidden />
              <a href={STORE.phoneHref} className="text-stone-200 no-underline hover:text-white">
                {STORE.phone}
              </a>
            </p>
            <p className="mt-2 text-sm text-stone-500">{STORE.hours}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-stone-300 no-underline hover:text-white">
                  Shop all products
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-stone-300 no-underline hover:text-white">
                  Track your order
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-stone-300 no-underline hover:text-white">
                  My account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE.name}. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="text-stone-400 no-underline hover:text-stone-200">
              Privacy
            </Link>
            <Link href="/terms" className="text-stone-400 no-underline hover:text-stone-200">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
