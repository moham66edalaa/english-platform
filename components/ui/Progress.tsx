// 📁 components/ui/Progress.tsx

import { cn } from '@/lib/utils'

interface ProgressProps {
  /** Value between 0 and 100 */
  value:      number
  /** Show percentage label beside the bar */
  showLabel?: boolean
  /** Custom label text (overrides the percentage) */
  label?:     string
  className?: string
  /** Height of the track in pixels */
  height?:    number
}

export default function Progress({
  value,
  showLabel = false,
  label,
  className,
  height = 4,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-[0.78rem] text-[var(--cream-dim)]">{label}</span>}
          <span className="text-[0.78rem] text-[var(--muted)] ml-auto">{clamped}%</span>
        </div>
      )}
      <div
        className="w-full bg-[var(--ink-3)] rounded-full overflow-hidden"
        style={{ height }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(135deg, #c9a84c, #e8cc80, #c9a84c)',
          }}
        />
      </div>
    </div>
  )
}