-- 0004_solaris_internal_tables.sql
-- ADR-SUPABASE-001 / ADR-OMK-001 — Internal-schema tables for AaaS staff.
--
-- Two tables in this migration:
--   - staff_users  : AaaS agency staff who can log in to the platform
--                    itself (the operators, not the customers). 1:1 with
--                    auth.users, but filtered to the staff role.
--   - audit_logs   : append-only log of staff actions across the platform
--                    (e.g. "Béatrice created a new org for Acme").
--
-- Business data (clients, leads, transactions, ...) is introduced in
-- Phase D alongside the repos in `src/data/`.
--
-- APPLY: via MCP `supabase-aspace` (BYPASS channel), `aspace_admin` role.

-- ----------------------------------------------------------------------------
-- staff_users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solaris_internal.staff_users (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  full_name   text        NULL,
  role        text        NOT NULL DEFAULT 'agent',
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT staff_users_role_chk
    CHECK (role IN ('admin', 'manager', 'agent'))
);

CREATE INDEX IF NOT EXISTS staff_users_email_idx
  ON solaris_internal.staff_users (email);

CREATE INDEX IF NOT EXISTS staff_users_role_idx
  ON solaris_internal.staff_users (role)
  WHERE is_active = true;

COMMENT ON TABLE solaris_internal.staff_users IS
  'AaaS agency staff directory. Filters to active rows when listing '
  'assignable users (e.g. for task ownership).';

-- ----------------------------------------------------------------------------
-- audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solaris_internal.audit_logs (
  id          bigserial   PRIMARY KEY,
  actor_id    uuid        NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  target_type text        NULL,
  target_id   text        NULL,
  payload     jsonb       NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_actor_idx
  ON solaris_internal.audit_logs (actor_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_target_idx
  ON solaris_internal.audit_logs (target_type, target_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_occurred_at_idx
  ON solaris_internal.audit_logs (occurred_at DESC);

COMMENT ON TABLE solaris_internal.audit_logs IS
  'Append-only audit trail. Writes go through the service role or an '
  'admin caller. Reads are gated by RLS in 0005.';

-- ----------------------------------------------------------------------------
-- updated_at trigger (re-uses the same pattern as 0002 but in
-- solaris_internal).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION solaris_internal.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS staff_users_set_updated_at ON solaris_internal.staff_users;
CREATE TRIGGER staff_users_set_updated_at
  BEFORE UPDATE ON solaris_internal.staff_users
  FOR EACH ROW EXECUTE FUNCTION solaris_internal.tg_set_updated_at();
