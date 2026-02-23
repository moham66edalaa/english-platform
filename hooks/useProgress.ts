// hooks/useProgress.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LessonProgressRow } from '@/types'

/**
 * Loads all lesson_progress rows for the current user within a given course.
 * Provides a `markComplete` function that POSTs to /api/progress/update
 * and optimistically updates local state.
 */
export function useProgress(courseId: string) {
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgressRow>>({})
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    if (!courseId) return
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      // Get all lessons in this course first
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, section:sections!inner(course_id)')
        .eq('section.course_id', courseId) as { data: any }

      if (!lessons || lessons.length === 0) { setLoading(false); return }

      const lessonIds = lessons.map((l: { id: string }) => l.id)

      const { data: rows } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds) as { data: any }

      const map: Record<string, LessonProgressRow> = {}
      rows?.forEach((r: any) => { map[r.lesson_id] = r })
      setProgressMap(map)
      setLoading(false)
    })
  }, [courseId])

  /**
   * Mark a lesson as complete (or update watch seconds).
   * Calls /api/progress/update and updates local state immediately.
   */
  const markComplete = useCallback(
    async (lessonId: string, watchSeconds = 0) => {
      // Optimistic update
      setProgressMap((prev) => ({
        ...prev,
        [lessonId]: {
          ...(prev[lessonId] ?? {}),
          lesson_id:     lessonId,
          completed:     true,
          watch_seconds: watchSeconds,
        } as LessonProgressRow,
      }))

      await fetch('/api/progress/update', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ lessonId, completed: true, watchSeconds }),
      })
    },
    []
  )

  /** Percentage of completed lessons (0–100). */
  const percent = useCallback(
    (totalLessons: number) => {
      if (totalLessons === 0) return 0
      const done = Object.values(progressMap).filter((r) => r.completed).length
      return Math.round((done / totalLessons) * 100)
    },
    [progressMap]
  )

  const isComplete = (lessonId: string) => progressMap[lessonId]?.completed ?? false

  return { progressMap, loading, markComplete, isComplete, percent }
}