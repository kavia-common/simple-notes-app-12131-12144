IMPORTANT: Supabase Configuration Required

1. Environment Variables (build-time)
   - NG_APP_SUPABASE_URL
   - NG_APP_SUPABASE_ANON_KEY
   - NG_APP_SITE_URL (e.g., http://localhost:3000/ during development)

2. Supabase Dashboard
   - Authentication > URL Configuration
     * Site URL: set to your NG_APP_SITE_URL
     * Add redirect allowlist entries for dev and prod (e.g., http://localhost:3000/**, https://yourapp.com/**)

3. After setting env vars, the automation will:
   - Verify tables
   - Create/verify public.notes
   - Enable RLS and apply policies
   - Create pg_trgm extension and indexes

Troubleshooting:
- If signup returns redirect errors, ensure NG_APP_SITE_URL matches your allowlist and includes trailing slash.
