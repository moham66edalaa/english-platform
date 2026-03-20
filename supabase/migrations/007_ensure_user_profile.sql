-- 007: Add ensure_user_profile() function
-- Fixes the case where auth.users exists but public.users row is missing.
-- Called from the application when requireUser() finds no profile.
-- SECURITY DEFINER bypasses RLS so it can always read/write public.users.

CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _profile public.users;
  _auth_email text;
  _auth_meta jsonb;
BEGIN
  -- Return existing profile if found
  SELECT * INTO _profile FROM public.users WHERE id = _user_id;
  IF FOUND THEN
    RETURN _profile;
  END IF;

  -- Get auth user data
  SELECT email, raw_user_meta_data INTO _auth_email, _auth_meta
  FROM auth.users WHERE id = _user_id;

  IF _auth_email IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found';
  END IF;

  -- Create the missing profile
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    _user_id,
    _auth_email,
    _auth_meta->>'full_name',
    _auth_meta->>'avatar_url',
    'student'
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING * INTO _profile;

  -- If insert succeeded, return it; otherwise re-read
  IF NOT FOUND THEN
    SELECT * INTO _profile FROM public.users WHERE id = _user_id;
  END IF;

  RETURN _profile;
END;
$$;
