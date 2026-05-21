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
    <section className="page-section bg-white">
      <div className="store-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <RevealOnScroll>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-earth-200 shadow-[var(--shadow-card)]">
              <Image
                src="https://asafointernational.com/wp-content/uploads/2025/01/Rice-and-Flour-Display-420x420.png"
                alt="Rice and flour display"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <div>
              <p className="section-eyebrow">About us</p>
              <h2 className="section-title mt-2 text-balance">
                Quality, reliability, and customer satisfaction
              </h2>
              <p className="mt-5 text-base leading-relaxed text-earth-700">
                Lovely Queen African Market is your neighborhood source for West African and
                Caribbean groceries — the same categories and care you expect from a full-service
                international market.
              </p>
              <p className="mt-4 text-base leading-relaxed text-earth-600">
                Shop spices, rice, frozen fish, beverages, cosmetics, and fresh produce online or
                visit us in Columbus. Family-owned and built for diaspora families who cook at home.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-700 no-underline hover:text-brand-800"
              >
                Shop all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
