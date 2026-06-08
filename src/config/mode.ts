// src/config/mode.ts
// ADR-OMK-001 D1 / ADR-SUPABASE-001 — Dual-product runtime mode resolution for Solaris (AaaS).
// 'internal' = AaaS agency staff operating its OWN business OS (schema solaris_internal, staff auth)
// 'saas'     = productized multi-tenant AaaS Agency Garden sold to Small Business clients
//              (schema solaris_saas, org_id + RLS)
//
// Next.js adaptation:
// - Replaces OMK's Vite `import.meta.env.VITE_APP_MODE` with `process.env.NEXT_PUBLIC_APP_MODE`.
// - `NEXT_PUBLIC_*` is safe to ship to the browser; the SERVICE_ROLE_KEY is NOT (see supabase/server.ts).
//
// SECURITY (ADR-OMK-001 consequences): the client-side mode is a UI hint only.
// True data isolation is enforced server-side by Postgres RLS + JWT claims, never by this flag alone.

export type AppMode = 'internal' | 'saas';

const RAW = (process.env.NEXT_PUBLIC_APP_MODE ?? 'internal').toString().toLowerCase();

export const APP_MODE: AppMode = RAW === 'saas' ? 'saas' : 'internal';

/** Postgres schema the Supabase client should target for this mode. */
export const DB_SCHEMA: 'solaris_internal' | 'solaris_saas' =
  APP_MODE === 'saas' ? 'solaris_saas' : 'solaris_internal';

export const IS_SAAS: boolean = APP_MODE === 'saas';
export const IS_INTERNAL: boolean = APP_MODE === 'internal';
