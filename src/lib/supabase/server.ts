// src/lib/supabase/server.ts
// ADR-OMK-001 D4 / ADR-SUPABASE-001 — Server-side Supabase client for Solaris (AaaS).
// Use this in Server Components, Route Handlers (`src/app/api/.../route.ts`),
// and Server Actions. Reads the user session from cookies (set by middleware).
//
// Only the ANON key is used here. The SERVICE_ROLE_KEY (admin, bypasses RLS) is
// reserved for a separate `admin.ts` (added in a later phase) and is NEVER
// imported from a Client Component.

import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { DB_SCHEMA } from '@/config/mode';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail-fast at module load. Server runs are easier to catch than browser ones.
  console.warn(
    '[supabase/server] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing. ' +
      'Set them in .env.local (see .env.example). Server data layer will not work until configured.',
  );
}

/**
 * Create a per-request Supabase client bound to the incoming request's cookies.
 *
 * IMPORTANT: always create a new client per request — do not share across requests.
 * In Server Components / Route Handlers / Server Actions, this is the entry point
 * for any data fetch that should respect the user's RLS.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    url ?? 'http://localhost:54321',
    anonKey ?? 'public-anon-key',
    {
      db: { schema: DB_SCHEMA },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // `set` is not allowed in Server Components. The middleware
            // (src/middleware.ts) refreshes the session, so this is a no-op here.
          }
        },
      },
    },
  );
}

export const SUPABASE_READY: boolean = Boolean(url && anonKey);
