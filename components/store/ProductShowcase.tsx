import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'
import type { Product } from '@/types'

type ProductShowcaseProps = {
  title: string
  subtitle: string
  products: Product[]
  errorMessage?: string | null
  eyebrow?: string
}

export function ProductShowcase({
  title,
  subtitle,
  products,
  errorMessage,
  eyebrow = 'In stock now',
}: ProductShowcaseProps) {
  return (
    <section className="page-section bg-sand">
      <div className="store-container">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">{eyebrow}</p>
              <h2 className="section-title mt-2">{title}</h2>
              <p className="section-subtitle">{subtitle}</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 no-underline hover:text-brand-900"
            >
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </RevealOnScroll>

        {errorMessage && (
          <p className="error mt-6">
            {errorMessage} <Link href="/">Reload</Link>
          </p>
        )}

        {products.length === 0 && !errorMessage ? (
          <div className="mt-12 rounded-3xl border border-dashed border-earth-300 bg-white px-6 py-16 text-center">
            <p className="text-earth-700">New products arriving soon.</p>
            <Link href="/shop" className="mt-4 inline-block no-underline">
              <Button variant="outline">Browse shop</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {products.map((product, i) => (
              <RevealOnScroll key={product.id} delay={Math.min(i * 60, 300)} className="h-full">
                <ProductCard product={product} />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
