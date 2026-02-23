// 📁 app/api/quizzes/submit/route.ts

import { NextResponse }   from 'next/server'
import { createClient }   from '@/lib/supabase/server'
import { gradeQuiz }      from '@/lib/quiz/grader'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { quizId, answers } = await request.json() as { quizId: string; answers: Record<string, string> }

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(*)')
    .eq('id', quizId)
    .single()

  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

  const result = gradeQuiz(answers, quiz.quiz_questions, quiz.pass_score)

  await supabase.from('quiz_attempts').insert({
    quiz_id: quizId,
    user_id: user.id,
    answers,
    score:   result.score,
    passed:  result.passed,
  })

  return NextResponse.json(result)
}