// 📁 app/api/assignments/submit/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { assignmentId, contentText, contentUrl } =
    await request.json() as { assignmentId: string; contentText?: string; contentUrl?: string }

  const { data, error } = await supabase
    .from('assignment_submissions')
    .upsert(
      {
        assignment_id: assignmentId,
        user_id: user.id,
        content_text: contentText,
        content_url: contentUrl,
        status: 'submitted'
      } as any, // تحويل إلى any لتجنب خطأ TypeScript
      { onConflict: 'assignment_id,user_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ submission: data })
}