// 📁 components/placement/PlacementProgress.tsx

interface Props {
  current:   number
  total:     number
  answers:   Record<string, string>
  questions: { id: string }[]
}

export default function PlacementProgress({ current, total, answers, questions }: Props) {
  const answeredCount = questions.filter((q) => answers[q.id]).length
  const percent = Math.round((answeredCount / total) * 100)

  return (
    <div className="mb-6">
      <div className="flex justify-between text-[0.78rem] text-[var(--muted)] mb-2">
        <span>Question {current} of {total}</span>
        <span>{answeredCount} answered</span>
      </div>
      <div className="h-1.5 bg-[var(--ink-3)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: 'linear-gradient(90deg,#c9a84c,#e8cc80)' }}
        />
      </div>
    </div>
  )
}