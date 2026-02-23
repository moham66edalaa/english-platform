// 📁 components/ui/Button.tsx

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'danger' | 'outline'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?:    Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.25)]',
  ghost:   'border border-[rgba(245,240,232,0.2)] text-[var(--cream)] hover:border-[var(--gold)] hover:text-[var(--gold)]',
  outline: 'border border-[rgba(201,168,76,0.4)] text-[var(--gold)] hover:bg-[rgba(201,168,76,0.08)]',
  danger:  'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-red-400 hover:bg-[rgba(239,68,68,0.2)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.75rem]',
  md: 'px-6 py-2.5 text-[0.82rem]',
  lg: 'px-9 py-3.5 text-[0.9rem]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button