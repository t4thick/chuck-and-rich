import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/types'

const MARKETING_CATEGORIES = [
  {
    title: 'Rice & Grains',
    description:
      'Stock up on rice, beans, garri, and pantry staples for everyday meals.',
    image:
      'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Spices & Seasonings',
    description:
      'Bring bold flavor home with blends, seasoning cubes, dried peppers, and more.',
    image:
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Oils & Sauces',
    description: 'Essential cooking oils, tomato mixes, sauces, and soup bases.',
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Snacks & Drinks',
    description: 'Enjoy favorite treats, beverages, and everyday grocery extras.',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  },
] as const

const BENEFITS = [
  {
    title: 'Authentic African Groceries',
    text: 'Shop trusted pantry essentials, spices, and household favorites in one place.',
  },
  {
    title: 'Fast, Easy Ordering',
    text: 'A clean shopping experience that helps customers find products quickly and check out easily.',
  },
  {
    title: 'Built for Trust',
    text: 'Show clear pricing, secure checkout, and helpful support so customers feel confident buying from you.',
  },
] as const

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders are delivered within 2–7 business days depending on your location and chosen shipping method.',
  },
  {
    q: 'Can I track my order after checkout?',
    a: 'Yes. Sign in to your account to view live progress from ordered to delivered.',
  },
  {
    q: 'What if an item is damaged or missing?',
    a: 'Contact us within 48 hours of delivery and we will arrange a replacement or refund.',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .limit(8)

  return (
    <main className="min-h-screen bg-[#fcfbf7] text-neutral-900">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
            Your online African grocery store
          </p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            <span className="block">Authentic African groceries</span>
            <span className="block text-emerald-800">African staples &amp; pantry favorites —</span>
            <span className="block">delivered with convenience and care.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
            Discover pantry staples, rich seasonings, cooking oils, snacks, and household essentials for your favorite
            African meals.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#products"
              className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Shop Best Sellers
            </a>
            <a
              href="#categories"
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold transition hover:border-emerald-700 hover:text-emerald-700"
            >
              Browse Categories
            </a>
            <Link
              href="/shop"
              className="rounded-full border border-emerald-700 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              Shop All Products
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-neutral-600">Grocery essentials</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold">Fast</p>
              <p className="text-sm text-neutral-600">Simple ordering</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold">Trusted</p>
              <p className="text-sm text-neutral-600">Secure checkout</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-amber-200 blur-2xl" aria-hidden />
          <div className="absolute -bottom-8 right-8 h-28 w-28 rounded-full bg-emerald-200 blur-2xl" aria-hidden />
          <div className="relative aspect-[4/5] w-full max-h-[520px] overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl lg:max-h-none lg:min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80"
              alt="African grocery assortment"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Browse</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="mt-2 max-w-xl text-neutral-600">Everything you need for your kitchen</p>
          </div>
          <Link
            href="/shop"
            className="hidden rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-700 sm:inline-flex"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {MARKETING_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{category.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{category.description}</p>
                <Link
                  href="/shop"
                  className="mt-5 inline-block text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Explore Category →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers — live products */}
      {featured && featured.length > 0 && (
        <section id="products" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Customer Favorites</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Best Sellers</h2>
            </div>
            <Link
              href="/shop"
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium transition hover:border-emerald-700 hover:text-emerald-700"
            >
              View All Products
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why us */}
      <section id="why-us" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Why Shop With Us</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">A grocery experience your customers can trust</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                <p className="mt-4 leading-7 text-neutral-600">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-200 bg-[#fcfbf7] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Help</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold leading-snug text-neutral-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="rounded-[2rem] bg-emerald-800 px-8 py-12 text-white md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Start Shopping</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight">
            Bring authentic flavors home with a grocery store made for African households and food lovers.
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-neutral-100"
            >
              Shop Now
            </Link>
            <Link
              href="#why-us"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
