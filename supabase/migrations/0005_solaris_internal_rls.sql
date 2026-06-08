-- 0005_solaris_internal_rls.sql
-- ADR-SUPABASE-001 / ADR-OMK-001 — Row Level Security for solaris_internal.
--
-- Internal data is NOT multi-tenant (every AaaS staff member sees the
-- same data set). The gate is role-based: a user must be present in
-- `solaris_internal.staff_users` with `is_active = true` to read or
-- write. Admin role unlocks audit log reads; everyone else sees only
-- their own audit log entries.
--
-- APPLY: via MCP `supabase-aspace` (BYPASS channel), `aspace_admin` role.

-- ----------------------------------------------------------------------------
-- Helper: is the caller an active staff user?
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION solaris_internal.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM solaris_internal.staff_users
    WHERE id = auth.uid()
      AND is_active = true
  );
$$;

COMMENT ON FUNCTION solaris_internal.is_staff() IS
  'True if the caller is an active AaaS staff user. Used by RLS policies '
  'in solaris_internal.';

-- ----------------------------------------------------------------------------
-- staff_users
-- ----------------------------------------------------------------------------
ALTER TABLE solaris_internal.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE solaris_internal.staff_users FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS staff_users_select_staff ON solaris_internal.staff_users;
CREATE POLICY staff_users_select_staff ON solaris_internal.staff_users
  FOR SELECT
  USING (solaris_internal.is_staff());

DROP POLICY IF EXISTS staff_users_update_self ON solaris_internal.staff_users;
CREATE POLICY staff_users_update_self ON solaris_internal.staff_users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Inserts and deletes on staff_users happen via the service role
-- (admin onboarding), not through the user-facing API.

-- ----------------------------------------------------------------------------
-- audit_logs
-- ----------------------------------------------------------------------------
ALTER TABLE solaris_internal.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE solaris_internal.audit_logs FORCE ROW LEVEL SECURITY;

-- Read: only admins can see the full log. Agents can see their own actions.
DROP POLICY IF EXISTS audit_logs_select_admin_or_self ON solaris_internal.audit_logs;
CREATE POLICY audit_logs_select_admin_or_self ON solaris_internal.audit_logs
  FOR SELECT
  USING (
    actor_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM solaris_internal.staff_users
      WHERE id = auth.uid()
        AND is_active = true
        AND role = 'admin'
    )
  );

-- Write: any active staff member can append. The actor_id is enforced
-- by the application layer to match auth.uid().
DROP POLICY IF EXISTS audit_logs_insert_staff ON solaris_internal.audit_logs;
CREATE POLICY audit_logs_insert_staff ON solaris_internal.audit_logs
  FOR INSERT
  WITH CHECK (
    solaris_internal.is_staff()
    AND (actor_id = auth.uid() OR actor_id IS NULL)
  );

-- No UPDATE/DELETE: audit_logs are append-only.
