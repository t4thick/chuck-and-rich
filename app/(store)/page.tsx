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
  const { trending, newArrivals, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 10)
  const displayCategories =
    topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 10)

  return (
    <>
      <HeroSection />
      <CategoryBrowse displayCategories={displayCategories} categoryCount={categoryCount} />
      <ProductShowcase
        title="Trending this week"
        subtitle="Staples, produce, drinks & more — picked across departments."
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
