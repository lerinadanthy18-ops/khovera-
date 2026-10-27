-- Lock down the legacy shared demo record without deleting any existing data.
ALTER TABLE IF EXISTS public.khovera_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public can read khovera progress" ON public.khovera_progress;
DROP POLICY IF EXISTS "public can insert khovera progress" ON public.khovera_progress;
DROP POLICY IF EXISTS "public can update khovera progress" ON public.khovera_progress;
DROP POLICY IF EXISTS "public can delete khovera progress" ON public.khovera_progress;
REVOKE ALL ON TABLE public.khovera_progress FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'reviewer')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.challenges (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_minutes integer NOT NULL CHECK (estimated_minutes > 0),
  skills text[] NOT NULL DEFAULT '{}',
  instructions jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  challenge_title text NOT NULL,
  challenge_category text NOT NULL,
  description text NOT NULL,
  evidence_url text NOT NULL CHECK (evidence_url ~ '^https?://'),
  reflection text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_requested')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.submission_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL CHECK (status IN ('approved', 'changes_requested')),
  feedback text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.student_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.demonstrated_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, skill, submission_id)
);
CREATE TABLE IF NOT EXISTS public.achievements (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  rule jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.student_achievements (
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, achievement_id)
);
CREATE TABLE IF NOT EXISTS public.challenge_bookmarks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, challenge_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demonstrated_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_is_reviewer()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'reviewer')
$$;
REVOKE ALL ON FUNCTION public.current_user_is_reviewer() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_is_reviewer() TO authenticated;

CREATE POLICY profiles_read_self ON public.profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
CREATE POLICY profiles_insert_self_student ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = (SELECT auth.uid()) AND role = 'student');
CREATE POLICY profiles_update_self_name ON public.profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()) AND role = 'student');

CREATE POLICY submissions_read_owner_or_reviewer ON public.submissions FOR SELECT TO authenticated USING (student_id = (SELECT auth.uid()) OR public.current_user_is_reviewer());
CREATE POLICY submissions_insert_owner ON public.submissions FOR INSERT TO authenticated WITH CHECK (student_id = (SELECT auth.uid()));
CREATE POLICY submissions_update_owner_pending ON public.submissions FOR UPDATE TO authenticated USING (student_id = (SELECT auth.uid()) AND status = 'changes_requested') WITH CHECK (student_id = (SELECT auth.uid()) AND status = 'pending');
CREATE POLICY submissions_update_reviewer ON public.submissions FOR UPDATE TO authenticated USING (public.current_user_is_reviewer()) WITH CHECK (public.current_user_is_reviewer());

CREATE POLICY reviews_read_student_or_reviewer ON public.submission_reviews FOR SELECT TO authenticated USING (
  reviewer_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.student_id = (SELECT auth.uid()))
);
CREATE POLICY reviews_insert_reviewer ON public.submission_reviews FOR INSERT TO authenticated WITH CHECK (reviewer_id = (SELECT auth.uid()) AND public.current_user_is_reviewer());
CREATE POLICY bookmarks_owner_all ON public.challenge_bookmarks FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

-- Role assignment is administrative only. Authenticated users cannot promote themselves via profile updates.
COMMENT ON TABLE public.profiles IS 'Role changes must be performed by a trusted administrator using the Supabase dashboard/service role.';

CREATE POLICY published_challenges_read ON public.challenges FOR SELECT TO authenticated USING (published);
CREATE POLICY progress_read_self ON public.student_progress FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY progress_insert_self ON public.student_progress FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY progress_update_self ON public.student_progress FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY skills_read_self_or_reviewer ON public.demonstrated_skills FOR SELECT TO authenticated USING (student_id = (SELECT auth.uid()) OR public.current_user_is_reviewer());
CREATE POLICY achievements_read_authenticated ON public.achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY earned_achievements_read_self_or_reviewer ON public.student_achievements FOR SELECT TO authenticated USING (student_id = (SELECT auth.uid()) OR public.current_user_is_reviewer());

CREATE INDEX IF NOT EXISTS submissions_student_submitted_idx ON public.submissions(student_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON public.submissions(status);
CREATE INDEX IF NOT EXISTS reviews_submission_created_idx ON public.submission_reviews(submission_id, created_at DESC);
CREATE INDEX IF NOT EXISTS skills_student_idx ON public.demonstrated_skills(student_id);
CREATE INDEX IF NOT EXISTS earned_achievements_student_idx ON public.student_achievements(student_id, earned_at DESC);
