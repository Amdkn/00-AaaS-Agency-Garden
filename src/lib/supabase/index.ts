// src/lib/supabase/index.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — Barrel re-export for the Supabase clients.
// Prefer `import { supabaseBrowser } from '@/lib/supabase'` (or the server
// helper) in feature code. The split paths remain available for advanced
// cases (e.g. tests that only need the browser client).

export { supabaseBrowser, SUPABASE_READY as SUPABASE_BROWSER_READY } from './client';
export { createSupabaseServerClient, SUPABASE_READY as SUPABASE_SERVER_READY } from './server';
