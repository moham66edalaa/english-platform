// 📁 components/quiz/QuizResult.tsx

interface Props {
  result:   { score: number; passed: boolean; correct: number; total: number }
  onRetry?: () => void
}

export default function QuizResult({ result, onRetry }: Props) {
  return (
    <div className="text-center py-6">
      <div className={`text-[3.5rem] font-light mb-2 ${result.passed ? 'text-[var(--gold)]' : 'text-red-400'}`}
           style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {result.score}%
      </div>
      <p className="text-[0.88rem] text-[var(--cream-dim)] mb-1">
        {result.correct} / {result.total} correct
      </p>
      <p className={`text-[0.78rem] font-semibold tracking-widest uppercase mb-5 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
        {result.passed ? '✓ Passed' : '✗ Not passed'}
      </p>
      {!result.passed && onRetry && (
        <button onClick={onRetry}
                className="border border-[rgba(245,240,232,0.2)] text-[var(--cream)] px-6 py-2 rounded-sm text-[0.78rem] tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
          Try Again
        </button>
      )}
    </div>
  )
}