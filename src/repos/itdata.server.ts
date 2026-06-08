import 'server-only';
import { MOCK_STACK_CONNECTIONS, getMockDataPoint } from './itdata.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { STACK_CONNECTIONS } from '@/lib/constants';
import type { StackConnection } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listDataSources = unstable_cache(
  async (): Promise<StackConnection[]> => {
    if (!SUPABASE_READY) return [...MOCK_STACK_CONNECTIONS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('stack_connections').select('*');
    if (error) {
      console.warn('[itdata.repo] listDataSources failed:', error.message);
      return [...MOCK_STACK_CONNECTIONS];
    }
    return (data ?? []) as StackConnection[];
  },
  ['list-data-sources', APP_MODE],
  { tags: ['itdata'], revalidate: 60 },
);

export async function getDataPoint(id: string): Promise<StackConnection | null> {
  if (!SUPABASE_READY) return getMockDataPoint(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('stack_connections')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[itdata.repo] getDataPoint failed:', error.message);
    return getMockDataPoint(id);
  }
  return (data as StackConnection | null) ?? null;
}

export async function refreshDataSource(id: string): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[itdata.repo] refreshDataSource no-op (mock mode)');
    revalidateTag('itdata', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('stack_connections')
    .update({ last_refresh: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.warn('[itdata.repo] refreshDataSource failed:', error.message);
    return;
  }
  revalidateTag('itdata', 'max');
}
