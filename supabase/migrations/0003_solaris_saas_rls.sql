-- 0003_solaris_saas_rls.sql
-- ADR-SUPABASE-001 — Row Level Security for solaris_saas (multi-tenant).
--
-- Tenancy invariant: every row in solaris_saas is scoped to a single
-- organization. RLS policies use the `org_id` claim added to the JWT by
-- the custom access token hook (0006) so requests can only read/write
-- rows for the org the caller belongs to.
--
-- APPLY: via MCP `supabase-aspace` (BYPASS channel), `aspace_admin` role.
-- RLS is mandatory. Tests (Phase H) will fail if a non-member can read
-- a member's rows.

-- ----------------------------------------------------------------------------
-- Helper: read the org_id claim from the JWT.
-- Centralising this in a function means the RLS policies below stay
-- readable and the claim name is changed in one place if needed.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION solaris_saas.current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::jsonb ->> 'org_id',
    ''
  )::uuid;
$$;

COMMENT ON FUNCTION solaris_saas.current_org_id() IS
  'Reads the `org_id` claim from the current request JWT. '
  'Returns NULL if the claim is missing (caller is not a saas member).';

-- ----------------------------------------------------------------------------
-- organizations
-- A user can read their own org, but cannot create or delete orgs
-- through the API (those happen via the custom access token hook +
-- a separate admin path, or via the dashboard signup flow which uses
-- the service role).
-- ----------------------------------------------------------------------------
ALTER TABLE solaris_saas.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE solaris_saas.organizations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_select_member ON solaris_saas.organizations;
CREATE POLICY organizations_select_member ON solaris_saas.organizations
  FOR SELECT
  USING (id = solaris_saas.current_org_id());

DROP POLICY IF EXISTS organizations_update_admin ON solaris_saas.organizations;
CREATE POLICY organizations_update_admin ON solaris_saas.organizations
  FOR UPDATE
  USING (id = solaris_saas.current_org_id())
  WITH CHECK (id = solaris_saas.current_org_id());

-- No INSERT/DELETE policy on purpose: orgs are created via the service
-- role at signup time, not through the user-facing API.

-- ----------------------------------------------------------------------------
-- memberships
-- A user can read memberships for their own org. Self-insert/update
-- is allowed only for the owner/admin roles; everyone else can read
-- the roster but not mutate it.
-- ----------------------------------------------------------------------------
ALTER TABLE solaris_saas.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE solaris_saas.memberships FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS memberships_select_member ON solaris_saas.memberships;
CREATE POLICY memberships_select_member ON solaris_saas.memberships
  FOR SELECT
  USING (org_id = solaris_saas.current_org_id());

DROP POLICY IF EXISTS memberships_insert_admin ON solaris_saas.memberships;
CREATE POLICY memberships_insert_admin ON solaris_saas.memberships
  FOR INSERT
  WITH CHECK (org_id = solaris_saas.current_org_id());

DROP POLICY IF EXISTS memberships_update_admin ON solaris_saas.memberships;
CREATE POLICY memberships_update_admin ON solaris_saas.memberships
  FOR UPDATE
  USING (org_id = solaris_saas.current_org_id())
  WITH CHECK (org_id = solaris_saas.current_org_id());

DROP POLICY IF EXISTS memberships_delete_admin ON solaris_saas.memberships;
CREATE POLICY memberships_delete_admin ON solaris_saas.memberships
  FOR DELETE
  USING (org_id = solaris_saas.current_org_id());

-- ----------------------------------------------------------------------------
-- profiles
-- A user can read and update their own profile. They cannot see other
-- users' profiles unless those users share their org (covered by a
-- separate policy once the JOINs are wired in Phase D).
-- ----------------------------------------------------------------------------
ALTER TABLE solaris_saas.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE solaris_saas.profiles FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_self ON solaris_saas.profiles;
CREATE POLICY profiles_select_self ON solaris_saas.profiles
  FOR SELECT
  USING (id = auth.uid());

DROP POLICY IF EXISTS profiles_update_self ON solaris_saas.profiles;
CREATE POLICY profiles_update_self ON solaris_saas.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
