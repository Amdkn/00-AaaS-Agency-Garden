// src/types/supabase.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — Multi-tenant shape for Solaris (AaaS Agency Garden).
// This file only declares the TYPES of the multi-tenant primitives (org, membership, mode).
// It does NOT replace `src/lib/types.ts` (which holds the domain shapes).
//
// Phase A is FOUNDATION only — these types are referenced by auth/session code added in Phase B
// and by the per-view data hooks added in Phase D. They are NOT yet wired to a generated
// Supabase `Database` type (that arrives in Phase B after `generate_typescript_types`).

import type { AppMode } from '@/config/mode';

/** Application mode at runtime (mirrors AppMode in config/mode.ts for re-export convenience). */
export type { AppMode };

/** Postgres role / schema identifier resolved at boot (see config/mode.ts). */
export type DbSchema = 'solaris_internal' | 'solaris_saas';

/** A row in the `organizations` table (saas mode only). */
export interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'growth' | 'scale' | string;
  created_at: string;
}

/** A row in the `memberships` join table (saas mode only). */
export interface Membership {
  user_id: string;
  org_id: string;
  role: 'owner' | 'admin' | 'member' | string;
}

/** A row in the `profiles` table — augments auth.users with AaaS profile data. */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

/**
 * Shape of the session returned by the browser/server Supabase clients.
 * Phase A does not yet inject `org_id`; Phase C will add the custom access token hook.
 */
export interface SessionContext {
  user: Profile | null;
  org: Organization | null;
  membership: Membership | null;
  mode: AppMode;
  schema: DbSchema;
}
