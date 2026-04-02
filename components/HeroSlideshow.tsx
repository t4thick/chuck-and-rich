'use client'

import { useState, useEffect, useRef } from 'react'

// Only your real high-res store photos (hero1 excluded per request)
const SLIDES = [
  { src: '/hero2.png', label: 'Authentic African Fabrics' },
  { src: '/hero3.png', label: 'Flours, Grains & Rice' },
  { src: '/hero4.png', label: 'Pantry & Grocery Essentials' },
  { src: '/hero5.png', label: 'Beverages & Frozen Foods' },
  { src: '/hero6.png', label: 'Your One-Stop African Market' },
]

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'entering'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function advance(to: number) {
    if (to === current || phase !== 'idle') return
    setNext(to)
    setPhase('entering')
    timerRef.current = setTimeout(() => {
      setCurrent(to)
      setNext(null)
      setPhase('idle')
    }, 900)
  }

  useEffect(() => {
    const id = setInterval(() => {
      advance((current + 1) % SLIDES.length)
    }, 5500)
    return () => {
      clearInterval(id)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase])

  return (
    <>
      {/* Current slide */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: phase === 'entering' ? 0 : 1, transition: 'opacity 900ms ease-in-out', zIndex: 1 }}
        aria-hidden="true"
      >
        <img
          key={`cur-${current}`}
          src={SLIDES[current].src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ imageRendering: 'auto' }}
          fetchPriority={current === 0 ? 'high' : 'low'}
        />
      </div>

      {/* Next slide (fades in on top) */}
      {next !== null && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: phase === 'entering' ? 1 : 0, transition: 'opacity 900ms ease-in-out', zIndex: 2 }}
          aria-hidden="true"
        >
          <img
            key={`nxt-${next}`}
            src={SLIDES[next].src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ imageRendering: 'auto' }}
            fetchPriority="high"
          />
        </div>
      )}

      {/* Cinematic gradient overlay — clear in middle, dark edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(8,24,14,0.85) 0%, rgba(8,24,14,0.45) 55%, rgba(8,24,14,0.2) 100%),
            linear-gradient(to bottom, rgba(8,24,14,0.4) 0%, transparent 30%, transparent 65%, rgba(8,24,14,0.6) 100%)
          `,
          zIndex: 3,
        }}
        aria-hidden="true"
      />

      {/* Slide label — bottom left */}
      <div className="absolute bottom-16 left-6 z-10 hidden sm:block">
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
          {SLIDES[current].label}
        </span>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => advance(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? 'bg-[#e8a020] w-8 h-2'
                : 'bg-white/35 hover:bg-white/65 w-2 h-2'
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 right-6 z-10 text-white/35 text-xs font-mono tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </>
  )
}
