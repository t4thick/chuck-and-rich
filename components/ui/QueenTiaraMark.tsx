import { cn } from '@/lib/utils'

type QueenTiaraMarkProps = {
  className?: string
  /** Unique prefix for SVG defs when multiple marks render on one page. */
  uid?: string
}

/**
 * Gold tiara with heart cutouts — vector replica of the in-store / Facebook logo mark.
 * Sharp at any size; no raster blur.
 */
export function QueenTiaraMark({ className, uid = 'lq' }: QueenTiaraMarkProps) {
  const g = `${uid}-gold`
  const s = `${uid}-shine`
  const h = `${uid}-hearts`

  return (
    <svg
      viewBox="0 0 88 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="hidden"
      className={cn('h-auto w-[2.125rem] shrink-0 sm:w-[2.625rem]', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={g} x1="44" y1="2" x2="44" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9E07A" />
          <stop offset="35%" stopColor="#E8C547" />
          <stop offset="70%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id={s} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FFF8DC" stopOpacity="0" />
        </linearGradient>
        <mask id={h}>
          <rect width="88" height="64" fill="white" />
          {/* Heart cutouts — negative space like the physical sign */}
          <path
            d="M28 38 C28 34 31 31 34 31 C36 31 38 33 39 35 C40 33 42 31 44 31 C46 31 48 33 49 35 C50 33 52 31 54 31 C57 31 60 34 60 38 C60 43 54 49 44 54 C34 49 28 43 28 38Z"
            fill="black"
          />
          <path
            d="M18 42 C18 39 20 37 22 37 C23.5 37 24.5 38 25 39 C25.5 38 26.5 37 28 37 C30 37 32 39 32 42 C32 45 28 48 25 50 C22 48 18 45 18 42Z"
            fill="black"
          />
          <path
            d="M56 42 C56 39 58 37 60 37 C61.5 37 62.5 38 63 39 C63.5 38 64.5 37 66 37 C68 37 70 39 70 42 C70 45 66 48 63 50 C60 48 56 45 56 42Z"
            fill="black"
          />
        </mask>
      </defs>

      {/* Side scroll flourishes */}
      <path
        d="M4 58 C4 48 6 42 10 36 C8 32 7 26 9 20 C11 14 16 10 22 8 C18 16 16 24 18 32 C20 40 24 48 30 52 C22 54 14 56 4 58Z"
        fill={`url(#${g})`}
        opacity="0.95"
      />
      <path
        d="M84 58 C84 48 82 42 78 36 C80 32 81 26 79 20 C77 14 72 10 66 8 C70 16 72 24 70 32 C68 40 64 48 58 52 C66 54 74 56 84 58Z"
        fill={`url(#${g})`}
        opacity="0.95"
      />

      {/* Main tiara band + peaks */}
      <path
        mask={`url(#${h})`}
        d="M8 58 L8 50 C8 48 12 46 16 44 C14 38 15 32 18 26 C21 20 26 16 32 14 C30 22 31 28 34 34 C36 28 38 22 44 12 C50 22 52 28 54 34 C57 28 58 22 56 14 C62 16 67 20 70 26 C73 32 74 38 72 44 C76 46 80 48 80 50 L80 58 Z"
        fill={`url(#${g})`}
      />

      {/* Center peak highlight */}
      <path
        d="M38 18 C40 14 44 10 44 10 C44 10 48 14 50 18 L48 28 L40 28 Z"
        fill={`url(#${s})`}
        opacity="0.85"
      />

      {/* Rim line for definition at small sizes */}
      <path
        d="M10 56 H78"
        stroke="#8B6914"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  )
}
