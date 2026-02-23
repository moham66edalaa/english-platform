// app/api/progress/update/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId, completed, watchSeconds } =
    await request.json() as { lessonId: string; completed: boolean; watchSeconds: number }

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      { user_id: user.id, lesson_id: lessonId, completed, watch_seconds: watchSeconds } as any,
      { onConflict: 'user_id,lesson_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}