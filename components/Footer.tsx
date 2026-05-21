import Link from 'next/link'
import { Lock, MapPin, Phone, ShieldCheck, Store } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-800 bg-brand-800 text-white">
      <div className="store-container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                <Store className="h-5 w-5" aria-hidden />
              </span>
              <p className="font-display text-2xl font-bold">{STORE.shortName}</p>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              {STORE.tagline}. Authentic African and Caribbean groceries for families across
              Ohio — shop online or visit our store.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> Stripe payments
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Visit us</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/90">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{STORE.address}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <a href={STORE.phoneHref} className="font-medium text-white no-underline hover:underline">
                {STORE.phone}
              </a>
            </p>
            <p className="mt-2 text-sm text-white/70">{STORE.hours}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Quick links</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="text-white/90 no-underline hover:text-white">
                  Shop all products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Spices" className="text-white/90 no-underline hover:text-white">
                  Spices
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Flours%20%26%20Rice"
                  className="text-white/90 no-underline hover:text-white"
                >
                  Rice &amp; flour
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-white/90 no-underline hover:text-white">
                  Track order
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-white/90 no-underline hover:text-white">
                  My account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-8 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p className="flex gap-5">
            <Link href="/privacy" className="text-white/80 no-underline hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/80 no-underline hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
