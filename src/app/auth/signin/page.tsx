// src/app/auth/signin/page.tsx
// ADR-OMK-001 / ADR-SUPABASE-001 — Sign-in form for Solaris.
//
// Uses `useActionState` so the server action's returned error renders
// inline without losing user input. The form posts to the `signIn` server
// action defined in `../actions.ts`. Successful sign-in redirects to
// /dashboard (handled inside the action).

'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn, type SignInState } from '../actions';
import { useAuth } from '@/components/auth/useAuth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const INITIAL: SignInState = { error: null };

export default function SignInPage(): React.ReactElement {
  const { user, loading } = useAuth();
  const [state, formAction, pending] = useActionState(signIn, INITIAL);

  // If the user is already signed in, send them straight to the dashboard.
  // This makes the page safe to land on when a user clicks a stale link
  // after they have already authenticated.
  useEffect(() => {
    if (!loading && user) {
      redirect('/dashboard');
    }
  }, [user, loading]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 border border-stone-200">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">
            Connexion
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Accède à ton jardin digital.
          </p>
        </header>

        <form action={formAction} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="toi@exemple.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="••••••••"
            />
          </div>

          {state.error ? (
            <p
              role="alert"
              className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {pending ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <nav className="mt-6 text-center text-sm text-stone-600 space-y-2">
          <p>
            <Link
              href="/auth/forgot"
              className="text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </p>
          <p>
            Pas encore de compte ?{' '}
            <Link
              href="/auth/signup"
              className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </nav>
      </div>
    </main>
  );
}
