import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants/collections'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function BrandStory() {
  return (
    <section className="page-section kente-band bg-sand">
      <div className="store-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-earth-200 shadow-[var(--shadow-premium)] sm:aspect-[5/4]">
              <Image
                src="https://asafointernational.com/wp-content/uploads/2025/01/Carribean-Display-min-420x420.png"
                alt="African and Caribbean grocery display"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/95 px-4 py-3 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-sm font-semibold text-earth-900">
                  <Heart className="h-4 w-4 text-accent-500" aria-hidden />
                  Family-owned · Columbus, OH
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div>
              <p className="section-eyebrow">Our story</p>
              <h2 className="section-title mt-2 text-balance">
                A neighborhood market with a premium heart
              </h2>
              <p className="mt-6 text-base leading-relaxed text-earth-700 sm:text-lg">
                Lovely Queen started with one promise: diaspora families should never struggle to
                find the ingredients that taste like home. We are not a faceless marketplace — we
                are your community grocer, online and in-store.
              </p>
              <p className="mt-4 text-base leading-relaxed text-earth-600">
                From West African spices to Caribbean staples, frozen fish to beauty essentials — we
                curate with care so every order feels personal, warm, and trustworthy.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 no-underline hover:text-brand-800"
              >
                Meet our shelves <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="page-section bg-white">
      <div className="store-container">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Community love</p>
            <h2 className="section-title mt-2">Trusted by Columbus families</h2>
            <p className="section-subtitle mx-auto">
              Groceries are emotional — our customers cook memories, celebrations, and comfort.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 80}>
              <blockquote className="premium-card premium-card-hover h-full p-6">
                <div className="flex gap-0.5 text-gold-500" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-earth-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 border-t border-earth-100 pt-4 text-sm">
                  <cite className="not-italic font-semibold text-earth-900">{t.name}</cite>
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
