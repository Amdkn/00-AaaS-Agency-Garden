// src/components/auth/AuthProvider.tsx
// ADR-OMK-001 / ADR-SUPABASE-001 — Client-side auth context for Solaris.
//
// This provider mirrors the Supabase auth state into React state so any
// client component can read `user`, `session`, and `loading` without
// re-subscribing to Supabase directly. It also surfaces `signOut()` so
// sign-out can be triggered from a button (the form-action version lives
// in `app/auth/actions.ts`).
//
// Wiring:
//   - Wrap the root layout in <AuthProvider>{children}</AuthProvider>.
//   - Inside a client component, call `useAuth()` to consume the context.

'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase/client';

export interface AuthContextValue {
  /** Current Supabase user, or `null` when signed out. */
  user: User | null;
  /** Current Supabase session, or `null` when signed out. */
  session: Session | null;
  /** `true` while the initial session is being resolved. */
  loading: boolean;
  /**
   * Sign the current user out. Resolves once the local session is cleared
   * (Supabase handles the cookie clearing on the browser).
   */
  signOut: () => Promise<void>;
  /**
   * Manually refresh the session/user (useful after a server action that
   * mutated auth state — e.g. sign-in redirects).
   */
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const applySession = (next: Session | null): void => {
      if (!mounted) return;
      setSession(next);
      setUser(next?.user ?? null);
    };

    // 1. Resolve the initial session.
    void supabaseBrowser.auth.getSession().then(({ data }) => {
      applySession(data.session ?? null);
      if (mounted) setLoading(false);
    });

    // 2. Subscribe to changes (sign-in, sign-out, token refresh).
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, next) => {
      applySession(next);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await supabaseBrowser.auth.signOut();
    // onAuthStateChange will fire SIGNED_OUT and clear state for us.
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const { data } = await supabaseBrowser.auth.getSession();
    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, signOut, refresh }),
    [user, session, loading, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
