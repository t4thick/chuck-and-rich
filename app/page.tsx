import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { HomeHero } from '@/components/home/HomeHero'
import { ShopByCountry } from '@/components/home/ShopByCountry'
import { DealsSection } from '@/components/home/DealsSection'
import { TrustSection } from '@/components/home/TrustSection'
import { AccountCtaSection } from '@/components/home/AccountCtaSection'
import type { Product } from '@/types'

/** Store photography keyed by DB category name */
const CATEGORY_IMAGE_BY_NAME: Record<string, string> = {
  Beverages: 'https://asafointernational.com/wp-content/uploads/2025/01/Beverages-2-min.jpg',
  Bread: 'https://asafointernational.com/wp-content/uploads/2025/01/Bread-Display-1.png',
  Canned: 'https://asafointernational.com/wp-content/uploads/2025/01/Motherland-canned-images.jpeg',
  'Caribbean product': 'https://asafointernational.com/wp-content/uploads/2025/01/Carribean-Display-min.png',
  Cosmetics: 'https://asafointernational.com/wp-content/uploads/2025/01/cosmetics.jpeg',
  'Dairy And Tea': 'https://asafointernational.com/wp-content/uploads/2025/01/asafo-international-Diary.jpeg',
  'Flours & Rice': 'https://asafointernational.com/wp-content/uploads/2025/01/Rice-and-Flour-Display.png',
  'Fresh Produce': 'https://asafointernational.com/wp-content/uploads/2025/01/yam-display.jpg',
  'Frozen foods': 'https://asafointernational.com/wp-content/uploads/2025/01/Frozen-Foods-min.jpg',
  'Meat and Seafood': 'https://asafointernational.com/wp-content/uploads/2025/01/meat.jpeg',
  Motherland: 'https://asafointernational.com/wp-content/uploads/2025/01/Motherland-Product-display.jpg',
  'Non food': 'https://asafointernational.com/wp-content/uploads/2025/02/Non-Food.jpg',
  Snack: 'https://asafointernational.com/wp-content/uploads/2024/10/Asafo-International-Snacks.jpg',
  Spices: 'https://asafointernational.com/wp-content/uploads/2024/11/42-tm_home_default.png',
}

/** Homepage labels → shop URLs (display names may differ from DB category strings) */
const SHOWCASE_CATEGORIES: {
  label: string
  href: string
  imageKey: keyof typeof CATEGORY_IMAGE_BY_NAME
}[] = [
  { label: 'Rice', href: '/shop?category=' + encodeURIComponent('Flours & Rice'), imageKey: 'Flours & Rice' },
  { label: 'Spices', href: '/shop?category=Spices', imageKey: 'Spices' },
  { label: 'Oils', href: '/shop?q=' + encodeURIComponent('oil'), imageKey: 'Canned' },
  { label: 'Meat & Fish', href: '/shop?category=' + encodeURIComponent('Meat and Seafood'), imageKey: 'Meat and Seafood' },
  { label: 'Beauty', href: '/shop?category=Cosmetics', imageKey: 'Cosmetics' },
  { label: 'Fabrics', href: '/shop?category=' + encodeURIComponent('Non food'), imageKey: 'Non food' },
  { label: 'Frozen', href: '/shop?category=' + encodeURIComponent('Frozen foods'), imageKey: 'Frozen foods' },
  { label: 'Produce', href: '/shop?category=' + encodeURIComponent('Fresh Produce'), imageKey: 'Fresh Produce' },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .limit(12)

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

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-neutral-900">
      <HomeHero />

      <AccountCtaSection />

      <section id="categories" className="border-t border-neutral-200 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Browse</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Shop by category</h2>
              <p className="mt-2 max-w-xl text-neutral-600">Pantry staples, proteins, produce, and more.</p>
            </div>
            <Link
              href="/shop"
              className="hidden rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3d2e] shadow-sm transition hover:border-[#0f3d2e]/30 hover:shadow-md sm:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {SHOWCASE_CATEGORIES.map((cat) => {
              const src = CATEGORY_IMAGE_BY_NAME[cat.imageKey]
              const count = categoryCount[cat.imageKey] ?? 0
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <p className="text-base font-bold text-white drop-shadow md:text-lg">{cat.label}</p>
                    {count > 0 && <p className="mt-0.5 text-sm text-white/90">{count} products</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section id="best-sellers" className="border-t border-neutral-200 bg-[#f9f9f9] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f3d2e]">Popular now</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Best sellers</h2>
            </div>
            <Link
              href="/shop"
              className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3d2e] shadow-sm transition hover:shadow-md"
            >
              View all products
            </Link>
          </div>

          {bestSellers && bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
              {bestSellers.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center text-neutral-600">
              In-stock favorites will show here soon.{' '}
              <Link href="/shop" className="font-semibold text-[#0f3d2e] hover:underline">
                Browse the shop
              </Link>
            </p>
          )}
        </div>
      </section>

      <ShopByCountry />
      <DealsSection />
      <TrustSection />
    </main>
  )
}
