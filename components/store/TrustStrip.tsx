import { Leaf, Lock, MapPin, Truck, Users } from 'lucide-react'
import { STORE } from '@/lib/constants/store'

const TRUST_ITEMS = [
  { icon: Leaf, title: 'Fresh African products', desc: 'Imports & local favorites' },
  { icon: Truck, title: 'Fast U.S. shipping', desc: 'Pickup in store available' },
  { icon: Lock, title: 'Secure payments', desc: 'Stripe-protected checkout' },
  { icon: Users, title: 'Family-owned', desc: 'Community at our core' },
] as const

export function TrustStrip() {
  return (
    <section className="border-b border-earth-200 bg-white">
      <div className="store-container py-8 lg:py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-earth-100 bg-cream/50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-brand-950">{title}</p>
                <p className="text-sm text-earth-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-center text-sm text-earth-500 sm:text-left">
          <MapPin className="inline h-4 w-4 text-gold-500" aria-hidden />
          <span>{STORE.address}</span>
          <span className="hidden sm:inline">·</span>
          <a href={STORE.phoneHref} className="font-medium text-brand-700 no-underline">
            {STORE.phone}
          </a>
        </p>
      </div>
    </section>
  )
}
