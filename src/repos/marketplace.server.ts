import 'server-only';
import { MOCK_LISTINGS, getMockListing } from './marketplace.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { MARKETPLACE_ITEMS } from '@/lib/constants';
import type { MarketplaceItem } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listListings = unstable_cache(
  async (): Promise<MarketplaceItem[]> => {
    if (!SUPABASE_READY) return [...MOCK_LISTINGS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('marketplace_listings').select('*');
    if (error) {
      console.warn('[marketplace.repo] listListings failed:', error.message);
      return [...MOCK_LISTINGS];
    }
    return (data ?? []) as MarketplaceItem[];
  },
  ['list-listings', APP_MODE],
  { tags: ['marketplace'], revalidate: 60 },
);

export async function getListing(id: string): Promise<MarketplaceItem | null> {
  if (!SUPABASE_READY) return getMockListing(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('marketplace_listings')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[marketplace.repo] getListing failed:', error.message);
    return getMockListing(id);
  }
  return (data as MarketplaceItem | null) ?? null;
}

export async function activateListing(id: string): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[marketplace.repo] activateListing no-op (mock mode)');
    revalidateTag('marketplace', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('marketplace_listings')
    .update({ activated: true })
    .eq('id', id);
  if (error) {
    console.warn('[marketplace.repo] activateListing failed:', error.message);
    return;
  }
  revalidateTag('marketplace', 'max');
}
