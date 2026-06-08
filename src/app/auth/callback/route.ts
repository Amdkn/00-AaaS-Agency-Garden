// src/app/auth/callback/route.ts
// ADR-OMK-001 / ADR-SUPABASE-001 — OAuth / magic link / email-confirm callback.
//
// Supabase redirects users here with a `code` query param after they click
// the confirmation link in their email (or after a third-party OAuth flow
// completes). This route exchanges the code for a session, then redirects
// to /dashboard. If anything goes wrong we fall back to /auth/signin with
// an error reason in the query string so the form can display it.

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/signin?error=missing_code`,
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const reason = encodeURIComponent(error.message);
    return NextResponse.redirect(
      `${origin}/auth/signin?error=${reason}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
