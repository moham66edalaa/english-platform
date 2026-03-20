-- 003_fix_rls_recursion.sql
-- Fix infinite recursion in users table RLS policies.
-- The "owner: read all users" policy queries public.users from within a policy
-- ON public.users, causing PostgreSQL error 42P17.
-- Fix: use a SECURITY DEFINER function that bypasses RLS to get the current user's role.

BEGIN;

-- 1. Create a helper function that reads the user's role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- 2. Drop the recursive policies on users
DROP POLICY IF EXISTS "owner: read all users" ON public.users;
DROP POLICY IF EXISTS "users: read own row" ON public.users;

-- 3. Recreate policies using the helper function (no recursion)
CREATE POLICY "users: read own row" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "owner: read all users" ON public.users
  FOR SELECT USING (
    public.get_my_role() = 'owner'
    OR id = auth.uid()
  );

-- 4. Also fix other tables' policies that query users table (these work fine
--    because they're on DIFFERENT tables, but let's use the helper for consistency
--    and better performance)

-- courses
DROP POLICY IF EXISTS "courses: owner_teacher all" ON public.courses;
CREATE POLICY "courses: owner_teacher all" ON public.courses
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- sections
DROP POLICY IF EXISTS "sections: owner_teacher write" ON public.sections;
CREATE POLICY "sections: owner_teacher write" ON public.sections
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- lessons
DROP POLICY IF EXISTS "lessons: owner_teacher write" ON public.lessons;
CREATE POLICY "lessons: owner_teacher write" ON public.lessons
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- attachments
DROP POLICY IF EXISTS "attachments: owner_teacher write" ON public.attachments;
CREATE POLICY "attachments: owner_teacher write" ON public.attachments
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- quizzes
DROP POLICY IF EXISTS "quizzes: owner_teacher write" ON public.quizzes;
CREATE POLICY "quizzes: owner_teacher write" ON public.quizzes
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- quiz_questions
DROP POLICY IF EXISTS "questions: owner_teacher write" ON public.quiz_questions;
CREATE POLICY "questions: owner_teacher write" ON public.quiz_questions
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- placement_test_questions
DROP POLICY IF EXISTS "pt_questions: owner write" ON public.placement_test_questions;
CREATE POLICY "pt_questions: owner write" ON public.placement_test_questions
  FOR ALL USING (public.get_my_role() = 'owner');

-- assignments
DROP POLICY IF EXISTS "assignments: owner_teacher write" ON public.assignments;
CREATE POLICY "assignments: owner_teacher write" ON public.assignments
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

-- live_sessions
DROP POLICY IF EXISTS "live_sessions: owner_teacher write" ON public.live_sessions;
CREATE POLICY "live_sessions: owner_teacher write" ON public.live_sessions
  FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));

COMMIT;
