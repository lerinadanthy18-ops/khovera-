/*
# Create Khovera shared progress record

1. New Tables
- `khovera_progress`
- `id` (text primary key) identifies the shared demo profile.
- `completed_quests` (jsonb) stores weekly quest ids completed by the profile.
- `portfolio_stages` (jsonb) stores roadmap stage keys saved to the portfolio.
- `updated_at` (timestamptz) records the latest progress update.

2. Security
- Row level security is enabled.
- The no-sign-in demo intentionally allows anon and authenticated users to read and update the shared profile so progress persists across reloads for the app experience.
- Insert and delete policies are included for complete CRUD coverage.

3. Important Notes
- The seed row is created only when it does not already exist.
- JSON arrays are used so the existing mock career content remains the source of truth while user actions persist safely.
*/

CREATE TABLE IF NOT EXISTS public.khovera_progress (
  id text PRIMARY KEY,
  completed_quests jsonb NOT NULL DEFAULT '[]'::jsonb,
  portfolio_stages jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.khovera_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read khovera progress" ON public.khovera_progress;
CREATE POLICY "public can read khovera progress"
  ON public.khovera_progress FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "public can insert khovera progress" ON public.khovera_progress;
CREATE POLICY "public can insert khovera progress"
  ON public.khovera_progress FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "public can update khovera progress" ON public.khovera_progress;
CREATE POLICY "public can update khovera progress"
  ON public.khovera_progress FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "public can delete khovera progress" ON public.khovera_progress;
CREATE POLICY "public can delete khovera progress"
  ON public.khovera_progress FOR DELETE
  TO anon, authenticated
  USING (true);

INSERT INTO public.khovera_progress (id)
VALUES ('demo-profile')
ON CONFLICT (id) DO NOTHING;
