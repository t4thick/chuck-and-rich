import Link from 'next/link'
import { ArrowRight, MapPin, ShoppingBag, Truck } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { CATEGORY_ICONS, PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { STORE } from '@/lib/constants/store'
import { fetchHomepageProducts } from '@/lib/supabase/products'

export default async function Home() {
  const { bestSellers, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 8)
  const displayCategories = topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-500)_0%,_transparent_50%)] opacity-20" />
        <div className="store-container relative py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Columbus, Ohio · African & Caribbean market
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Groceries from home, delivered to your door
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              {STORE.tagline}. Shop spices, flours, frozen foods, beverages, and more — order online,
              pickup in store.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="no-underline">
                <Button size="lg" variant="accent" className="w-full gap-2 sm:w-auto">
                  <ShoppingBag className="h-5 w-5" />
                  Shop now
                </Button>
              </Link>
              <Link href="/track-order" className="no-underline">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  Track an order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-stone-200 bg-white">
        <div className="store-container grid gap-6 py-8 sm:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <MapPin className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-stone-900">Local Columbus store</p>
              <p className="text-sm text-stone-500">{STORE.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Truck className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-stone-900">Order online</p>
              <p className="text-sm text-stone-500">Pickup in store · shipping available</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-stone-900">Fresh imports</p>
              <p className="text-sm text-stone-500">Spices, produce, frozen & pantry staples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-section">
        <div className="store-container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl">Shop by category</h2>
              <p className="mt-1 text-stone-500">Browse our full African & Caribbean selection</p>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-900 sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
            {displayCategories.map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center rounded-2xl border border-stone-200/80 bg-white p-5 text-center shadow-[var(--shadow-card)] no-underline transition-all hover:border-brand-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="text-3xl" aria-hidden>
                  {CATEGORY_ICONS[cat] ?? '🛒'}
                </span>
                <span className="mt-3 line-clamp-2 text-sm font-semibold text-stone-800 group-hover:text-brand-800">
                  {cat}
                </span>
                {(categoryCount[cat] ?? 0) > 0 && (
                  <span className="mt-1 text-xs text-stone-400">{categoryCount[cat]} items</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-stone-200 bg-white page-section">
        <div className="store-container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl">New & in stock</h2>
              <p className="mt-1 text-stone-500">Fresh additions to our shelves</p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
            >
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {errorMessage && (
            <p className="error mb-6">
              {errorMessage}{' '}
              <Link href="/">Reload</Link>
            </p>
          )}

          {bestSellers.length === 0 && !errorMessage ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-cream px-6 py-12 text-center">
              <p className="text-stone-600">Products coming soon — check back shortly.</p>
              <Link href="/shop" className="mt-4 inline-block no-underline">
                <Button variant="outline">Browse shop</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="page-section">
        <div className="store-container">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 to-brand-950 px-8 py-12 text-center text-white sm:px-16">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Visit us on Dublin Granville Rd
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              {STORE.hours} · Call{' '}
              <a href={STORE.phoneHref} className="font-semibold text-white">
                {STORE.phone}
              </a>
            </p>
            <Link href="/shop" className="mt-6 inline-block no-underline">
              <Button size="lg" variant="accent">
                Start shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
