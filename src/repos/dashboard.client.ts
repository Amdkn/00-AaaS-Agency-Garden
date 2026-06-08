import 'client-only';
// src/repos/dashboard.repo.ts
// Phase D — Per-view data repo for Dashboard (KPIs, alerts, client widgets).
//
// Server-side: getDashboardMetrics aggregates KPIs + alerts + active client
// widgets in a single cached call. Falls back to mocks when Supabase isn't
// ready. Client-side: exposes the mock dataset for the SPA views.

import { KPIS, ALERTS, CLIENT_WIDGETS, AI_AGENTS } from '@/lib/constants';
import type { KPI, Alert, ClientWidget, Agent } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data accessors (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_KPIS: ReadonlyArray<KPI> = KPIS;
export const MOCK_ALERTS: ReadonlyArray<Alert> = ALERTS;
export const MOCK_CLIENT_WIDGETS: ReadonlyArray<ClientWidget> = CLIENT_WIDGETS;
export const MOCK_AGENTS: ReadonlyArray<Agent> = AI_AGENTS;

// ---------------------------------------------------------------------------
