// 📁 components/player/VideoPlayer.tsx
'use client'

import { useEffect, useRef } from 'react'
import type { LessonRow }    from '@/types'

interface Props {
  lesson: LessonRow
  userId: string
}

export default function VideoPlayer({ lesson, userId }: Props) {
  const lastSaved = useRef(0)

  async function saveProgress(watchSeconds: number, completed: boolean) {
    await fetch('/api/progress/update', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ lessonId: lesson.id, completed, watchSeconds }),
    })
    lastSaved.current = watchSeconds
  }

  if (!lesson.video_url) {
    return (
      <div className="aspect-video bg-[var(--ink-3)] rounded-sm flex items-center justify-center text-[var(--muted)] text-[0.88rem]">
        No video for this lesson.
      </div>
    )
  }

  // YouTube embed detection
  const isYouTube = lesson.video_url.includes('youtube') || lesson.video_url.includes('youtu.be')
  const embedUrl = isYouTube
    ? lesson.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
    : null

  if (embedUrl) {
    return (
      <div className="aspect-video rounded-sm overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={lesson.title}
        />
      </div>
    )
  }

  // Native video (Mux / direct URL)
  return (
    <div className="aspect-video rounded-sm overflow-hidden bg-black">
      <video
        key={lesson.id}
        src={lesson.video_url}
        controls
        className="w-full h-full"
        onTimeUpdate={(e) => {
          const el = e.currentTarget
          const secs = Math.floor(el.currentTime)
          if (secs - lastSaved.current >= 30) saveProgress(secs, false)
        }}
        onEnded={(e) => {
          saveProgress(Math.floor(e.currentTarget.duration), true)
        }}
      />
    </div>
  )
}