import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { HomeHero } from '@/components/HomeHero'
import type { Product } from '@/types'

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

const TRUST_POINTS = [
  {
    title: 'Fast, Tracked Delivery',
    subtitle: 'Real-time status updates from ordered to delivered.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: 'Authentically Sourced',
    subtitle: 'Every product chosen for genuine African & Caribbean flavour.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    title: 'Secure Checkout',
    subtitle: 'Clear pricing, safe payment, and transparent shipping costs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Responsive Support',
    subtitle: 'Questions about your order? We respond quickly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
]

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
    <main className="bg-[#f8f8f6]">

      <HomeHero />

      {/* Trust strip */}
      <section className="bg-[#f8f8f6] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_POINTS.map((item) => (
            <div key={item.title} className="bg-white px-6 py-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#1a4731]/10 text-[#236641] flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category — full grid (production) */}
      <section id="categories" className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-widest mb-1.5">Browse</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#236641] hover:text-[#1a4731] transition-colors hidden sm:inline-flex items-center gap-1">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {categoryCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categoryCards.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 aspect-[4/3] shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute left-4 right-4 bottom-4">
                  <p className="text-white font-semibold leading-tight">{cat.name}</p>
                  <p className="text-white/80 text-sm mt-1">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      {featured && featured.length > 0 && (
        <section className="bg-[#0d3d2f] border-y border-emerald-950/40 py-16">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1.5">Handpicked</p>
                <h2 className="text-3xl font-bold text-white tracking-tight">Best Sellers</h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-white/85 hover:text-white transition-colors hidden sm:inline-flex items-center gap-1">
                See all
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Delivery banner */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="rounded-3xl bg-white text-gray-900 overflow-hidden border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="px-8 py-10 lg:px-12 lg:py-12">
              <p className="text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3">Delivery Promise</p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-snug">
                Transparent shipping.<br />Real-time updates.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
                See exact shipping fees at checkout. Track every step from order placed to your front door.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-2 bg-[#1a4731] hover:bg-[#236641] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Checkout Now
                </Link>
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#1a4731]/40 text-gray-700 hover:text-[#1a4731] font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Track an Order
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center bg-[#f8f8f6] px-10 py-10">
              <div className="space-y-3 w-full max-w-xs">
                {['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${i <= 1 ? 'bg-[#1a4731] border-[#1a4731] text-white' : 'border-gray-300 text-gray-400'}`}>
                      {i <= 1 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : (i + 1)}
                    </div>
                    <span className={`text-sm font-medium ${i <= 1 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-8">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-widest mb-1.5">Help</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-200 p-6 bg-[#fafaf8]">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0d3d2f] border-t border-emerald-950/40">
        <div className="max-w-6xl mx-auto px-5 py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            New arrivals every week
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-md mx-auto leading-relaxed">
            Fresh foods, beverages, spices, and pantry staples — added regularly.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg active:scale-95"
          >
            Explore the Store
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

    </main>
  )
}
