import 'server-only';
import { MOCK_LEADS, getMockLead } from './growth.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { LEADS } from '@/lib/constants';
import type { Lead } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export interface GrowthMetrics {
  leads: ReadonlyArray<Lead>;
  pipelineValue: string;
  activeCount: number;
}

const computePipelineValue = (leads: ReadonlyArray<Lead>): string => {
  // Sum the numeric portion of lead values like "€15k" / "€8k".
  const total = leads.reduce((sum, lead) => {
    const match = lead.value.match(/([\d.]+)\s*k/i);
    if (!match || !match[1]) return sum;
    const k = parseFloat(match[1]);
    return sum + (Number.isFinite(k) ? k * 1000 : 0);
  }, 0);
  return `€${Math.round(total / 1000)}k`;
};

export const getGrowthMetrics = unstable_cache(
  async (): Promise<GrowthMetrics> => {
    if (!SUPABASE_READY) {
      return {
        leads: MOCK_LEADS,
        pipelineValue: computePipelineValue(MOCK_LEADS),
        activeCount: MOCK_LEADS.filter((l) => l.status !== 'Won').length,
      };
    }
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('leads').select('*');
    if (error || !data) {
      console.warn('[growth.repo] getGrowthMetrics failed:', error?.message);
      return {
        leads: MOCK_LEADS,
        pipelineValue: computePipelineValue(MOCK_LEADS),
        activeCount: MOCK_LEADS.filter((l) => l.status !== 'Won').length,
      };
    }
    const leads = data as Lead[];
    return {
      leads,
      pipelineValue: computePipelineValue(leads),
      activeCount: leads.filter((l) => l.status !== 'Won').length,
    };
  },
  ['growth-metrics', APP_MODE],
  { tags: ['growth'], revalidate: 60 },
);

export const listCampaigns = unstable_cache(
  async (): Promise<Lead[]> => {
    if (!SUPABASE_READY) return [...MOCK_LEADS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('campaigns').select('*');
    if (error) {
      console.warn('[growth.repo] listCampaigns failed:', error.message);
      return [...MOCK_LEADS];
    }
    return (data ?? []) as Lead[];
  },
  ['list-campaigns', APP_MODE],
  { tags: ['growth'], revalidate: 60 },
);

export interface LeadInput {
  name: string;
  value: string;
  status: Lead['status'];
}

export async function createLead(input: LeadInput): Promise<Lead> {
  if (!SUPABASE_READY) {
    throw new Error('Supabase not configured — cannot persist lead');
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from('leads').insert(input).select('*').single();
  if (error || !data) {
    throw new Error(`[growth.repo] createLead failed: ${error?.message ?? 'no data'}`);
  }
  revalidateTag('growth', 'max');
  return data as Lead;
}
