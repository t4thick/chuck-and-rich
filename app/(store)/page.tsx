import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/store/HeroSection'
import { TrustStrip } from '@/components/store/TrustStrip'
import { FeaturedCollections } from '@/components/store/FeaturedCollections'
import { CategoryBrowse } from '@/components/store/CategoryBrowse'
import { CookTonight } from '@/components/store/CookTonight'
import { BrandStory, RecipeInspo, Testimonials } from '@/components/store/BrandStory'
import { ProductShowcase } from '@/components/store/ProductShowcase'
import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { STORE } from '@/lib/constants/store'
import { fetchHomepageProducts } from '@/lib/supabase/products'

export default async function Home() {
  const { bestSellers, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 8)
  const displayCategories = topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 8)

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedCollections />
      <CategoryBrowse displayCategories={displayCategories} categoryCount={categoryCount} />
      <ProductShowcase
        eyebrow="Best sellers"
        title="Fresh picks from our shelves"
        subtitle="Popular staples our customers reach for every week."
        products={bestSellers}
        errorMessage={errorMessage}
      />
      <CookTonight />
      <BrandStory />
      <RecipeInspo />
      <Testimonials />

      <section className="page-section bg-brand-900">
        <div className="store-container text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Visit us</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-4xl">
            Your neighborhood African marketplace
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            {STORE.address} · {STORE.hours}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="no-underline">
              <Button size="lg" variant="accent" className="w-full sm:w-auto">
                Shop online
              </Button>
            </Link>
            <a href={STORE.phoneHref} className="no-underline">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              >
                Call {STORE.phone}
              </Button>
            </a>
          </div>
          <Link
            href="/track-order"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 no-underline hover:text-gold-500"
          >
            Track an order <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
