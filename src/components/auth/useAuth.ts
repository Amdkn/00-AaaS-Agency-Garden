// src/components/auth/useAuth.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — Thin consumer of the AuthContext.
//
// Throws if used outside <AuthProvider>. This is intentional: a missing
// provider is a programming error, not a runtime fallback case. Better to
// fail loudly during development than to silently render with `user: null`
// and hide the wiring mistake.

'use client';

import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthProvider';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useAuth must be used within <AuthProvider>. ' +
        'Wrap your root layout in <AuthProvider>{children}</AuthProvider>.',
    );
  }
  return ctx;
}
