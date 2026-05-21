import { CreditCard, MapPin, RotateCcw, Truck } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Free pickup',
    desc: 'Same-day pickup at our Columbus store.',
  },
  {
    icon: MapPin,
    title: 'Local delivery',
    desc: 'Door-to-door delivery in the Columbus metro.',
  },
  {
    icon: CreditCard,
    title: 'Secure checkout',
    desc: 'Powered by Stripe. All major cards accepted.',
  },
  {
    icon: RotateCcw,
    title: 'Easy returns',
    desc: 'No-hassle returns on eligible items within 7 days.',
  },
] as const

export function TrustStrip() {
  return (
    <section className="border-y border-earth-200 bg-earth-50 py-10 sm:py-12">
      <div className="store-container">
        <ul className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-earth-200 bg-white text-brand-700">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-earth-900">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-earth-600">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-earth-200 pt-6 text-xs text-earth-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden />
            {STORE.address}
          </span>
          <a
            href={STORE.phoneHref}
            className="font-medium text-brand-700 no-underline hover:text-brand-800"
          >
            {STORE.phone}
          </a>
          <span className="text-earth-500">{STORE.hours}</span>
        </div>
      </div>
    </section>
  )
}
