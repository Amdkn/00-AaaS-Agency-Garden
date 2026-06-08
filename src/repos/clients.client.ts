import 'client-only';
// src/repos/clients.repo.ts
// Phase D — Per-view data repo for Clients (AaaS Agency Garden).
//
// Architecture (Phase D, SPA-friendly):
// - Server-side: listClients/getClient/createClient/updateClient are intended
//   for Server Components, Route Handlers, and Server Actions. They use the
//   schema-aware createSupabaseServerClient and Next.js unstable_cache for
//   per-tag revalidation. They fall back to the mock dataset when
//   SUPABASE_READY is false (no env vars configured).
// - Client-side: views currently run as Client Components in the SPA shell.
//   They read data via the MOCK_CLIENTS / getMockClient accessors exported
//   from this same module. The accessor path is identical in shape to the
//   server functions; the only difference is that the server functions also
//   consult Supabase when configured.
//
// Phase E (next): when views are split into Server/Client pairs, the
// server functions below become the canonical entry point. The client
// accessors remain for the local-storage UX (Tasks) and the SPA shell.

import { CLIENT_PROFILES } from '@/lib/constants';
import type { ClientProfile } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe accessor)
// ---------------------------------------------------------------------------

/** Read-only snapshot of the mock client list. Always available. */
export const MOCK_CLIENTS: ReadonlyArray<ClientProfile> = CLIENT_PROFILES;

export function getMockClient(id: string): ClientProfile | null {
  return MOCK_CLIENTS.find((c) => c.id === id) ?? null;
}

// ---------------------------------------------------------------------------
