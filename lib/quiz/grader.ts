// 📁 lib/quiz/grader.ts

export interface QuizGraderResult {
  score:     number    // 0-100 percentage
  passed:    boolean
  correct:   number
  total:     number
}

interface QuizQuestion {
  id:             string
  correct_option: string
}

export function gradeQuiz(
  answers:    Record<string, string>,   // { questionId: selectedOptionId }
  questions:  QuizQuestion[],
  passScore:  number = 70               // percentage required to pass
): QuizGraderResult {
  let correct = 0

  for (const q of questions) {
    if (answers[q.id] === q.correct_option) correct++
  }

  const score = questions.length > 0
    ? Math.round((correct / questions.length) * 100)
    : 0

  return {
    score,
    passed: score >= passScore,
    correct,
    total:  questions.length,
  }
}