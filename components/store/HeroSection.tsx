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
    <section className="overflow-hidden border-b border-earth-200" aria-label="Welcome to Lovely Queen Market">

      {/* ── MOBILE LAYOUT (hidden on sm+) ──────────────────────────────────── */}
      <div className="sm:hidden">

        {/* Real store photo strip */}
        <div className="relative flex h-[210px]" aria-hidden>
          <div className="relative flex-1 overflow-hidden">
            <Image
              src="/images/hero/grocery-aisle.png"
              alt=""
              fill
              priority
              sizes="50vw"
              quality={75}
              className="object-cover object-[center_30%]"
            />
          </div>
          <div className="relative flex-1 overflow-hidden">
            <Image
              src="/images/hero/textiles-aisle.png"
              alt=""
              fill
              priority
              sizes="50vw"
              quality={75}
              className="object-cover object-center"
            />
          </div>
          {/* Subtle center seam */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-px bg-white/60" />
          {/* Fade photo strip into white content area */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        </div>

        {/* Mobile content */}
        <div className="store-container pb-8 pt-0 text-center">
          <p className="section-eyebrow justify-center">Lovely Queen Market</p>
          <h1 className="mt-2 text-balance text-[1.875rem] font-semibold leading-[1.12] tracking-tight text-earth-900">
            African &amp; Caribbean groceries,{' '}
            <span className="text-brand-700">delivered fast.</span>
          </h1>
          <p className="mx-auto mt-2.5 text-sm leading-relaxed text-earth-600">
            Search 170+ products across 14 departments. Pickup in Columbus or shipped to your door.
          </p>

          {/* Search — full width */}
          <div className="mt-4 w-full">
            <SearchAutocomplete placeholder="Search for jollof rice, palm oil, plantain…" />
          </div>

          {/* CTA buttons — full width stacked */}
          <div className="mt-3 flex flex-col gap-2.5">
            <Link href="/shop" className="no-underline">
              <Button size="lg" className="h-12 w-full text-[15px] font-semibold">
                Shop all products
              </Button>
            </Link>
            <Link href="/shop#categories" className="no-underline">
              <Button size="lg" variant="outline" className="h-12 w-full border-earth-300 bg-white text-[15px]">
                Browse categories
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-earth-500">
            {HERO_STATS.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          {/* Horizontal-scroll category pills */}
          <div className="-mx-4 mt-5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-4 pb-2">
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-earth-400">
                <Search className="h-3 w-3" aria-hidden />
                Popular
              </span>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-full border border-earth-200 bg-white px-3.5 py-2 text-xs font-medium text-earth-700 no-underline shadow-sm transition-colors duration-150 active:bg-brand-50 active:text-brand-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (sm+, hidden on mobile) ─────────────────────────── */}
      <div className="hero-split hidden sm:block">
        <div className="hero-split__panel hero-split__panel--left" aria-hidden>
          <Image
            src="/images/hero/grocery-aisle.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 46vw, 42vw"
            quality={75}
            className="object-cover object-[center_35%]"
          />
          <div className="hero-split__panel-mask--left absolute inset-0" />
        </div>

        <div className="hero-split__panel hero-split__panel--right" aria-hidden>
          <Image
            src="/images/hero/textiles-aisle.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 46vw, 42vw"
            quality={75}
            className="object-cover object-center"
          />
          <div className="hero-split__panel-mask--right absolute inset-0" />
        </div>

        <div className="hero-split__center-band" aria-hidden />

        <div className="hero-split__content store-container">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="section-eyebrow justify-center">Lovely Queen Market</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-earth-900 lg:text-[3.25rem] lg:leading-[1.08]">
              African &amp; Caribbean groceries,
              <br />
              <span className="text-brand-700"> delivered fast.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-earth-600 sm:text-lg">
              Search 170+ products across 14 departments. Pickup in Columbus or shipped to your door.
            </p>

            <div className="mx-auto mt-8 max-w-xl shadow-[0_8px_30px_rgb(0_0_0/0.06)]">
              <SearchAutocomplete placeholder="Search for jollof rice, palm oil, plantain…" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Link href="/shop" className="no-underline">
                <Button size="lg" className="h-11 px-8">Shop all products</Button>
              </Link>
              <Link href="/shop#categories" className="no-underline">
                <Button size="lg" variant="outline" className="h-11 border-earth-300 bg-white px-8">
                  Browse categories
                </Button>
              </Link>
            </div>

            <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-earth-600">
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
      </div>
    </section>
  )
}
