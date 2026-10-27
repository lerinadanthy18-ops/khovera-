# Khovera setup and current backend status

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings.
3. Run `npm ci`, then `npm run dev`.

The available checks are `npm run typecheck`, `npm run lint`, and `npm run build`.

## Supabase migration

Apply `supabase/migrations/20261023000000_secure_user_records.sql` with the Supabase CLI (`supabase db push`) or SQL editor. It locks down the legacy shared progress table without deleting its contents and adds user-scoped tables and RLS policies for profiles, submissions, review history, progress, skills, bookmarks, achievements, and published challenges.

Reviewer roles must be assigned by a trusted administrator using Supabase dashboard or a server-side process. Never expose a service-role key in the browser.

## Important limitation

The current React app does not yet use Supabase for authentication or data operations. Submissions and demo review actions still use browser storage and are labeled as prototype behavior. The migration secures the schema but is not a working app integration; do not use this version for real student records. Database behavior and RLS have not been tested against a live Supabase project.
