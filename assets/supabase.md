# Supabase Integration Guide for Angular Notes Frontend

This app uses Supabase for:
- Authentication (email/password login and sign-up)
- Data storage (notes table)

PUBLIC_INTERFACE
Environment variables required (set via build-time environment; do not commit secrets):
- NG_APP_SUPABASE_URL: Your Supabase project API URL
- NG_APP_SUPABASE_ANON_KEY: The anon public API key for the Supabase project
- NG_APP_SITE_URL: The public site URL used to set the email redirect for auth flows

Angular runtime environment access:
This project reads these values from import.meta.env. The CI/orchestrator should inject them at build time so they are statically embedded.

Database schema (create in Supabase SQL editor):

CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their notes"
  ON public.notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their notes"
  ON public.notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their notes"
  ON public.notes
  FOR DELETE
  USING (auth.uid() = user_id);

Indexes (optional for search performance):

CREATE INDEX IF NOT EXISTS notes_user_id_idx ON public.notes (user_id);
CREATE INDEX IF NOT EXISTS notes_title_trgm_idx ON public.notes USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS notes_content_trgm_idx ON public.notes USING gin (content gin_trgm_ops);

Note: trigram indexes require the pg_trgm extension:
CREATE EXTENSION IF NOT EXISTS pg_trgm;

Auth Notes
- Email/password auth is used with Supabase Auth.
- The emailRedirectTo option is set using NG_APP_SITE_URL for sign-in/up flows.

Usage in code
- A SupabaseClient singleton is provided via SupabaseService.
- NotesService performs CRUD using Supabase JS SDK against the notes table.
- AuthService handles signup, login, logout, session, and user observable.

Security
- Never commit real keys.
- Only anon key is used on the client.
- Policies ensure per-user access to notes.

Troubleshooting
- If auth callbacks fail, verify NG_APP_SITE_URL matches the deployed URL for redirect.
- Ensure RLS and policies are correctly set.
