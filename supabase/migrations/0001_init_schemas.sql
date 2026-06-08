-- 0001_init_schemas.sql
-- ADR-SUPABASE-001 — Multi-tenant schema bootstrap for Solaris (AaaS Agency Garden).
-- ADR-OMK-001 D2 — Dual-product mode (internal = staff, saas = SMB tenants).
--
-- This migration creates the two Postgres schemas that back the dual
-- runtime mode:
--   - solaris_internal : AaaS agency staff (the operators of the platform)
--   - solaris_saas     : multi-tenant SMB clients (the product customers)
--
-- Tables and RLS policies are added in the next migrations. The schemas
-- themselves are safe to CREATE in any order.
--
-- APPLY: via MCP `supabase-aspace` (BYPASS channel), requires `aspace_admin` role.
-- DO NOT apply from the ANON key.

-- pgcrypto provides gen_random_uuid() used by the table migrations.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Schemas. IF NOT EXISTS so re-runs are safe during iterative apply.
CREATE SCHEMA IF NOT EXISTS solaris_internal;
CREATE SCHEMA IF NOT EXISTS solaris_saas;

COMMENT ON SCHEMA solaris_internal IS
  'AaaS staff-only data. RLS gates by membership role (aaas_staff).';
COMMENT ON SCHEMA solaris_saas IS
  'Multi-tenant SMB data. RLS gates by org_id claim in the JWT.';

-- The supabase admin / migration role is the default owner of new tables
-- in these schemas. We grant usage to the standard PostgREST roles so the
-- API layer (PostgREST / PostGraphile) can describe and serve the tables
-- once they exist in a later migration.
GRANT USAGE ON SCHEMA solaris_internal TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA solaris_saas     TO anon, authenticated, service_role;
