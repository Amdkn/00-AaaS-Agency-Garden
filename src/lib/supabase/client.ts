// src/lib/supabase/client.ts
// ADR-OMK-001 D4 / ADR-SUPABASE-001 — Browser-side Supabase client for Solaris (AaaS).
// Schema is selected by APP_MODE (solaris_internal vs solaris_saas) — see src/config/mode.ts.
// Only the ANON key is used (NEXT_PUBLIC_* is shipped to the browser).
// SERVICE_ROLE_KEY never appears here — that lives only in admin/server contexts.

import { createBrowserClient } from '@supabase/ssr';
import { DB_SCHEMA } from '@/config/mode';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail-fast validation. In dev without env, surface this clearly so devs
  // populate .env.local (see .env.example) instead of silently using mocks.
  if (typeof window !== 'undefined') {
    console.warn(
      '[supabase/client] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing. ' +
        'Set them in .env.local (see .env.example). Browser data layer will not work until configured.',
    );
  }
}

/**
 * Browser Supabase client. Use this in Client Components ("use client") for
 * user-initiated reads/writes that respect the user's session + RLS.
 *
 * Schema is bound to the current APP_MODE. In Phase A the env is stable per build;
 * changing modes requires a redeploy (build-time env) — matches the OMK pattern.
 */
export const supabaseBrowser = createBrowserClient(
  url ?? 'http://localhost:54321',
  anonKey ?? 'public-anon-key',
  {
    db: { schema: DB_SCHEMA },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export const SUPABASE_READY: boolean = Boolean(url && anonKey);
