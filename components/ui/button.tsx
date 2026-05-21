import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-brand-800 text-white shadow-[var(--shadow-card)] hover:bg-brand-900 hover:shadow-[var(--shadow-card-hover)]',
        accent: 'bg-accent-600 text-white shadow-[var(--shadow-card)] hover:bg-accent-700 hover:shadow-[var(--shadow-card-hover)]',
        outline:
          'border border-stone-300 bg-white text-stone-800 shadow-sm hover:border-brand-400 hover:bg-brand-50',
        ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-brand-700 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = 'Button'

export { buttonVariants }
