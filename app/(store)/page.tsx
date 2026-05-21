import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/store/HeroSection'
import { TrustStrip } from '@/components/store/TrustStrip'
import { FeaturedCollections } from '@/components/store/FeaturedCollections'
import { CategoryBrowse } from '@/components/store/CategoryBrowse'
import { CookTonight } from '@/components/store/CookTonight'
import { BrandStory, RecipeInspo, Testimonials } from '@/components/store/BrandStory'
import { ProductShowcase } from '@/components/store/ProductShowcase'
import { VisitSection } from '@/components/store/VisitSection'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { fetchHomepageProducts } from '@/lib/supabase/products'

export default async function Home() {
  const { bestSellers, categoryCount, errorMessage } = await fetchHomepageProducts()

  const topCategories = PRODUCT_CATEGORIES.filter((c) => (categoryCount[c] ?? 0) > 0).slice(0, 8)
  const displayCategories = topCategories.length > 0 ? topCategories : PRODUCT_CATEGORIES.slice(0, 8)

  return (
    <>
      <HeroSection />
      <CategoryBrowse displayCategories={displayCategories} categoryCount={categoryCount} />
      <ProductShowcase
        eyebrow="Best sellers"
        title="Fresh picks from our shelves"
        subtitle="Popular staples our customers reach for every week."
        products={bestSellers}
        errorMessage={errorMessage}
      />
      <TrustStrip />
      <FeaturedCollections />
      <CookTonight />
      <BrandStory />
      <RecipeInspo />
      <Testimonials />
      <VisitSection />
    </>
  )
}
