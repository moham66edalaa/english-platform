-- 006: Rename role 'owner' → 'admin' across the entire database
-- This migration updates the user role value and all RLS policies

-- 1. Update all users with role 'owner' to 'admin'
UPDATE public.users SET role = 'admin' WHERE role = 'owner';

-- 2. Drop old constraint and add new one
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'admin'));

-- 3. Update the get_my_role() function (if it references 'owner')
-- The function just reads the role column, so no changes needed there.

-- 4. Update RLS policies that check for 'owner' role
-- We need to drop and recreate policies that reference 'owner'

-- users table policies
DROP POLICY IF EXISTS "owner: read all users" ON public.users;
CREATE POLICY "admin: read all users" ON public.users
  FOR SELECT USING (
    id = auth.uid()
    OR public.get_my_role() = 'admin'
  );

-- courses policies
DROP POLICY IF EXISTS "courses: owner_teacher all" ON public.courses;
CREATE POLICY "courses: admin_teacher all" ON public.courses
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- sections policies
DROP POLICY IF EXISTS "sections: owner_teacher write" ON public.sections;
CREATE POLICY "sections: admin_teacher write" ON public.sections
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- lessons policies
DROP POLICY IF EXISTS "lessons: owner_teacher write" ON public.lessons;
CREATE POLICY "lessons: admin_teacher write" ON public.lessons
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- plans policies
DROP POLICY IF EXISTS "plans: owner_teacher write" ON public.plans;
CREATE POLICY "plans: admin_teacher write" ON public.plans
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- quizzes policies
DROP POLICY IF EXISTS "quizzes: owner_teacher write" ON public.quizzes;
CREATE POLICY "quizzes: admin_teacher write" ON public.quizzes
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- quiz_questions policies
DROP POLICY IF EXISTS "quiz_questions: owner_teacher write" ON public.quiz_questions;
CREATE POLICY "quiz_questions: admin_teacher write" ON public.quiz_questions
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- pt_questions policies
DROP POLICY IF EXISTS "pt_questions: owner write" ON public.pt_questions;
CREATE POLICY "pt_questions: admin write" ON public.pt_questions
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- assignments policies
DROP POLICY IF EXISTS "assignments: owner_teacher write" ON public.assignments;
CREATE POLICY "assignments: admin_teacher write" ON public.assignments
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- live_sessions policies
DROP POLICY IF EXISTS "live_sessions: owner_teacher write" ON public.live_sessions;
CREATE POLICY "live_sessions: admin_teacher write" ON public.live_sessions
  FOR ALL USING (
    public.get_my_role() IN ('admin', 'teacher')
  );

-- enrollments policies
DROP POLICY IF EXISTS "enrollments: own or owner" ON public.enrollments;
CREATE POLICY "enrollments: own or admin" ON public.enrollments
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.get_my_role() = 'admin'
  );

-- levels policies
DROP POLICY IF EXISTS "levels: owner write" ON public.levels;
CREATE POLICY "levels: admin write" ON public.levels
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- materials policies
DROP POLICY IF EXISTS "materials: owner all" ON public.materials;
CREATE POLICY "materials: admin all" ON public.materials
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- subscriptions policies
DROP POLICY IF EXISTS "subscriptions: owner all" ON public.subscriptions;
CREATE POLICY "subscriptions: admin all" ON public.subscriptions
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- groups policies (owner can manage all)
DROP POLICY IF EXISTS "groups: owner all" ON public.groups;
CREATE POLICY "groups: admin all" ON public.groups
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- attendance policies (owner override)
DROP POLICY IF EXISTS "attendance: owner all" ON public.attendance;
CREATE POLICY "attendance: admin all" ON public.attendance
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- announcements policies
DROP POLICY IF EXISTS "announcements: owner all" ON public.announcements;
CREATE POLICY "announcements: admin all" ON public.announcements
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- teacher_courses policies
DROP POLICY IF EXISTS "teacher_courses: owner all" ON public.teacher_courses;
CREATE POLICY "teacher_courses: admin all" ON public.teacher_courses
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );
