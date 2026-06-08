# Solaris (AaaS Agency Garden) Dashboard — Workflow de Rebuild Deployment-Ready

> **Date** : 2026-06-08 · **Décideur** : A0 Amadeus · **Auteur** : Claude Code (A2, CLI frugal)
> **ADR** : `_SPECS/ADR/ADR-SUPABASE-001` (multi-tenant Supabase) + `_SPECS/ADR/ADR-OMK-001` (dual-product pattern, applied to Solaris)
> **Stack** : Next.js 16.2.6 · React 19.2.4 · TS 5 · Tailwind v4 · App Router
> **Repo** : `github.com/Amdkn/00-AaaS-Agency-Garden`

---

## 0. État vérifié (point de départ, 2026-06-08)

| Dimension | État réel |
|---|---|
| Stack | Next.js 16.2.6 + React 19.2.4 + TS 5 + Tailwind v4 + App Router |
| Modularisation | ✅ FAITE (12 views dans `src/components/views/`, `lib/types.ts` + `lib/constants.ts`) |
| Backend / persistance | ❌ 100% mock (`constants.ts`), aucun `@supabase/supabase-js` |
| Auth / tenant | ❌ aucun |
| Routing | ✅ App Router natif (`src/app/`), pas de dette routing |
| Déploiement | ❌ aucun `Dockerfile` / pas de `output: 'standalone'` |

> Solaris = "AaaS Agency Garden" — par nature **multi-tenant** (Agence-as-a-Service vendue à des clients). Contrairement à OMK où le mode `internal` est le principal, le mode `saas` est probablement le mode de référence pour Solaris.

---

## 1. Architecture cible

```
solaris/apps/dashboard/
├── src/
│   ├── app/                         # App Router (conservé)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── signin/page.tsx          # Phase B
│   │   ├── signup/page.tsx          # Phase B (saas)
│   │   └── api/                     # Route Handlers (Phase D)
│   ├── components/
│   │   ├── Sidebar / AiPanel / Toast / Modal (conservés)
│   │   └── views/                   # 12 views (conservées, branchement Phase D)
│   ├── config/
│   │   └── mode.ts                  # APP_MODE (NEXT_PUBLIC_APP_MODE)
│   ├── lib/
│   │   ├── types.ts                 # types métier (conservés)
│   │   ├── constants.ts             # mocks (conservés jusqu'à Phase D)
│   │   └── supabase/
│   │       ├── client.ts            # createBrowserClient schema-aware
│   │       ├── server.ts            # createServerClient schema-aware
│   │       └── index.ts             # barrel
│   ├── types/
│   │   └── supabase.ts              # Organization, Membership, SessionContext
│   └── middleware.ts                # refresh session + tenant stub
├── supabase/
│   └── migrations/                  # Phase C — RLS drafts
├── next.config.ts                   # output: 'standalone'
├── .env.example
└── REBUILD_WORKFLOW.md
```

---

## 2. Schémas Supabase (via MCP `supabase-aspace`, dépend ADR-SUPABASE-001)

### 2.1 `solaris_internal` (AaaS agence staff)

```sql
CREATE SCHEMA IF NOT EXISTS solaris_internal;
-- tables miroirs de types.ts (clients, leads, transactions, ...).
-- RLS: staff AaaS uniquement (membership rôle 'aaas_staff').
```

### 2.2 `solaris_saas` (multi-tenant SMB clients)

```sql
CREATE SCHEMA IF NOT EXISTS solaris_saas;

CREATE TABLE solaris_saas.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan text DEFAULT 'starter',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE solaris_saas.memberships (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id  uuid REFERENCES solaris_saas.organizations(id) ON DELETE CASCADE,
  role    text NOT NULL DEFAULT 'member',
  PRIMARY KEY (user_id, org_id)
);

-- chaque table métier porte org_id + RLS
CREATE TABLE solaris_saas.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES solaris_saas.organizations(id) ON DELETE CASCADE,
  name text, email text, status text, created_at timestamptz DEFAULT now()
);
ALTER TABLE solaris_saas.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON solaris_saas.clients
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid)
  WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
-- idem leads, transactions, tasks, sops, legal_docs, stack_connections
```

> `org_id` est injecté dans le JWT via un custom access token hook (Supabase) qui lit `memberships`.
> **Étape HITL (ADR-SUPABASE-001 D7)** : ajouter `solaris_internal,solaris_saas` à `PGRST_DB_SCHEMAS` + restart `supabase-core` (VPS).

---

## 3. Phases d'exécution (deployment-ready)

### Phase A — Fondations backend (LOCAL — ce PR) ✅
1. ✅ `npm i @supabase/supabase-js @supabase/ssr`
2. ✅ `src/config/mode.ts` — résout `NEXT_PUBLIC_APP_MODE`.
3. ✅ `src/lib/supabase/client.ts` — `createBrowserClient` schema-aware.
4. ✅ `src/lib/supabase/server.ts` — `createServerClient` schema-aware, cookies via `next/headers`.
5. ✅ `src/lib/supabase/index.ts` — barrel.
6. ✅ `src/types/supabase.ts` — Organization / Membership / SessionContext.
7. ✅ `src/middleware.ts` — refresh session (Edge-compatible), pas encore d'injection `org_id`.
8. ✅ `.env.example` — `NEXT_PUBLIC_APP_MODE`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only, commenté).
9. ✅ `next.config.ts` — `output: 'standalone'` (Docker Dokploy ready).
10. ✅ `npx tsc --noEmit` GREEN · `npm run lint` GREEN.

> Phase A est FOUNDATION ONLY : les mocks dans `src/lib/constants.ts` restent intacts. Les 12 views ne sont pas modifiées. On NE migre PAS les données. On NE touche PAS au VPS.

### Phase B — Auth flow (LOCAL) ✅
1. ✅ `src/app/auth/actions.ts` — `signIn` / `signUp` / `signOut` server actions (uses `createSupabaseServerClient`, schema-aware).
2. ✅ `src/app/auth/signin/page.tsx` — form with `useActionState`, redirects to `/dashboard` on success.
3. ✅ `src/app/auth/signup/page.tsx` — form collects org name in saas mode, redirects to `/auth/check-email`.
4. ✅ `src/app/auth/check-email/page.tsx` — post-signup confirmation prompt.
5. ✅ `src/app/auth/callback/route.ts` — OAuth / magic-link / email-confirm `GET` handler (exchanges `code` for session).
6. ✅ `src/app/auth/signout/route.ts` — JSON `POST` sign-out endpoint.
7. ✅ `src/components/auth/AuthProvider.tsx` — client-side context mirroring Supabase auth state.
8. ✅ `src/components/auth/useAuth.ts` — consumer hook (throws outside provider).
9. ✅ `src/app/layout.tsx` updated to wrap `<AuthProvider>{children}</AuthProvider>`.
10. ✅ `src/middleware.ts` updated: protected routes redirect to `/auth/signin`, signed-in users on auth pages go to `/dashboard`.

> Phase B keeps the 12 views on mocks. The dashboard home (`/`) is still reachable without auth in this phase — the route gate applies once each view is moved to its own URL (a Phase D-DX polish task). Auth itself works locally once `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`.

### Phase C — RLS + custom access token hook (LOCAL draft, BYPASS apply) ✅
1. ✅ `supabase/migrations/0001_init_schemas.sql` — `solaris_internal` + `solaris_saas` schemas (draft, apply via VPS).
2. ✅ `supabase/migrations/0002_solaris_saas_tables.sql` — `organizations`, `memberships`, `profiles` tables in `solaris_saas`.
3. ✅ `supabase/migrations/0003_solaris_saas_rls.sql` — RLS policies (org_id-claim based) for the saas tables.
4. ✅ `supabase/migrations/0004_solaris_internal_tables.sql` — `staff_users`, `audit_logs` in `solaris_internal`.
5. ✅ `supabase/migrations/0005_solaris_internal_rls.sql` — RLS for internal schema (role-based: admin / manager / agent).
6. ✅ `supabase/migrations/0006_custom_access_token_hook.sql` — `public.custom_access_token_hook` function (DRAFT, `aspace_admin` role to apply).
7. ✅ `src/middleware.ts` reads `app_metadata.org_id` from the user and forwards it as `x-tenant-org-id`. In saas mode, a missing org_id on a protected route returns 403.
8. ✅ `src/components/auth/useSessionContext.ts` — client-side `useSessionContext()` returning `{ session, user, orgId, role, isStaff, isSaas, isInternal, mode, loading }`.

> Phase C is DRAFT ONLY locally. The SQL files have not been applied to a live database — that happens in Phase E via MCP `supabase-aspace` (BYPASS channel). The middleware stub for `x-tenant-org-id` works without the hook active (the value is just `null`).

### What's in this PR (B + C)

```
src/app/auth/
  ├── actions.ts                 (server actions: signIn / signUp / signOut)
  ├── signin/page.tsx            (sign-in form)
  ├── signup/page.tsx            (sign-up form)
  ├── check-email/page.tsx       (post-signup confirmation page)
  ├── callback/route.ts          (OAuth / email-confirm callback)
  └── signout/route.ts           (JSON sign-out endpoint)
src/components/auth/
  ├── AuthProvider.tsx           (client-side auth context)
  ├── useAuth.ts                 (consumer hook, throws outside provider)
  └── useSessionContext.ts       (org_id / role / mode reader)
src/app/layout.tsx               (updated to wrap <AuthProvider>)
src/middleware.ts                (updated: protected routes, x-tenant-org-id, 403 gate)
supabase/migrations/
  ├── 0001_init_schemas.sql
  ├── 0002_solaris_saas_tables.sql
  ├── 0003_solaris_saas_rls.sql
  ├── 0004_solaris_internal_tables.sql
  ├── 0005_solaris_internal_rls.sql
  └── 0006_custom_access_token_hook.sql
```

### Phase D — Repositories + branchement views (LOCAL)
1. `src/data/*.repo.ts` (findAll/create/update RLS-scoped) : `clients.repo.ts`, `tasks.repo.ts`, `leads.repo.ts`, `transactions.repo.ts`, `sops.repo.ts`, `agents.repo.ts`, `legal.repo.ts`, `stack.repo.ts`.
2. Brancher les 12 views sur les repos (suppression des imports `constants`).
3. Loading/empty/error states (les views étaient sur data synchrone).
4. `useSWR` ou server actions selon le besoin (préférer server actions par défaut pour la cohérence Next.js 16).

### Phase E — Schémas Supabase VPS (BYPASS)
1. `create_project_schema('solaris_internal')` + `create_project_schema('solaris_saas')` via MCP `supabase-aspace`.
2. Migrations tables + RLS (section 2).
3. Seed depuis `lib/constants.ts` dans `solaris_internal` pour démo.
4. `generate_typescript_types` → `src/lib/database.types.ts`.
5. Reload `PGRST_DB_SCHEMAS` (HITL VPS, restart `supabase-core`).

### Phase F — MCP `supabase-solaris` / `supabase-aspace` (BYPASS)
1. MCP `supabase-solaris` (read-only, ANON role) pour dev local + tests E2E.
2. MCP `supabase-aspace` (write, `aspace_admin` role) pour admin tasks.

### Phase G — Déploiement Dokploy (BYPASS)
1. 2 services Dokploy : `solaris-dashboard-internal` (NEXT_PUBLIC_APP_MODE=internal) + `solaris-dashboard-saas` (NEXT_PUBLIC_APP_MODE=saas).
2. Image Docker Next standalone (`output: 'standalone'` → `node server.js`).
3. Env Supabase par service. Routes Caddy/Traefik (sous-domaines distincts).
4. Smoke test : login, CRUD scoped, **test isolation org A vs org B**.

### Phase H — Tests isolation + handoff (BYPASS)
1. Test adversarial : un user org A ne lit jamais les données org B (RLS).
2. Mise à jour README (remplace boilerplate).
3. Commit conventionnel + push `00-AaaS-Agency-Garden`.
4. MAJ `30_MEMORY_CORE/README.md` + registre schémas (`L0/.../multi_tenant.md`).

---

## 4. Garde-fous
- **Le mode ne se déduit jamais du client seul** — validé serveur + JWT (sinon fuite cross-produit).
- **`SUPABASE_SERVICE_ROLE_KEY` jamais côté client** — pas de préfixe `NEXT_PUBLIC_`. Réservé à un `admin.ts` non encore créé.
- RLS testée avant tout trafic réel.
- Born-short (ADR-INFRA-002) : le repo build-bearing reste à `30_Business_OS/...` court ; vérifier MAX_PATH Windows.
- Migration scope strict : cette PR NE migre PAS les données, NE modifie PAS les mocks, NE modifie PAS les 12 views.

---

## 5. Différences avec OMK (cadre)

| Dimension | OMK | Solaris |
|---|---|---|
| Framework | Vite + Express | Next.js (App Router) |
| Client Supabase | `@supabase/supabase-js` direct | `@supabase/ssr` (browser + server) |
| Env prefix | `VITE_*` | `NEXT_PUBLIC_*` (et server-only sans préfixe) |
| Tenant resolution | client flag (UI hint) | `middleware.ts` lit JWT + injecte `org_id` |
| Server prod | `server.js` Express | `output: 'standalone'` → `node .next/standalone/server.js` |
| Routing | react-router (Phase E) | App Router natif (déjà OK) |
| Image Dokploy | Dockerfile + Express | Image Next standalone (1 service / mode) |

> Tout le reste (ADR-OMK-001 dual-product, ADR-SUPABASE-001 multi-tenancy par schéma, RLS + JWT `org_id`, MCP dual `supabase-solaris` read / `supabase-aspace` write) est identique.

---

## 6. Dépendances bloquantes

| Bloqueur | Statut | Canal |
|---|---|---|
| ADR-SUPABASE-001 ratifié | ✅ ACCEPTED | — |
| ADR-OMK-001 ratifié | ✅ ACCEPTED | — |
| Phase A livrée | ✅ GREEN (tsc + eslint) | LOCAL (ce PR) |
| Phases B–D (auth, RLS drafts, repos) | ⏳ à venir | LOCAL |
| Phase E (schémas VPS) | ⏳ bloqué | BYPASS (MCP `supabase-aspace`) |
| Phase F (MCP dédiés) | ⏳ bloqué | BYPASS |
| Phase G (Dokploy) | ⏳ bloqué | BYPASS |
| Phase H (tests isolation prod) | ⏳ bloqué | BYPASS |

> Le rebuild suit le pattern du skill `picard-audit-and-prod-workflow` (audit→migrate→verify→GitHub→Dokploy), étendu avec la couche Supabase multi-tenant. Réutiliser ce skill, ne pas en créer un nouveau.
