-- ============================================================
-- Combined Migration: 005 + 006
-- 1) Adds levels, materials, subscriptions tables
-- 2) Renames role 'owner' → 'admin' + updates all RLS policies
-- ============================================================
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

BEGIN;

-- ============================================================
-- PART 1: NEW TABLES (from 005)
-- ============================================================

-- LEVELS
CREATE TABLE IF NOT EXISTS public.levels (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text        NOT NULL UNIQUE,
  slug        text        NOT NULL UNIQUE,
  description text,
  sort_order  int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed default levels (skip if already exist)
INSERT INTO public.levels (name, slug, sort_order) VALUES
  ('Beginner',         'beginner',          1),
  ('Elementary',       'elementary',        2),
  ('Pre-Intermediate', 'pre-intermediate',  3),
  ('Intermediate',     'intermediate',      4),
  ('Advanced',         'advanced',          5)
ON CONFLICT (slug) DO NOTHING;

-- Add level_id FK to users, courses, groups
ALTER TABLE public.users   ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;
ALTER TABLE public.groups  ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;

-- MATERIALS
CREATE TABLE IF NOT EXISTS public.materials (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   uuid        REFERENCES public.courses(id) ON DELETE SET NULL,
  lesson_id   uuid        REFERENCES public.lessons(id) ON DELETE SET NULL,
  title       text        NOT NULL,
  type        text        NOT NULL DEFAULT 'pdf'
                          CHECK (type IN ('pdf', 'video', 'worksheet', 'vocabulary')),
  file_url    text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id     uuid        NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  status      text        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at   timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz,
  auto_renew  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.levels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 2: RENAME ROLE 'owner' → 'admin' (from 006)
-- ============================================================

-- Update all users with role 'owner' to 'admin'
UPDATE public.users SET role = 'admin' WHERE role = 'owner';

-- Drop old constraint and add new one
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'admin'));

-- ============================================================
-- PART 3: DROP OLD RLS POLICIES + CREATE NEW ONES
-- ============================================================

-- users
DROP POLICY IF EXISTS "owner: read all users" ON public.users;
CREATE POLICY "admin: read all users" ON public.users
  FOR SELECT USING (id = auth.uid() OR public.get_my_role() = 'admin');

-- courses
DROP POLICY IF EXISTS "courses: owner_teacher all" ON public.courses;
CREATE POLICY "courses: admin_teacher all" ON public.courses
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- sections
DROP POLICY IF EXISTS "sections: owner_teacher write" ON public.sections;
CREATE POLICY "sections: admin_teacher write" ON public.sections
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- lessons
DROP POLICY IF EXISTS "lessons: owner_teacher write" ON public.lessons;
CREATE POLICY "lessons: admin_teacher write" ON public.lessons
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- plans
DROP POLICY IF EXISTS "plans: owner_teacher write" ON public.plans;
CREATE POLICY "plans: admin_teacher write" ON public.plans
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- quizzes
DROP POLICY IF EXISTS "quizzes: owner_teacher write" ON public.quizzes;
CREATE POLICY "quizzes: admin_teacher write" ON public.quizzes
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- quiz_questions
DROP POLICY IF EXISTS "quiz_questions: owner_teacher write" ON public.quiz_questions;
CREATE POLICY "quiz_questions: admin_teacher write" ON public.quiz_questions
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- pt_questions
DROP POLICY IF EXISTS "pt_questions: owner write" ON public.pt_questions;
CREATE POLICY "pt_questions: admin write" ON public.pt_questions
  FOR ALL USING (public.get_my_role() = 'admin');

-- assignments
DROP POLICY IF EXISTS "assignments: owner_teacher write" ON public.assignments;
CREATE POLICY "assignments: admin_teacher write" ON public.assignments
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- live_sessions
DROP POLICY IF EXISTS "live_sessions: owner_teacher write" ON public.live_sessions;
CREATE POLICY "live_sessions: admin_teacher write" ON public.live_sessions
  FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- enrollments
DROP POLICY IF EXISTS "enrollments: own or owner" ON public.enrollments;
CREATE POLICY "enrollments: own or admin" ON public.enrollments
  FOR SELECT USING (user_id = auth.uid() OR public.get_my_role() = 'admin');

-- levels
DROP POLICY IF EXISTS "levels: owner write" ON public.levels;
CREATE POLICY "levels: public read" ON public.levels FOR SELECT USING (true);
CREATE POLICY "levels: admin write" ON public.levels
  FOR ALL USING (public.get_my_role() = 'admin');

-- materials
DROP POLICY IF EXISTS "materials: owner all" ON public.materials;
CREATE POLICY "materials: admin all" ON public.materials
  FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "materials: teacher manage own" ON public.materials
  FOR ALL USING (teacher_id = auth.uid() AND public.get_my_role() = 'teacher');
CREATE POLICY "materials: student read enrolled" ON public.materials
  FOR SELECT USING (
    course_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = materials.course_id AND e.user_id = auth.uid()
    )
  );

-- subscriptions
DROP POLICY IF EXISTS "subscriptions: owner all" ON public.subscriptions;
CREATE POLICY "subscriptions: own rows" ON public.subscriptions
  USING (user_id = auth.uid());
CREATE POLICY "subscriptions: admin all" ON public.subscriptions
  FOR ALL USING (public.get_my_role() = 'admin');

-- groups
DROP POLICY IF EXISTS "groups: owner all" ON public.groups;
CREATE POLICY "groups: admin all" ON public.groups
  FOR ALL USING (public.get_my_role() = 'admin');

-- attendance
DROP POLICY IF EXISTS "attendance: owner all" ON public.attendance;
CREATE POLICY "attendance: admin all" ON public.attendance
  FOR ALL USING (public.get_my_role() = 'admin');

-- announcements
DROP POLICY IF EXISTS "announcements: owner all" ON public.announcements;
CREATE POLICY "announcements: admin all" ON public.announcements
  FOR ALL USING (public.get_my_role() = 'admin');

-- teacher_courses
DROP POLICY IF EXISTS "teacher_courses: owner all" ON public.teacher_courses;
CREATE POLICY "teacher_courses: admin all" ON public.teacher_courses
  FOR ALL USING (public.get_my_role() = 'admin');

COMMIT;
