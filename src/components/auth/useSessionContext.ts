// src/components/auth/useSessionContext.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — Read the full session context from the AuthProvider.
//
// Wraps `useAuth()` and extracts the `org_id`, `role`, and the `isSaas` /
// `isInternal` mode flags. Memoized so consumers don't trigger re-renders
// when the parent context value identity changes for unrelated reasons.
//
// In Phase A / B, `org_id` is read from the user's `app_metadata` (which
// is populated by the custom access token hook in 0006 once the VPS-side
// hook is active). Until then, the field is null in internal mode and
// best-effort in saas mode.

'use client';

import { useMemo } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { useAuth } from './useAuth';
import { APP_MODE, IS_INTERNAL, IS_SAAS } from '@/config/mode';

export interface SessionContextValue {
  session: Session | null;
  user: User | null;
  orgId: string | null;
  role: 'owner' | 'admin' | 'member' | string | null;
  isStaff: boolean;
  loading: boolean;
  isSaas: boolean;
  isInternal: boolean;
  mode: typeof APP_MODE;
}

/**
 * Read `org_id` from the user's `app_metadata` or `user_metadata` blocks.
 * `app_metadata` is server-controlled (set by the custom access token hook
 * in 0006) so we prefer it; `user_metadata` is the fallback for the brief
 * window between signup and hook activation.
 */
function readOrgId(user: User | null): string | null {
  if (!user) return null;
  const fromApp = user.app_metadata?.['org_id'];
  if (typeof fromApp === 'string' && fromApp.length > 0) {
    return fromApp;
  }
  const fromUser = user.user_metadata?.['org_id'];
  if (typeof fromUser === 'string' && fromUser.length > 0) {
    return fromUser;
  }
  return null;
}

function readRole(user: User | null): SessionContextValue['role'] {
  if (!user) return null;
  const fromApp = user.app_metadata?.['org_role'];
  if (typeof fromApp === 'string' && fromApp.length > 0) {
    return fromApp;
  }
  return null;
}

function readIsStaff(user: User | null): boolean {
  if (!user) return false;
  const flag = user.app_metadata?.['is_aaas_staff'];
  return flag === true;
}

export function useSessionContext(): SessionContextValue {
  const { user, session, loading } = useAuth();

  return useMemo<SessionContextValue>(
    () => ({
      session,
      user,
      orgId: readOrgId(user),
      role: readRole(user),
      isStaff: readIsStaff(user),
      loading,
      isSaas: IS_SAAS,
      isInternal: IS_INTERNAL,
      mode: APP_MODE,
    }),
    [user, session, loading],
  );
}
