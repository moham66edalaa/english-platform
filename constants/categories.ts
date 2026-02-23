// 📁 constants/categories.ts
// Static course preview data for the landing page.
// Replace with Supabase queries once the DB is wired up.

export type CourseTab = 'level' | 'skill' | 'academic' | 'exam'

export interface CoursePreview {
  slug:  string
  title: string
  desc:  string
  tag:   string
  price: string
  badge: string   // displayed large in the card thumbnail
}

export const COURSE_TABS: { key: CourseTab; label: string }[] = [
  { key: 'level',    label: 'By Level'   },
  { key: 'skill',    label: 'By Skill'   },
  { key: 'academic', label: 'Academic'   },
  { key: 'exam',     label: 'Exam Prep'  },
]

export const COURSES: Record<CourseTab, CoursePreview[]> = {
  level: [
    { slug: 'a1-beginner',          badge: 'A1',     tag: 'Level Course', price: '$49', title: 'A1 — Beginner',           desc: 'Build your first English foundations: alphabet, basic vocabulary, simple sentences.' },
    { slug: 'a2-elementary',        badge: 'A2',     tag: 'Level Course', price: '$49', title: 'A2 — Elementary',          desc: 'Communicate in everyday situations, describe your background and surroundings.' },
    { slug: 'b1-intermediate',      badge: 'B1',     tag: 'Level Course', price: '$59', title: 'B1 — Intermediate',        desc: 'Handle most situations while travelling and produce simple connected text.' },
    { slug: 'b2-upper-intermediate', badge: 'B2',   tag: 'Level Course', price: '$69', title: 'B2 — Upper-Intermediate',  desc: 'Interact with fluency with native speakers on a wide range of topics.' },
    { slug: 'c1-advanced',          badge: 'C1',     tag: 'Level Course', price: '$79', title: 'C1 — Advanced',            desc: 'Express ideas fluently and spontaneously without much obvious searching.' },
  ],
  skill: [
    { slug: 'grammar-mastery',      badge: 'G',      tag: 'Skill Course', price: '$59', title: 'Grammar Mastery',          desc: 'Zero in on the rules of English — from articles and tenses to complex clause structures.' },
    { slug: 'speaking-confidence',  badge: 'S',      tag: 'Skill Course', price: '$59', title: 'Speaking Confidence',      desc: 'Develop fluency, pronunciation, and the ability to think in English — not translate.' },
  ],
  academic: [
    { slug: '1st-secondary',        badge: 'Y1',     tag: 'Academic',     price: '$49', title: '1st Secondary English',    desc: 'Full curriculum aligned with national standards for first-year secondary students.' },
    { slug: '2nd-secondary',        badge: 'Y2',     tag: 'Academic',     price: '$49', title: '2nd Secondary English',    desc: 'Comprehensive second-year coverage including advanced grammar and essay writing.' },
    { slug: '3rd-secondary',        badge: 'Y3',     tag: 'Academic',     price: '$49', title: '3rd Secondary English',    desc: 'Exam-focused preparation for final secondary English with past-paper practice.' },
  ],
  exam: [
    { slug: 'ielts-preparation',    badge: 'IE',     tag: 'Exam Prep',    price: '$89', title: 'IELTS Preparation',        desc: 'Band 6–8 target. Full reading, writing, listening, and speaking modules with timed practice.' },
    { slug: 'toefl-preparation',    badge: 'TF',     tag: 'Exam Prep',    price: '$89', title: 'TOEFL Preparation',        desc: 'Comprehensive iBT practice — integrated tasks, academic reading, and lecture summaries.' },
  ],
}