// src/middleware.ts
// ADR-OMK-001 D3 / ADR-SUPABASE-001 — Next.js Edge middleware.
//
// Responsibilities (cumulative across phases):
//   Phase A — refresh the Supabase auth session on every request.
//   Phase B — gate protected routes (redirect to /auth/signin if no user)
//             and (in saas mode) verify that the JWT carries an `org_id`.
//   Phase C — inject `x-tenant-org-id` as a request header so Server
//             Components and Route Handlers can branch on the tenant
//             without re-parsing the cookie.
//
// Edge-runtime compatible: no Node-only APIs, no `next/headers` imports.

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { IS_SAAS } from '@/config/mode';

/**
 * Routes that require a signed-in user. Mirrors the 12 views in
 * src/components/views/ — keep this list in sync if you add a new view.
 */
const PROTECTED_ROUTES: ReadonlyArray<string> = [
  '/dashboard',
  '/finance',
  '/people',
  '/tasks',
  '/clients',
  '/sop-library',
  '/legal',
  '/growth',
  '/marketplace',
  '/it-data',
  '/settings',
  '/sales',
];

/** Auth-only routes. If a signed-in user lands here, send them to /dashboard. */
const AUTH_ROUTES: ReadonlyArray<string> = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot',
  '/auth/check-email',
];

/** Path prefixes that should never be gated (auth internals, public pages). */
const PUBLIC_PREFIXES: ReadonlyArray<string> = [
  '/auth/callback',
  '/auth/signout',
  '/api/',
  '/_next/',
  '/favicon',
];

/**
 * True if the pathname is a protected route (exact match or sub-path).
 * e.g. `/dashboard` matches `/dashboard` and `/dashboard/settings`.
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Build a mutable response so Supabase can refresh the auth cookies.
  let response: NextResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // No env configured — let the request through. Components that need
    // data will surface the missing-env state via SUPABASE_READY flags.
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
  // supabase.auth.getUser(). Same constraint as Phase A.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // 1. Authenticated users hitting auth pages go to the dashboard.
  if (user && isAuthRoute(pathname)) {
    const dest = request.nextUrl.clone();
    dest.pathname = '/dashboard';
    dest.search = '';
    return NextResponse.redirect(dest);
  }

  // 2. Unauthenticated users on protected routes go to /auth/signin.
  //    (We allow public prefixes and non-protected paths to pass through
  //    unchanged — the public landing page still works without auth.)
  if (!user && !isPublicPath(pathname) && isProtectedRoute(pathname)) {
    const dest = request.nextUrl.clone();
    dest.pathname = '/auth/signin';
    dest.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(dest);
  }

  // 3. Tenant header injection (Phase C stub).
  //    In saas mode the custom access token hook adds `org_id` to the JWT.
  //    We surface it as a request header so downstream code can read it
  //    cheaply. In saas mode, a missing `org_id` for a signed-in user
  //    means the membership has not been provisioned — we return 403.
  if (user) {
    const orgId = extractOrgId(user);
    if (IS_SAAS && !orgId) {
      // No membership yet — block the protected route. We use 403 rather
      // than redirecting to /signup so the user knows it's a provisioning
      // problem, not a missing-account one.
      return new NextResponse(
        'Tenant membership missing. Contact your admin to be invited to an organization.',
        { status: 403 },
      );
    }
    if (orgId) {
      // Forward the header to downstream handlers. We rebuild the response
      // so the new request headers (with x-tenant-org-id) take effect for
      // Server Components and Route Handlers downstream.
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-tenant-org-id', orgId);
      response = NextResponse.next({ request: { headers: requestHeaders } });
    }
  }

  return response;
}

/**
 * Extract the org_id from the user's JWT claims.
 * Supabase's custom access token hook puts custom claims in
 * `app_metadata` (server-controlled) and `user_metadata` (user-editable).
 * We prefer `app_metadata` because it can only be set by the hook.
 */
function extractOrgId(user: { app_metadata?: Record<string, unknown> | null; user_metadata?: Record<string, unknown> | null }): string | null {
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

export const config = {
  /**
   * Match all paths except Next internals, the favicon, and static assets
   * (anything containing a dot — images, .css, .js, etc.). This keeps the
   * middleware focused on application routes and avoids serving redundant
   * cookie work for static files.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
