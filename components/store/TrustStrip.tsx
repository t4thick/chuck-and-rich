import { Award, Leaf, Lock, MapPin, Truck, Users } from 'lucide-react'
import { STORE } from '@/lib/constants/store'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

const TRUST_ITEMS = [
  {
    icon: Users,
    title: 'Family-owned heritage',
    desc: 'A Columbus market built by and for diaspora families who cook with pride.',
  },
  {
    icon: Leaf,
    title: 'Authentic sourcing',
    desc: 'West African & Caribbean imports, frozen specialties, and trusted local favorites.',
  },
  {
    icon: Truck,
    title: 'Pickup & delivery',
    desc: 'Order online, collect in store, or get groceries delivered to your door.',
  },
  {
    icon: Lock,
    title: 'Secure payments',
    desc: 'Stripe-protected checkout — shop with confidence every time.',
  },
] as const

export function TrustStrip() {
  return (
    <section className="page-section relative overflow-hidden bg-sage">
      <div className="kente-overlay absolute inset-0 opacity-30" aria-hidden />
      <div className="store-container relative">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow justify-center">Why Lovely Queen</p>
            <h2 className="section-title mt-3 text-balance">Groceries you can trust</h2>
            <p className="section-subtitle mx-auto">
              We&apos;re not a generic marketplace — we&apos;re your neighborhood African grocery
              with real people behind every order.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <RevealOnScroll key={title} delay={i * 90} className="h-full">
              <div className="group premium-card premium-card-hover h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white shadow-[var(--shadow-elev)] transition duration-500 group-hover:rotate-6 group-hover:scale-105">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-5 font-display text-lg font-semibold text-earth-900">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-earth-600">{desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={300}>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-earth-200/80 bg-white/95 px-6 py-5 shadow-[var(--shadow-card)] backdrop-blur-md sm:flex-row">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-earth-600 sm:justify-start">
              <MapPin className="inline h-4 w-4 text-brand-600" aria-hidden />
              <span>{STORE.address}</span>
              <span className="hidden sm:inline">·</span>
              <a href={STORE.phoneHref} className="font-semibold text-brand-700 no-underline">
                {STORE.phone}
              </a>
            </p>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth-500">
              <Award className="h-4 w-4 text-gold-500" aria-hidden />
              Serving Columbus since day one
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
