import Image from 'next/image'

/** Matches Stripe checkout: cards + Apple Pay / Google Pay (no BNPL). */
const PAYMENT_METHODS = [
  { src: '/images/payments/visa.svg', label: 'Visa' },
  { src: '/images/payments/mastercard.svg', label: 'Mastercard' },
  { src: '/images/payments/amex.svg', label: 'American Express' },
  { src: '/images/payments/discover.svg', label: 'Discover' },
  { src: '/images/payments/apple-pay.svg', label: 'Apple Pay' },
  { src: '/images/payments/google-pay.svg', label: 'Google Pay' },
] as const

type Props = {
  className?: string
}

export function PaymentMethodIcons({ className }: Props) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wider text-earth-500">
        We accept
      </p>
      <ul
        className="mt-3 flex flex-wrap items-center gap-2"
        aria-label="Accepted payment methods"
      >
        {PAYMENT_METHODS.map(({ src, label }) => (
          <li key={label}>
            <Image
              src={src}
              alt={label}
              width={48}
              height={32}
              className="h-8 w-auto rounded-md border border-earth-200/80 bg-white"
              unoptimized
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
