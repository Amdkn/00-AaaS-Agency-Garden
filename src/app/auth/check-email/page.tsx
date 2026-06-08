// src/app/auth/check-email/page.tsx
// ADR-OMK-001 / ADR-SUPABASE-001 — Post-signup confirmation page.
//
// The server action `signUp` redirects here after a successful registration.
// The actual confirmation happens via the email link (which routes through
// /auth/callback). This page just shows a friendly "check your inbox" prompt.

import Link from 'next/link';

export const metadata = {
  title: 'Vérifie ta boîte mail — Solaris',
};

export default function CheckEmailPage(): React.ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 border border-stone-200 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700">
          <span aria-hidden="true" className="text-2xl">
            ✉
          </span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-emerald-900">
          Vérifie ta boîte mail
        </h1>
        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
          On t&apos;a envoyé un lien de confirmation. Clique dessus pour
          activer ton compte et accéder à ton jardin.
        </p>
        <p className="text-xs text-stone-500 mt-6">
          Tu n&apos;as rien reçu ? Vérifie ton dossier de courrier indésirable,
          ou{' '}
          <Link
            href="/auth/signup"
            className="text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            réessaie avec un autre email
          </Link>
          .
        </p>
        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="text-sm text-stone-500 hover:text-emerald-700"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </main>
  );
}
