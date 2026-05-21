import Image from 'next/image'
import Link from 'next/link'
import { Clock, Package, Search, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchAutocomplete } from '@/components/store/SearchAutocomplete'

const QUICK_LINKS = [
  { label: 'Rice & Grains', href: '/shop?category=Rice%20%26%20Grains' },
  { label: 'Spices & Seasonings', href: '/shop?category=Spices%20%26%20Seasonings' },
  { label: 'Frozen', href: '/shop?category=Frozen' },
  { label: 'Beverages', href: '/shop?category=Beverages' },
  { label: 'Snacks', href: '/shop?category=Snacks' },
  { label: 'Beauty & Personal Care', href: '/shop?category=Beauty%20%26%20Personal%20Care' },
]

const HERO_STATS = [
  { icon: Package, label: '170+ products in stock' },
  { icon: Truck, label: 'Pickup & delivery in Columbus' },
  { icon: Clock, label: 'Ships within 24h' },
]

export function HeroSection() {
  return (
    <section className="hero-split" aria-label="Welcome to Lovely Queen Market">
      {/* Store photos — left groceries, right textiles */}
      <div className="hero-split__panel hero-split__panel--left" aria-hidden>
        <Image
          src="/images/hero/grocery-aisle.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 50vw, 42vw"
          className="object-cover object-[center_35%]"
          quality={90}
        />
        <div className="hero-split__panel-mask--left absolute inset-0" />
      </div>

      <div className="hero-split__panel hero-split__panel--right" aria-hidden>
        <Image
          src="/images/hero/textiles-aisle.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 50vw, 42vw"
          className="object-cover object-center"
          quality={90}
        />
        <div className="hero-split__panel-mask--right absolute inset-0" />
      </div>

      {/* Crisp white center column — linear gradient only, no blur */}
      <div className="hero-split__center-band" aria-hidden />

      <div className="hero-split__content store-container">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="section-eyebrow justify-center">Lovely Queen Market</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-earth-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            African &amp; Caribbean groceries,
            <br className="hidden sm:block" />
            <span className="text-brand-700"> delivered fast.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-earth-600 sm:text-lg">
            Search 170+ products across 14 departments. Pickup in Columbus or shipped to your door.
          </p>

          <div className="mx-auto mt-8 max-w-xl shadow-[0_8px_30px_rgb(0_0_0/0.06)]">
            <SearchAutocomplete placeholder="Search for jollof rice, palm oil, plantain…" />
          </div>

          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="no-underline">
              <Button size="lg" className="h-11 w-full px-8 sm:w-auto">
                Shop all products
              </Button>
            </Link>
            <Link href="/shop#categories" className="no-underline">
              <Button size="lg" variant="outline" className="h-11 w-full border-earth-300 bg-white px-8 sm:w-auto">
                Browse categories
              </Button>
            </Link>
          </div>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-earth-600 sm:text-sm">
            {HERO_STATS.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-earth-500">
              <Search className="h-3.5 w-3.5" aria-hidden />
              Popular
            </span>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-earth-200 bg-white px-3 py-1.5 text-xs font-medium text-earth-700 no-underline shadow-sm transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
