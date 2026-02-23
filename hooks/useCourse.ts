// 📁 hooks/useCourse.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CourseWithSections } from '@/types'

/**
 * Fetches a course by slug including its sections, lessons, attachments, and plans.
 * Used in client components that need live course data (e.g. the player sidebar).
 */
export function useCourse(slug: string) {
  const [course,  setCourse]  = useState<CourseWithSections | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const supabase = createClient()

    supabase
      .from('courses')
      .select(`
        *,
        plans(*),
        sections(
          *,
          lessons(*, attachments(*)),
          quiz:quizzes(*)
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else     setCourse(data as CourseWithSections)
        setLoading(false)
      })
  }, [slug])

  return { course, loading, error }
}