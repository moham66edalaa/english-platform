// 📁 components/placement/PlacementQuestion.tsx

import type { PlacementQuestion } from '@/types'
import type { QuizOption }         from '@/types'

interface Props {
  question:       PlacementQuestion
  selectedOption: string | null
  onSelect:       (optionId: string) => void
}

export default function PlacementQuestion({ question, selectedOption, onSelect }: Props) {
  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6">
      <p className="font-medium text-[1rem] mb-5 leading-relaxed text-[var(--cream)]">
        {question.question_text}
      </p>
      <div className="flex flex-col gap-2.5">
        {(question.options as QuizOption[]).map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={[
              'flex items-center gap-3 px-4 py-3.5 rounded-sm border text-left text-[0.88rem] transition-all',
              selectedOption === opt.id
                ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.1)] text-[var(--cream)]'
                : 'border-[rgba(245,240,232,0.1)] text-[var(--cream-dim)] hover:border-[rgba(201,168,76,0.3)] hover:text-[var(--cream)]',
            ].join(' ')}
          >
            <span className="w-7 h-7 rounded-sm border border-current flex items-center justify-center text-[0.72rem] font-semibold flex-shrink-0">
              {opt.id.toUpperCase()}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}