import Link from 'next/link'
import { Lock, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-earth-200 bg-earth-950 text-stone-300">
      <div className="store-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-bold text-white">{STORE.shortName}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
              {STORE.tagline}. Bringing authentic African flavors to families across America —
              with the warmth of a neighborhood market and the polish of modern e-commerce.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold-500" /> Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-gold-500" /> Stripe payments
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Visit us</p>
            <p className="mt-4 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden />
              <span>{STORE.address}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-gold-500" aria-hidden />
              <a href={STORE.phoneHref} className="text-stone-200 no-underline hover:text-white">
                {STORE.phone}
              </a>
            </p>
            <p className="mt-2 text-sm text-stone-500">{STORE.hours}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="text-stone-300 no-underline hover:text-white">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Spices" className="text-stone-300 no-underline hover:text-white">
                  Spices
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Flours%20%26%20Rice" className="text-stone-300 no-underline hover:text-white">
                  Rice & grains
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-stone-300 no-underline hover:text-white">
                  Track order
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

        <div className="mt-12 flex flex-col gap-3 border-t border-earth-800 pt-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p className="flex gap-5">
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
