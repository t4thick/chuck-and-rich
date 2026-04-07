import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { HomeHero } from '@/components/HomeHero'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import type { Product } from '@/types'

/** Category hero images — same store photography as before */
const CATEGORY_IMAGE_BY_NAME: Record<string, string> = {
  Beverages:           'https://asafointernational.com/wp-content/uploads/2025/01/Beverages-2-min.jpg',
  Bread:               'https://asafointernational.com/wp-content/uploads/2025/01/Bread-Display-1.png',
  Canned:              'https://asafointernational.com/wp-content/uploads/2025/01/Motherland-canned-images.jpeg',
  'Caribbean product': 'https://asafointernational.com/wp-content/uploads/2025/01/Carribean-Display-min.png',
  Cosmetics:           'https://asafointernational.com/wp-content/uploads/2025/01/cosmetics.jpeg',
  'Dairy And Tea':     'https://asafointernational.com/wp-content/uploads/2025/01/asafo-international-Diary.jpeg',
  'Flours & Rice':     'https://asafointernational.com/wp-content/uploads/2025/01/Rice-and-Flour-Display.png',
  'Fresh Produce':     'https://asafointernational.com/wp-content/uploads/2025/01/yam-display.jpg',
  'Frozen foods':      'https://asafointernational.com/wp-content/uploads/2025/01/Frozen-Foods-min.jpg',
  'Meat and Seafood':  'https://asafointernational.com/wp-content/uploads/2025/01/meat.jpeg',
  Motherland:          'https://asafointernational.com/wp-content/uploads/2025/01/Motherland-Product-display.jpg',
  'Non food':          'https://asafointernational.com/wp-content/uploads/2025/02/Non-Food.jpg',
  Snack:               'https://asafointernational.com/wp-content/uploads/2024/10/Asafo-International-Snacks.jpg',
  Spices:              'https://asafointernational.com/wp-content/uploads/2024/11/42-tm_home_default.png',
}

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

  const { data: productCategories } = await supabase
    .from('products')
    .select('category')
    .eq('in_stock', true)

  const categoryCount = (productCategories ?? []).reduce<Record<string, number>>((acc, row) => {
    const name = row.category?.trim()
    if (!name) return acc
    acc[name] = (acc[name] ?? 0) + 1
    return acc
  }, {})

  const categoryCards = Object.keys(CATEGORY_IMAGE_BY_NAME)
    .filter((name) => categoryCount[name] > 0)
    .map((name) => ({
      name,
      count: categoryCount[name],
      image: CATEGORY_IMAGE_BY_NAME[name],
    }))

  return (
    <main className="min-h-screen bg-[#fcfbf7] text-neutral-900">
      <HomeHero />

      {/* Working search from homepage */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Search the store</p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Quick jump — complements hero CTAs */}
      <section className="border-b border-neutral-200/80 bg-[#fcfbf7]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 py-6 lg:px-8">
          <a
            href="#products"
            className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Shop Best Sellers
          </a>
          <a
            href="#categories"
            className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-emerald-600 hover:text-emerald-800"
          >
            Browse Categories
          </a>
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

        {categoryCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryCards.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition-shadow hover:shadow-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-semibold leading-tight text-white">{cat.name}</p>
                  <p className="mt-1 text-sm text-white/85">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-10 text-center text-neutral-600">
            Categories will appear here once products are in stock.{' '}
            <Link href="/shop" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Browse the shop
            </Link>
          </p>
        )}
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
