// 📁 components/ui/Card.tsx

import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a gold gradient line across the top edge */
  highlight?: boolean
  /** Removes all padding (useful when the card contains full-bleed content) */
  noPadding?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ highlight = false, noPadding = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative bg-[var(--ink-2)] border border-[rgba(245,240,232,0.08)] rounded-sm overflow-hidden transition-all duration-300',
          !noPadding && 'p-6',
          className
        )}
        {...props}
      >
        {highlight && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e8cc80, #c9a84c)' }}
          />
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/* ── Sub-components for structured layouts ── */

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-[1.25rem] font-semibold text-[var(--cream)]', className)}
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-[0.88rem] text-[var(--cream-dim)] leading-relaxed', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-5 pt-4 border-t border-[rgba(245,240,232,0.07)] flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card