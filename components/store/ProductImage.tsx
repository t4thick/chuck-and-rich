'use client'

import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductImageProps = {
  src: string | null
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className, sizes = '(max-width:640px) 50vw, 25vw', priority }: ProductImageProps) {
  if (!src?.trim()) {
    return (
      <div
        className={cn(
          'flex aspect-square items-center justify-center bg-gradient-to-br from-brand-100 via-cream to-accent-100',
          className
        )}
        aria-hidden
      >
        <Package className="h-10 w-10 text-brand-400/70 sm:h-12 sm:w-12" strokeWidth={1.25} />
      </div>
    )
  }

  return (
    <div className={cn('relative aspect-square overflow-hidden bg-cream-dark', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes={sizes}
        priority={priority}
      />
    </div>
  )
}
