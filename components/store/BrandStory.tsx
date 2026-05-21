import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBasket, Star } from 'lucide-react'
import { RECIPE_INSPO, TESTIMONIALS } from '@/lib/constants/collections'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function RecipeInspo() {
  return (
    <section className="page-section bg-white">
      <div className="store-container">
        <RevealOnScroll>
          <p className="section-eyebrow">Shop by meal</p>
          <h2 className="section-title mt-2">Ingredient staples</h2>
          <p className="section-subtitle">
            We sell groceries you cook at home — not prepared meals. Shop rice, spices, oils & more.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {RECIPE_INSPO.map((recipe, i) => (
            <RevealOnScroll key={recipe.title} delay={i * 80}>
              <Link
                href={recipe.href}
                className="group premium-card premium-card-hover block no-underline"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-earth-950">{recipe.title}</h3>
                  <p className="mt-2 text-sm text-earth-600">
                    {recipe.time} · {recipe.difficulty}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Shop ingredients <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="page-section bg-sand">
      <div className="store-container">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Community love</p>
            <h2 className="section-title mt-2">What our customers say</h2>
            <p className="section-subtitle mx-auto">
              Real families across Columbus trust us for the ingredients that taste like home.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 80}>
              <blockquote className="premium-card h-full p-6">
                <div className="flex gap-0.5 text-gold-500" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-earth-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 border-t border-earth-100 pt-4 text-sm">
                  <cite className="not-italic font-semibold text-earth-950">{t.name}</cite>
                  <span className="text-earth-500"> · {t.location}</span>
                </footer>
              </blockquote>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BrandStory() {
  return (
    <section className="page-section overflow-hidden bg-cream">
      <div className="store-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-float)] sm:aspect-square lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80"
                alt="Fresh produce at a vibrant market"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <div>
              <p className="section-eyebrow">Our story</p>
              <h2 className="section-title mt-2 text-balance">
                Bringing authentic African flavors to families across America
              </h2>
              <p className="mt-6 text-base leading-relaxed text-earth-700 sm:text-lg">
                Lovely Queen African Market started with a simple promise: make it easy for diaspora
                families to cook the meals they miss, with the same quality ingredients they trust
                back home.
              </p>
              <p className="mt-4 text-base leading-relaxed text-earth-600">
                From our Columbus storefront to your kitchen — we curate spices, grains, frozen
                specialties, and beauty essentials with care. Family-owned, community-first, and
                built for the modern shopper.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Family-owned', 'Authentic imports', 'Columbus, OH'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-earth-200 bg-white px-4 py-2 text-xs font-semibold text-earth-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 no-underline hover:text-brand-900"
              >
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
