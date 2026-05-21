import { HeroSection } from '@/components/store/HeroSection'
import { TrustStrip } from '@/components/store/TrustStrip'
import { CategoryBrowse } from '@/components/store/CategoryBrowse'
import { BrandStory } from '@/components/store/BrandStory'
import { ProductShowcase } from '@/components/store/ProductShowcase'
import { VisitSection } from '@/components/store/VisitSection'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { fetchHomepageProducts } from '@/lib/supabase/products'

export default async function Home() {
  const { bestSellers, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 10)
  const displayCategories = topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 10)

  return (
    <>
      <HeroSection />
      <CategoryBrowse displayCategories={displayCategories} categoryCount={categoryCount} />
      <ProductShowcase
        eyebrow="Popular items"
        title="Shop our best sellers"
        subtitle="Customer favorites from spices, rice, beverages, and more."
        products={bestSellers}
        errorMessage={errorMessage}
      />
      <TrustStrip />
      <BrandStory />
      <VisitSection />
    </>
  )
}
