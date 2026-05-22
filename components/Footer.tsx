import Link from 'next/link'
import { Lock, MapPin, Phone, ShieldCheck, Store } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

const SHOP_LINKS = [
  { href: '/shop', label: 'All products' },
  { href: '/shop?category=Spices', label: 'Spices' },
  { href: '/shop?category=Flours%20%26%20Rice', label: 'Rice & flour' },
  { href: '/shop?category=Beverages', label: 'Beverages' },
  { href: '/shop?category=Frozen', label: 'Frozen' },
] as const

const ACCOUNT_LINKS = [
  { href: '/track-order', label: 'Track order' },
  { href: '/account', label: 'My account' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
] as const

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
] as const

export function Footer() {
  return (
    <footer className="mt-auto border-t border-earth-200 bg-white text-earth-700">
      <div className="store-container py-12 sm:py-14">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-white">
                <Store className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-base font-semibold text-earth-900">{STORE.shortName}</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-earth-600">
              African & Caribbean groceries shipped fast from Columbus, Ohio.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-earth-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-brand-600" /> Stripe
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-500">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-earth-700 no-underline hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-500">Account</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-earth-700 no-underline hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-500">Visit us</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-earth-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              <span>{STORE.address}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              <a
                href={STORE.phoneHref}
                className="font-medium text-earth-900 no-underline hover:text-brand-700"
              >
                {STORE.phone}
              </a>
            </p>
            <p className="mt-2 text-xs text-earth-500">{STORE.hours}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-earth-200 pt-6 text-xs text-earth-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p className="flex gap-5">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-earth-600 no-underline hover:text-earth-900"
              >
                {l.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
