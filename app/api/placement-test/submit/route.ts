// app/api/placement-test/submit/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gradePlacementTest } from '@/lib/placement/grader'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { answers } = await request.json() as { answers: Record<string, string> }

  // Fetch active questions with their correct answers and cefr levels
  const { data: questions, error: qError } = await supabase
    .from('placement_test_questions')
    .select('id, correct_option, cefr_level')
    .eq('is_active', true)

  if (qError || !questions || questions.length === 0) {
    return NextResponse.json({ error: 'No questions found' }, { status: 400 })
  }

  // Grade the test
  const result = gradePlacementTest(answers, questions)

  // Save the result
  await supabase.from('placement_test_results').insert({
    user_id: user.id,
    answers,
    total_questions: result.totalQuestions,
    correct_answers: result.correctAnswers,
    score_by_level: result.scoreByLevel,
    assigned_level: result.assignedLevel,
  })

  // Update the user's CEFR level
  await supabase
    .from('users')
    .update({ cefr_level: result.assignedLevel })
    .eq('id', user.id)

  return NextResponse.json({ level: result.assignedLevel })
}