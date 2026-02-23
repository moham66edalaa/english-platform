// components/placement/PlacementQuestion.tsx
'use client'

interface Props {
  question: {
    id: string
    question_text: string
    options: Array<{ id: string; text: string }> // مصفوفة الخيارات من JSONB
  }
  selectedOption: string | null
  onSelect: (optionId: string) => void
  questionNumber: number
  totalQuestions: number
}

export default function PlacementQuestion({
  question,
  selectedOption,
  onSelect,
  questionNumber,
  totalQuestions,
}: Props) {
  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-2xl p-8 shadow-xl">
      <div className="mb-6">
        <span className="text-sm text-[var(--gold)]">
          Question {questionNumber} of {totalQuestions}
        </span>
        <h2 className="text-xl font-light text-[var(--cream)] mt-2">
          {question.question_text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`
              w-full text-left px-5 py-4 rounded-xl border transition-all
              ${
                selectedOption === opt.id
                  ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.1)] text-[var(--gold)]'
                  : 'border-[rgba(245,240,232,0.1)] bg-[var(--ink-3)] text-[var(--cream)] hover:border-[rgba(201,168,76,0.3)]'
              }
            `}
          >
            <span className="font-medium mr-3">{opt.id.toUpperCase()}.</span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}