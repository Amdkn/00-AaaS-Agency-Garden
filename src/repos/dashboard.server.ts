import 'server-only';
import { MOCK_KPIS, MOCK_ALERTS, MOCK_CLIENT_WIDGETS, MOCK_AGENTS } from './dashboard.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { KPIS, ALERTS, CLIENT_WIDGETS, AI_AGENTS } from '@/lib/constants';
import type { KPI, Alert, ClientWidget, Agent } from '@/lib/types';
// Server-side aggregate
// ---------------------------------------------------------------------------

export interface DashboardMetrics {
  kpis: ReadonlyArray<KPI>;
  alerts: ReadonlyArray<Alert>;
  clientWidgets: ReadonlyArray<ClientWidget>;
  agents: ReadonlyArray<Agent>;
}

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const getDashboardMetrics = unstable_cache(
  async (): Promise<DashboardMetrics> => {
    if (!SUPABASE_READY) {
      return {
        kpis: MOCK_KPIS,
        alerts: MOCK_ALERTS,
        clientWidgets: MOCK_CLIENT_WIDGETS,
        agents: MOCK_AGENTS,
      };
    }
    const supabase = await getSupabaseServer();
    const [kpisRes, alertsRes, widgetsRes, agentsRes] = await Promise.all([
      supabase.from('dashboard_kpis').select('*'),
      supabase.from('alerts').select('*').order('date', { ascending: false }),
      supabase.from('client_widgets').select('*'),
      supabase.from('agents').select('*'),
    ]);

    const safe = <T,>(res: { data: T[] | null; error: { message: string } | null }, fallback: T): T => {
      if (res.error) {
        console.warn('[dashboard.repo] subquery failed:', res.error.message);
        return fallback;
      }
      return (res.data ?? fallback) as T;
    };

    return {
      kpis: safe(kpisRes, [...MOCK_KPIS] as KPI[]),
      alerts: safe(alertsRes, [...MOCK_ALERTS] as Alert[]),
      clientWidgets: safe(widgetsRes, [...MOCK_CLIENT_WIDGETS] as ClientWidget[]),
      agents: safe(agentsRes, [...MOCK_AGENTS] as Agent[]),
    };
  },
  ['dashboard-metrics', APP_MODE],
  { tags: ['dashboard'], revalidate: 60 },
);

export async function dismissAlert(alertId: string): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[dashboard.repo] dismissAlert no-op (mock mode)');
    revalidateTag('dashboard', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from('alerts').update({ dismissed: true }).eq('id', alertId);
  if (error) {
    console.warn('[dashboard.repo] dismissAlert failed:', error.message);
    return;
  }
  revalidateTag('dashboard', 'max');
}
