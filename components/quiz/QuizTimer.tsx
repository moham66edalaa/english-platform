// 📁 components/quiz/QuizTimer.tsx
'use client'

import { useEffect, useState } from 'react'

interface Props {
  durationSeconds: number
  onExpire:        () => void
}

export default function QuizTimer({ durationSeconds, onExpire }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds)

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(id)
  }, [remaining, onExpire])

  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  const urgent = remaining <= 60

  return (
    <div className={`flex items-center gap-2 font-mono text-[1.1rem] ${urgent ? 'text-red-400 animate-pulse' : 'text-[var(--cream-dim)]'}`}>
      <span>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
    </div>
  )
}