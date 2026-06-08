// src/app/auth/signout/route.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — JSON sign-out endpoint.
//
// Some clients (e.g. a header dropdown) can't easily submit a `<form>`
// server action. They POST here instead. The route signs the user out
// via the server client (which writes cookie-clearing Set-Cookie headers)
// and returns `{ ok: true }`. The client can then `router.push('/')`.

import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
