// app/api/courses/enroll/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await request.json() as { planId: string }

  // جلب الخطة مع تحويل النوع
  const { data: plan } = await supabase
    .from('plans')
    .select('id, course_id')
    .eq('id', planId)
    .single() as { data: any }

  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  // منع التسجيل المكرر
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', plan.course_id)
    .single() as { data: any }

  if (existing) return NextResponse.json({ error: 'Already enrolled' }, { status: 409 })

  // إدراج التسجيل مع تحويل الكائن إلى any
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert({ user_id: user.id, course_id: plan.course_id, plan_id: plan.id } as any)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ enrollment })
}