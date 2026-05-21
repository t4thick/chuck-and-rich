import { HeroSection } from '@/components/store/HeroSection'
import { TrustStrip } from '@/components/store/TrustStrip'
import { CategoryBrowse } from '@/components/store/CategoryBrowse'
import { FeaturedCollections } from '@/components/store/FeaturedCollections'
import { ProductShowcase } from '@/components/store/ProductShowcase'
import { RecentlyViewed } from '@/components/store/RecentlyViewed'
import { VisitSection } from '@/components/store/VisitSection'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { fetchHomepageProducts } from '@/lib/supabase/products'

export default async function Home() {
  const { bestSellers, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 10)
  const displayCategories =
    topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 10)

  // Split the 16 fetched products into two non-overlapping groups so both
  // showcase sections display distinct products. "Trending" shows the 8 newest;
  // "New arrivals" shows the next 8 (different products, not a reversed duplicate).
  const trending = bestSellers.slice(0, 8)
  const newArrivals = bestSellers.slice(8, 16)

  return (
    <>
      <HeroSection />
      <CategoryBrowse displayCategories={displayCategories} categoryCount={categoryCount} />
      <ProductShowcase
        title="Trending this week"
        subtitle="What customers are buying right now."
        products={trending}
        errorMessage={errorMessage}
        priorityCount={4}
      />
      <FeaturedCollections />
      <ProductShowcase
        title="New arrivals"
        subtitle="Latest products added to inventory."
        products={newArrivals}
        errorMessage={errorMessage}
      />
      <RecentlyViewed />
      <TrustStrip />
      <VisitSection />
    </>
  )
}
