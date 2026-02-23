// 📁 components/player/LessonSidebar.tsx

import Link from 'next/link'

interface Lesson   { id: string; title: string }
interface Section  { id: string; title: string; lessons: Lesson[] }
interface Course   { slug: string; title: string; sections: Section[] }

interface Props {
  course:        Course
  activeLesson:  Lesson | null
  progress:      Record<string, boolean>   // lessonId → completed
}

export default function LessonSidebar({ course, activeLesson, progress }: Props) {
  return (
    <aside className="w-72 flex-shrink-0 bg-[var(--ink-2)] border-r border-[rgba(245,240,232,0.07)] flex flex-col min-h-screen">
      {/* Course title */}
      <div className="p-5 border-b border-[rgba(245,240,232,0.07)]">
        <p className="text-[0.62rem] tracking-widest uppercase text-[var(--gold)] mb-1">Course</p>
        <h2 className="font-semibold text-[0.95rem] leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {course.title}
        </h2>
      </div>

      {/* Sections + lessons */}
      <div className="flex-1 overflow-y-auto py-4">
        {course.sections?.map((section) => (
          <div key={section.id} className="mb-2">
            <p className="px-5 py-2 text-[0.62rem] tracking-widest uppercase text-[var(--muted)]">
              {section.title}
            </p>
            {section.lessons?.map((lesson) => {
              const isActive    = lesson.id === activeLesson?.id
              const isCompleted = progress[lesson.id]
              return (
                <Link key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.id}`}
                      className={[
                        'flex items-center gap-3 px-5 py-2.5 text-[0.82rem] transition-all border-l-2',
                        isActive
                          ? 'bg-[rgba(201,168,76,0.08)] border-[var(--gold)] text-[var(--cream)]'
                          : 'border-transparent text-[var(--cream-dim)] hover:text-[var(--cream)] hover:bg-[rgba(245,240,232,0.03)]',
                      ].join(' ')}>
                  <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[0.5rem] ${
                    isCompleted
                      ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--ink)]'
                      : 'border-[rgba(245,240,232,0.2)]'
                  }`}>
                    {isCompleted ? '✓' : ''}
                  </span>
                  <span className="line-clamp-2">{lesson.title}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}