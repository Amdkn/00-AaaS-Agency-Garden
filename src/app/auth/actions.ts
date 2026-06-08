// src/app/auth/actions.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — Server actions for authentication.
//
// All auth flows are server actions so the URL state (redirects) is real
// navigation (good UX) and the Supabase client can use the request's cookies
// (RLS-correct). The server client is schema-aware: it targets
// `solaris_internal` for staff and `solaris_saas` for SMB tenants.
//
// SECURITY: never import these actions from a Client Component unless the
// Client Component wraps them in a `<form action={signIn}>` (Next.js wires
// the action over the network automatically). Don't call them directly from
// `onClick` handlers in client code — that path skips the CSRF protections
// that server actions get from Next.

'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { APP_MODE, IS_SAAS } from '@/config/mode';

/** Fields expected from the sign-in form. */
export interface SignInState {
  error: string | null;
}

/** Fields expected from the sign-up form. */
export interface SignUpState {
  error: string | null;
  success: boolean;
}

/**
 * Sign in with email + password. Redirects to /dashboard on success.
 *
 * Server actions can be invoked from a `<form action={signIn}>` with an
 * `email` and `password` field. Returns `{ error }` on failure so the
 * form can display the message without losing user input.
 */
export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email et mot de passe requis.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: sanitizeAuthError(error.message) };
  }

  // Successful sign-in: hand off to the dashboard.
  redirect('/dashboard');
}

/**
 * Sign up with email + password. In saas mode the form also collects an
 * organization name (used downstream in Phase D when an org is provisioned).
 *
 * The Supabase auth flow sends a confirmation email by default; the user
 * is then redirected to /auth/check-email so the UI can show a friendly
 * "look in your inbox" message.
 */
export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const organizationName = String(formData.get('organizationName') ?? '').trim();

  if (!email || !password) {
    return { error: 'Email et mot de passe requis.', success: false };
  }

  if (password.length < 8) {
    return {
      error: 'Le mot de passe doit faire au moins 8 caractères.',
      success: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Les mots de passe ne correspondent pas.',
      success: false,
    };
  }

  if (IS_SAAS && !organizationName) {
    return {
      error: "Le nom de l'organisation est requis en mode saas.",
      success: false,
    };
  }

  const supabase = await createSupabaseServerClient();

  // In saas mode we stash the org name in user_metadata; Phase D (or
  // Phase E migration) will read it back to provision the org row.
  // The formData shape is preserved across the redirect via the URL.
  const metadata: Record<string, string> = {};
  if (IS_SAAS && organizationName) {
    metadata['organization_name'] = organizationName;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: buildEmailRedirectUrl('/auth/callback'),
    },
  });

  if (error) {
    return { error: sanitizeAuthError(error.message), success: false };
  }

  redirect('/auth/check-email');
}

/**
 * Sign out the current user. Callable from a server action button or a
 * `form action={signOut}`. Redirects to / after clearing the session.
 */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}

/**
 * Build the email-redirect URL passed to Supabase's confirmation flow.
 * Uses NEXT_PUBLIC_SITE_URL when available (production behind Caddy/Traefik)
 * and falls back to the request's origin in dev.
 */
function buildEmailRedirectUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    '';
  if (base) {
    return `${base.replace(/\/$/, '')}${path}`;
  }
  return path;
}

/**
 * Map raw Supabase auth error messages to a user-friendly French string.
 * We keep the mapping conservative — anything we don't recognize falls
 * through to a generic message so we never leak server internals to the UI.
 */
function sanitizeAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (normalized.includes('user already registered')) {
    return 'Un compte existe déjà avec cet email.';
  }
  if (normalized.includes('email not confirmed')) {
    return "Vérifie ta boîte mail pour confirmer ton compte.";
  }
  if (normalized.includes('rate limit')) {
    return 'Trop de tentatives. Réessaie dans quelques minutes.';
  }
  if (normalized.includes('password should be at least')) {
    return 'Le mot de passe doit faire au moins 8 caractères.';
  }
  return "Une erreur est survenue. Réessaie.";
}

/** Internal helper exposed for unit tests + storybook stubs. */
export const __testing = { sanitizeAuthError, buildEmailRedirectUrl, APP_MODE };
