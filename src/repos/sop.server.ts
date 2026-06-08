import 'server-only';
import { MOCK_SOPS, getMockSop } from './sop.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { SOPS } from '@/lib/constants';
import type { SOP } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listSops = unstable_cache(
  async (): Promise<SOP[]> => {
    if (!SUPABASE_READY) return [...MOCK_SOPS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('sops').select('*');
    if (error) {
      console.warn('[sop.repo] listSops failed:', error.message);
      return [...MOCK_SOPS];
    }
    return (data ?? []) as SOP[];
  },
  ['list-sops', APP_MODE],
  { tags: ['sops'], revalidate: 60 },
);

export async function getSop(id: string): Promise<SOP | null> {
  if (!SUPABASE_READY) return getMockSop(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('sops')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[sop.repo] getSop failed:', error.message);
    return getMockSop(id);
  }
  return (data as SOP | null) ?? null;
}

export async function markSopRead(sopId: string): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[sop.repo] markSopRead no-op (mock mode)');
    revalidateTag('sops', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('sops')
    .update({ last_read_at: new Date().toISOString() })
    .eq('id', sopId);
  if (error) {
    console.warn('[sop.repo] markSopRead failed:', error.message);
    return;
  }
  revalidateTag('sops', 'max');
}
