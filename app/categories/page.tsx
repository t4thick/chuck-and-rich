import Link from 'next/link'
import Image from 'next/image'
import { fetchHomepageProducts } from '@/lib/supabase/products'

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

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const { categoryCount } = await fetchHomepageProducts()

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <div className="border-b border-[#0f3d2e]/20 bg-[#0f3d2e]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b400]">Browse</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="mt-1 text-sm text-white/85">Pantry staples, proteins, produce, and more.</p>
        </div>
      </div>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3d2e] shadow-sm transition hover:border-[#0f3d2e]/30 hover:shadow-md"
            >
              View all products
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
    </main>
  )
}
