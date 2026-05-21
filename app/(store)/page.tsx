import { HeroSection } from '@/components/store/HeroSection'
import { TrustStrip } from '@/components/store/TrustStrip'
import { CategoryBrowse } from '@/components/store/CategoryBrowse'
import { ShopByCountry } from '@/components/store/ShopByCountry'
import { CookTonight } from '@/components/store/CookTonight'
import { FeaturedCollections } from '@/components/store/FeaturedCollections'
import { BrandStory, Testimonials } from '@/components/store/BrandStory'
import { ProductShowcase } from '@/components/store/ProductShowcase'
import { VisitSection } from '@/components/store/VisitSection'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { fetchHomepageProducts } from '@/lib/supabase/products'

export default async function Home() {
  const { bestSellers, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 10)
  const displayCategories = topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 10)

  const trending = bestSellers.slice(0, 8)
  const newArrivals = [...bestSellers].reverse().slice(0, 8)

  return (
    <>
      <HeroSection />
      <CategoryBrowse displayCategories={displayCategories} categoryCount={categoryCount} />
      <ShopByCountry />
      <CookTonight />
      <ProductShowcase
        eyebrow="Trending this week"
        title="What customers are buying"
        subtitle="Fresh picks across spices, rice, beverages, and beauty — updated from live inventory."
        products={trending}
        errorMessage={errorMessage}
      />
      <FeaturedCollections />
      <ProductShowcase
        eyebrow="New arrivals"
        title="Just restocked"
        subtitle="Latest additions to our shelves — discover something new for your next meal."
        products={newArrivals}
        errorMessage={errorMessage}
      />
      <TrustStrip />
      <BrandStory />
      <Testimonials />
      <VisitSection />
    </>
  )
}
