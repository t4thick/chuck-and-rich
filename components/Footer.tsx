import Link from 'next/link'
import { Lock, MapPin, Phone, ShieldCheck, Store } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-earth-200 bg-sand">
      <div className="store-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-white">
                <Store className="h-5 w-5" aria-hidden />
              </span>
              <p className="font-display text-xl font-bold text-earth-950">{STORE.shortName}</p>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-earth-600">
              {STORE.tagline}. Bringing authentic African flavors to families across America — with
              the warmth of a neighborhood market and the polish of modern e-commerce.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-earth-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-600" /> Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-brand-600" /> Stripe payments
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-earth-500">Visit us</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-earth-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              <span>{STORE.address}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              <a href={STORE.phoneHref} className="font-medium text-brand-800 no-underline hover:text-brand-950">
                {STORE.phone}
              </a>
            </p>
            <p className="mt-2 text-sm text-earth-500">{STORE.hours}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-earth-500">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="text-earth-700 no-underline hover:text-brand-800">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Spices" className="text-earth-700 no-underline hover:text-brand-800">
                  Spices
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Flours%20%26%20Rice" className="text-earth-700 no-underline hover:text-brand-800">
                  Rice & grains
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-earth-700 no-underline hover:text-brand-800">
                  Track order
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-earth-700 no-underline hover:text-brand-800">
                  My account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-earth-200 pt-8 text-xs text-earth-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p className="flex gap-5">
            <Link href="/privacy" className="text-earth-600 no-underline hover:text-earth-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-earth-600 no-underline hover:text-earth-900">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
