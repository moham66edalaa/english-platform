// 📁 app/(admin)/admin/courses/new/page.tsx

import CourseForm from '@/components/admin/CourseForm'

export const metadata = { title: 'New Course — Admin' }

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Create New Course
      </h1>
      <CourseForm course={null} />
    </div>
  )
}