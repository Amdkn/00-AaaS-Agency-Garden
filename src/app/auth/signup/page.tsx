// src/app/auth/signup/page.tsx
// ADR-OMK-001 / ADR-SUPABASE-001 — Sign-up form for Solaris.
//
// Collects email + password + (in saas mode) the organization name. The
// server action posts to Supabase auth, which sends a confirmation email.
// On success the action redirects to /auth/check-email so the user sees
// a "check your inbox" message instead of being dumped on the dashboard
// before the email is confirmed.

'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { signUp, type SignUpState } from '../actions';
import { useAuth } from '@/components/auth/useAuth';
import { IS_SAAS } from '@/config/mode';

const INITIAL: SignUpState = { error: null, success: false };

export default function SignUpPage(): React.ReactElement {
  const { user, loading } = useAuth();
  const [state, formAction, pending] = useActionState(signUp, INITIAL);

  useEffect(() => {
    if (!loading && user) {
      redirect('/dashboard');
    }
  }, [user, loading]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 border border-stone-200">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">
            Créer un compte
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Rejoins ton jardin et commence à cultiver.
          </p>
        </header>

        <form action={formAction} className="space-y-4" noValidate>
          {IS_SAAS ? (
            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Nom de l&apos;organisation
              </label>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Acme Corp"
              />
            </div>
          ) : null}

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
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="8 caractères minimum"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Répète le mot de passe"
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
            {pending ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        <nav className="mt-6 text-center text-sm text-stone-600">
          <p>
            Déjà un compte ?{' '}
            <Link
              href="/auth/signin"
              className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </nav>
      </div>
    </main>
  );
}
