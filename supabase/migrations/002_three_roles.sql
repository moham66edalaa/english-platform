-- 002_three_roles.sql
-- Migrate from 2-role (admin/student) to 3-role (owner/teacher/student) system.

BEGIN;

-- 1. Update the role check constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'owner'));

-- 2. Migrate existing admin users to owner
UPDATE public.users SET role = 'owner' WHERE role = 'admin';

-- 3. Update RLS policies that reference 'admin' role
-- Owner-only policies (keep restricted to owner only)

-- users: admin read all
DROP POLICY IF EXISTS "admin: read all users" ON public.users;
CREATE POLICY "owner: read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
    OR id = auth.uid()
  );

-- plans: admin write
DROP POLICY IF EXISTS "plans: admin write" ON public.plans;
CREATE POLICY "plans: owner_teacher write" ON public.plans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- placement_test_questions: admin write
DROP POLICY IF EXISTS "pt_questions: admin write" ON public.placement_test_questions;
CREATE POLICY "pt_questions: owner write" ON public.placement_test_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- Owner+Teacher policies (broaden to both roles)

-- courses: admin all
DROP POLICY IF EXISTS "courses: admin all" ON public.courses;
CREATE POLICY "courses: owner_teacher all" ON public.courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- sections: admin write
DROP POLICY IF EXISTS "sections: admin write" ON public.sections;
CREATE POLICY "sections: owner_teacher write" ON public.sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- lessons: admin write
DROP POLICY IF EXISTS "lessons: admin write" ON public.lessons;
CREATE POLICY "lessons: owner_teacher write" ON public.lessons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- attachments: admin write
DROP POLICY IF EXISTS "attachments: admin write" ON public.attachments;
CREATE POLICY "attachments: owner_teacher write" ON public.attachments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- quizzes: admin write
DROP POLICY IF EXISTS "quizzes: admin write" ON public.quizzes;
CREATE POLICY "quizzes: owner_teacher write" ON public.quizzes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- quiz_questions: admin write
DROP POLICY IF EXISTS "questions: admin write" ON public.quiz_questions;
CREATE POLICY "questions: owner_teacher write" ON public.quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- assignments: admin write
DROP POLICY IF EXISTS "assignments: admin write" ON public.assignments;
CREATE POLICY "assignments: owner_teacher write" ON public.assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- assignment_submissions: admin read
DROP POLICY IF EXISTS "submissions: admin read" ON public.assignment_submissions;
CREATE POLICY "submissions: owner_teacher read" ON public.assignment_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
    OR user_id = auth.uid()
  );

-- enrollments: own or admin
DROP POLICY IF EXISTS "enrollments: own or admin" ON public.enrollments;
CREATE POLICY "enrollments: own or owner" ON public.enrollments
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- live_sessions: admin write
DROP POLICY IF EXISTS "live_sessions: admin write" ON public.live_sessions;
CREATE POLICY "live_sessions: owner_teacher write" ON public.live_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'teacher'))
  );

-- 4. Update auth.users metadata for any existing admin users
UPDATE auth.users
SET raw_user_meta_data =
  coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"owner"}'::jsonb
WHERE raw_user_meta_data->>'role' = 'admin';

COMMIT;
