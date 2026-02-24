// 📁 components/ui/Badge.tsx

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'green' | 'red' | 'muted' | 'outline'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    'bg-[var(--gold)] text-[var(--ink)]',
  green:   'bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] text-green-400',
  red:     'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-red-400',
  muted:   'bg-[var(--ink-3)] border border-[rgba(245,240,232,0.08)] text-[var(--muted)]',
  outline: 'border border-[rgba(201,168,76,0.35)] text-[var(--gold)] bg-[rgba(201,168,76,0.06)]',
}

export function Badge({ variant = 'outline', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-semibold tracking-[0.1em] uppercase whitespace-nowrap',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}