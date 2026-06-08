-- 0002_solaris_saas_tables.sql
-- ADR-SUPABASE-001 — Tenant identity tables for Solaris (saas mode).
--
-- Three tables:
--   - organizations : one row per SMB customer account (the tenant root)
--   - memberships   : many-to-many user <-> org with a role
--   - profiles      : augments auth.users with AaaS profile data
--
-- Tenant data tables (clients, leads, transactions, tasks, sops, etc.)
-- are introduced later in Phase D as the views are wired up. They all
-- reference `organizations(id)` and use the same RLS predicate.
--
-- APPLY: via MCP `supabase-aspace` (BYPASS channel), `aspace_admin` role.
-- DO NOT apply from the ANON key.

-- ----------------------------------------------------------------------------
-- organizations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solaris_saas.organizations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  plan        text        NOT NULL DEFAULT 'starter',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT organizations_plan_chk
    CHECK (plan IN ('starter', 'growth', 'scale'))
);

CREATE INDEX IF NOT EXISTS organizations_name_idx
  ON solaris_saas.organizations (name);

COMMENT ON TABLE solaris_saas.organizations IS
  'Tenant root. Every business-data row in solaris_saas cascades from here.';

-- ----------------------------------------------------------------------------
-- memberships
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solaris_saas.memberships (
  user_id  uuid NOT NULL REFERENCES auth.users(id)        ON DELETE CASCADE,
  org_id   uuid NOT NULL REFERENCES solaris_saas.organizations(id) ON DELETE CASCADE,
  role     text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, org_id),

  CONSTRAINT memberships_role_chk
    CHECK (role IN ('owner', 'admin', 'member'))
);

CREATE INDEX IF NOT EXISTS memberships_org_idx
  ON solaris_saas.memberships (org_id);

CREATE INDEX IF NOT EXISTS memberships_user_idx
  ON solaris_saas.memberships (user_id);

COMMENT ON TABLE solaris_saas.memberships IS
  'User <-> organization mapping. Used by the custom access token hook (0006) '
  'to add `org_id` to the JWT.';

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solaris_saas.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  full_name   text        NULL,
  avatar_url  text        NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx
  ON solaris_saas.profiles (email);

COMMENT ON TABLE solaris_saas.profiles IS
  'Augments auth.users with AaaS profile fields. 1:1 with auth.users.';

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION solaris_saas.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS organizations_set_updated_at ON solaris_saas.organizations;
CREATE TRIGGER organizations_set_updated_at
  BEFORE UPDATE ON solaris_saas.organizations
  FOR EACH ROW EXECUTE FUNCTION solaris_saas.tg_set_updated_at();

DROP TRIGGER IF EXISTS profiles_set_updated_at ON solaris_saas.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON solaris_saas.profiles
  FOR EACH ROW EXECUTE FUNCTION solaris_saas.tg_set_updated_at();
