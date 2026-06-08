-- 0006_custom_access_token_hook.sql
-- ADR-SUPABASE-001 — Custom access token hook for Solaris (AaaS Agency Garden).
--
-- DRAFT: requires `aspace_admin` role to apply (VPS only).
--
-- This function is invoked by Supabase's GoTrue auth server every time
-- it mints a JWT for a user. We use it to read the caller's membership
-- in `solaris_saas.memberships` and stamp the resulting `org_id` (and
-- role) into the JWT claims. The downstream RLS policies (0003, 0005)
-- read those claims via `auth.jwt() ->> 'org_id'`.
--
-- The function MUST be:
--   - SECURITY DEFINER (so it can read memberships on behalf of the user)
--   - named `public.custom_access_token_hook` (Supabase convention)
--   - registered with the auth hook config in `goTrue` (separate VPS step)
--
-- The trigger registration (ALTER ROLE / supabase_auth config) is done
-- out-of-band at VPS time — see Phase E for the BYPASS steps.
--
-- APPLY: via MCP `supabase-aspace` (BYPASS channel), `aspace_admin` role.

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims     jsonb;
  user_id    uuid;
  user_email text;
  is_staff   boolean;
  membership record;
BEGIN
  -- The event payload is the standard Supabase hook shape. See:
  --   https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook
  claims := event->'claims';
  user_id := (event->>'user_id')::uuid;
  user_email := event->>'user_email';

  IF user_id IS NULL THEN
    -- Nothing to enrich without a user; return the event unchanged.
    RETURN event;
  END IF;

  -- Staff check (solaris_internal). A staff member of the AaaS agency
  -- sees ALL saas data via the service role path; here we only need
  -- to know whether to add a staff flag to the JWT for downstream RLS.
  SELECT EXISTS (
    SELECT 1
    FROM solaris_internal.staff_users
    WHERE id = user_id
      AND is_active = true
  ) INTO is_staff;

  -- Membership lookup (solaris_saas). We pick the *first* active
  -- membership if the user belongs to more than one org. In Phase D
  -- we may need to model multi-org users explicitly via a "active_org"
  -- preference; for the MVP a single membership is the norm.
  SELECT m.org_id, m.role
    INTO membership
    FROM solaris_saas.memberships m
    JOIN solaris_saas.organizations o ON o.id = m.org_id
   WHERE m.user_id = user_id
   ORDER BY m.created_at ASC
   LIMIT 1;

  -- Inject our claims. We use `app_metadata` semantics by writing to a
  -- nested object so the existing `app_metadata` block stays untouched
  -- (the GoTrue layer merges this back into the JWT).
  claims := jsonb_set(
    claims,
    '{app_metadata,org_id}',
    to_jsonb(membership.org_id),
    true
  );
  claims := jsonb_set(
    claims,
    '{app_metadata,org_role}',
    to_jsonb(membership.role),
    true
  );
  claims := jsonb_set(
    claims,
    '{app_metadata,is_aaas_staff}',
    to_jsonb(is_staff),
    true
  );

  -- Echo the email into a known location (handy for server logs and
  -- audit trail correlation). It already lives in `email`; we keep
  -- this comment to make the shape explicit for future maintainers.
  IF user_email IS NOT NULL THEN
    claims := jsonb_set(
      claims,
      '{app_metadata,email_verified_at_signin}',
      to_jsonb(user_email),
      true
    );
  END IF;

  -- Return the full event with the modified claims block.
  event := jsonb_set(event, '{claims}', claims, false);
  RETURN event;
END;
$$;

COMMENT ON FUNCTION public.custom_access_token_hook(jsonb) IS
  'Supabase custom access token hook. Stamps `org_id`, `org_role`, and '
  '`is_aaas_staff` from memberships + staff_users into the JWT claims. '
  'Read by RLS policies (0003, 0005) and by the Next.js middleware '
  '(src/middleware.ts) for the x-tenant-org-id header.';

-- Permissions: GoTrue runs the hook as the authenticator role.
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb)
  TO supabase_auth_admin, supabase_admin;
