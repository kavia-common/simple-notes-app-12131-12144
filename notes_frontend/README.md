# Notes Frontend (Angular)

A modern, minimalistic notes app using Angular 19 and Supabase for authentication and storage.

Features:
- User authentication (email/password via Supabase)
- Create, edit, delete notes
- List and view notes
- Search notes (title/content)
- Simple tags display

Setup:
1) Set environment variables (CI/orchestrator maps them at build time):
   - NG_APP_SUPABASE_URL
   - NG_APP_SUPABASE_ANON_KEY
   - NG_APP_SITE_URL

2) Install dependencies:
   npm install

3) Run dev server:
   npm start
   App runs at http://localhost:3000 (configured in angular.json)

Supabase:
- See assets/supabase.md for schema and RLS policies.

Notes:
- This project uses Angular standalone components.
- No secrets are committed. Use .env.example for required variables.
