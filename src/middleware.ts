// src/middleware.ts
// ADR-OMK-001 D3 / ADR-SUPABASE-001 — Next.js Edge middleware: session refresh + tenant stub.
//
// Phase A scope:
//  1. Refresh the Supabase auth session on every request (writes refreshed
//     tokens back to cookies via `setAll`).
//  2. Read the user with `supabase.auth.getUser()` so a missing/invalid token
//     is detected early and an empty session is forwarded downstream.
//
// Out of scope for Phase A (Phase C):
//  - Reading `org_id` from the JWT and forwarding it as a request header
//    (e.g. `x-tenant-org-id`) so Server Components / Route Handlers can
//    branch on it without re-parsing the cookie.
//  - Custom access token hook that injects `org_id` into the JWT (VPS work).
//
// This file MUST remain Edge-runtime compatible — no Node-only APIs, no
// imports from `next/headers` (cookies()/headers() are server-only).

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Build a mutable response so Supabase can refresh the auth cookies.
  let response: NextResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // When env is missing, skip the refresh (devs will see logs from
  // supabase/client.ts and supabase/server.ts). Avoid throwing in middleware
  // because the Edge runtime has no console-friendly surface for unhandled
  // rejections on every request.
  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: do not run any other code between createServerClient and
  // supabase.auth.getUser(). A common mistake is to add logic here that
  // runs the user out of the cookie scope, which can break session refresh.
  //
  // We deliberately do NOT branch on the user here yet — Phase A is the
  // refresh scaffold. Phase C will inspect the user and redirect unauth
  // requests to /signin.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  /**
   * Match all paths except Next internals, the favicon, and static assets
   * (anything containing a dot — images, .css, .js, etc.). This keeps the
   * middleware focused on application routes and avoids serving redundant
   * cookie work for static files.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
