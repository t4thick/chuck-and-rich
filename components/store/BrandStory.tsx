import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Quote, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants/collections'
import { RevealOnScroll } from '@/components/store/RevealOnScroll'

export function BrandStory() {
  return (
    <section className="page-section kente-band relative overflow-hidden bg-sand">
      <div
        className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand-200/30 blur-3xl"
        aria-hidden
      />
      <div className="store-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <RevealOnScroll>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-earth-200 shadow-[var(--shadow-premium)] sm:aspect-[5/4]">
                <Image
                  src="https://asafointernational.com/wp-content/uploads/2025/01/Carribean-Display-min-420x420.png"
                  alt="African and Caribbean grocery display"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/55 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/40 bg-white/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-sm">
                  <p className="flex items-center gap-2 text-sm font-semibold text-earth-900">
                    <Heart className="h-4 w-4 fill-current text-accent-500" aria-hidden />
                    Family-owned · Columbus, OH
                  </p>
                </div>
              </div>
              <div
                className="animate-float absolute -right-4 -top-4 hidden rounded-xl border border-earth-200 bg-white px-4 py-3 shadow-[var(--shadow-float)] sm:block"
                style={{ animationDelay: '-2s' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                  Est. 2024
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold text-earth-900">
                  Made with care
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div>
              <p className="section-eyebrow">Our story</p>
              <h2 className="section-title mt-3 text-balance">
                A neighborhood market with a premium heart
              </h2>
              <p className="mt-6 text-base leading-relaxed text-earth-700 sm:text-lg">
                Lovely Queen started with one promise: diaspora families should never struggle to
                find the ingredients that taste like home. We&apos;re not a faceless marketplace —
                we&apos;re your community grocer, online and in-store.
              </p>
              <p className="mt-4 text-base leading-relaxed text-earth-600">
                From West African spices to Caribbean staples, frozen fish to beauty essentials — we
                curate with care so every order feels personal, warm, and trustworthy.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-earth-200/80 py-6">
                <div>
                  <p className="font-display text-2xl font-semibold text-brand-700">170+</p>
                  <p className="mt-1 text-xs text-earth-600">Products curated</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-brand-700">14</p>
                  <p className="mt-1 text-xs text-earth-600">Departments stocked</p>
                </div>
              </div>

              <Link
                href="/shop"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 no-underline hover:text-brand-800"
              >
                Meet our shelves
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
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
            <p className="section-eyebrow justify-center">Community love</p>
            <h2 className="section-title mt-3 text-balance">Trusted by Columbus families</h2>
            <p className="section-subtitle mx-auto">
              Groceries are emotional — our customers cook memories, celebrations, and comfort.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 100}>
              <blockquote className="premium-card premium-card-hover relative h-full p-7">
                <Quote
                  className="absolute right-5 top-5 h-8 w-8 text-brand-100"
                  aria-hidden
                />
                <div className="flex gap-0.5 text-gold-500" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-earth-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-earth-100 pt-4 text-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 font-display text-base font-semibold text-brand-700">
                    {t.name
                      .split(' ')
                      .map((s) => s[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <span>
                    <cite className="block not-italic font-semibold text-earth-900">{t.name}</cite>
                    <span className="text-xs text-earth-500">{t.location}</span>
                  </span>
                </footer>
              </blockquote>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
