import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Star } from 'lucide-react'
import { RECIPE_INSPO, TESTIMONIALS } from '@/lib/constants/collections'

export function RecipeInspo() {
  return (
    <section className="page-section bg-white">
      <div className="store-container">
        <p className="section-eyebrow">From our kitchen</p>
        <h2 className="section-title mt-2">Recipe inspiration</h2>
        <p className="section-subtitle">
          Cook the dishes you grew up with — shop the ingredients right here.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {RECIPE_INSPO.map((recipe) => (
            <Link
              key={recipe.title}
              href={recipe.href}
              className="group overflow-hidden rounded-3xl border border-earth-200/80 bg-cream no-underline shadow-sm transition hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-brand-950">{recipe.title}</h3>
                <p className="mt-2 flex items-center gap-3 text-sm text-earth-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {recipe.time}
                  </span>
                  <span>{recipe.difficulty}</span>
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  Shop ingredients <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="page-section bg-brand-950 text-white">
      <div className="store-container">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Community love</p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">What our customers say</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="flex gap-0.5 text-gold-400" aria-label={`${t.rating} stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cream/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <cite className="not-italic font-semibold text-white">{t.name}</cite>
                <span className="text-cream/60"> · {t.location}</span>
              </footer>
            </blockquote>
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
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[var(--shadow-premium)] sm:aspect-square lg:aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80"
              alt="Fresh produce at a vibrant market"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="section-eyebrow">Our story</p>
            <h2 className="section-title mt-2">Bringing authentic African flavors to families across America</h2>
            <p className="mt-5 text-base leading-relaxed text-earth-700 sm:text-lg">
              Lovely Queen African Market started with a simple promise: make it easy for diaspora families
              to cook the meals they miss, with the same quality ingredients they trust back home.
            </p>
            <p className="mt-4 text-base leading-relaxed text-earth-600">
              From our Columbus storefront to your kitchen — we curate spices, grains, frozen specialties,
              and beauty essentials with care. This isn&apos;t a generic grocery site. It&apos;s your modern
              African marketplace.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 no-underline hover:text-brand-900"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
