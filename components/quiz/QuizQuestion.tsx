// 📁 components/quiz/QuizQuestion.tsx

import type { QuizQuestionRow } from '@/types'
import type { QuizOption }       from '@/types'

interface Props {
  question:       QuizQuestionRow
  selectedOption: string | null
  onSelect:       (optionId: string) => void
  showResult:     boolean
}

export default function QuizQuestion({ question, selectedOption, onSelect, showResult }: Props) {
  const options = question.options as QuizOption[]

  return (
    <div>
      <p className="font-medium text-[0.95rem] mb-4 leading-relaxed text-[var(--cream)]">
        {question.question_text}
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id
          const isCorrect  = showResult && opt.id === question.correct_option
          const isWrong    = showResult && isSelected && opt.id !== question.correct_option

          return (
            <button
              key={opt.id}
              onClick={() => !showResult && onSelect(opt.id)}
              disabled={showResult}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-sm border text-left text-[0.85rem] transition-all',
                isCorrect  ? 'border-green-500 bg-[rgba(34,197,94,0.08)] text-green-400' :
                isWrong    ? 'border-red-500 bg-[rgba(239,68,68,0.08)] text-red-400' :
                isSelected ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.08)] text-[var(--cream)]' :
                             'border-[rgba(245,240,232,0.1)] text-[var(--cream-dim)] hover:border-[rgba(201,168,76,0.3)] hover:text-[var(--cream)]',
              ].join(' ')}
            >
              <span className="w-6 h-6 rounded-sm border border-current flex items-center justify-center text-[0.7rem] font-semibold flex-shrink-0">
                {opt.id.toUpperCase()}
              </span>
              {opt.text}
            </button>
          )
        })}
      </div>
      {showResult && question.explanation && (
        <p className="mt-3 text-[0.8rem] text-[var(--muted)] border-l-2 border-[var(--gold)] pl-3">
          {question.explanation}
        </p>
      )}
    </div>
  )
}