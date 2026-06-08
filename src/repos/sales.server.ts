import 'server-only';
import { MOCK_DEALS, getMockDeal, MOCK_SALES_INBOX, MOCK_SALES_AGENT_STATUS, MOCK_SALES_PIPELINE } from './sales.client';
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

export const listLeads = unstable_cache(
  async (): Promise<Lead[]> => {
    if (!SUPABASE_READY) return [...MOCK_DEALS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('leads').select('*');
    if (error) {
      console.warn('[sales.repo] listLeads failed:', error.message);
      return [...MOCK_DEALS];
    }
    return (data ?? []) as Lead[];
  },
  ['list-leads', APP_MODE],
  { tags: ['sales'], revalidate: 60 },
);

export const listDeals = listLeads; // alias — same dataset in Phase D.

export async function getLead(id: string): Promise<Lead | null> {
  if (!SUPABASE_READY) return getMockDeal(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[sales.repo] getLead failed:', error.message);
    return getMockDeal(id);
  }
  return (data as Lead | null) ?? null;
}

export async function markAuditReviewed(leadName: string): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn(`[sales.repo] markAuditReviewed no-op (mock mode) for ${leadName}`);
    revalidateTag('sales', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('leads')
    .update({ audit_reviewed: true })
    .eq('name', leadName);
  if (error) {
    console.warn('[sales.repo] markAuditReviewed failed:', error.message);
    return;
  }
  revalidateTag('sales', 'max');
}
