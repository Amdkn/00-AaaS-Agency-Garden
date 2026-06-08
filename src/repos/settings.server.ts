import 'server-only';
import type { BrandingSettings, SubscriptionSettings } from './settings.client';
import { MOCK_BRANDING, MOCK_SUBSCRIPTION } from './settings.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const getSettings = unstable_cache(
  async (): Promise<{ branding: BrandingSettings; subscription: SubscriptionSettings }> => {
    if (!SUPABASE_READY) {
      return { branding: MOCK_BRANDING, subscription: MOCK_SUBSCRIPTION };
    }
    const supabase = await getSupabaseServer();
    const [brandingRes, subscriptionRes] = await Promise.all([
      supabase.from('branding_settings').select('*').maybeSingle(),
      supabase.from('subscription_settings').select('*').maybeSingle(),
    ]);
    if (brandingRes.error || subscriptionRes.error) {
      console.warn(
        '[settings.repo] getSettings partial failure, using mocks:',
        brandingRes.error?.message ?? subscriptionRes.error?.message,
      );
      return { branding: MOCK_BRANDING, subscription: MOCK_SUBSCRIPTION };
    }
    return {
      branding: (brandingRes.data as BrandingSettings | null) ?? MOCK_BRANDING,
      subscription: (subscriptionRes.data as SubscriptionSettings | null) ?? MOCK_SUBSCRIPTION,
    };
  },
  ['settings', APP_MODE],
  { tags: ['settings'], revalidate: 60 },
);

export async function updateBranding(patch: Partial<BrandingSettings>): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[settings.repo] updateBranding no-op (mock mode)');
    revalidateTag('settings', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from('branding_settings').update(patch).eq('id', 'singleton');
  if (error) {
    console.warn('[settings.repo] updateBranding failed:', error.message);
    return;
  }
  revalidateTag('settings', 'max');
}

export async function updateSubscription(
  patch: Partial<SubscriptionSettings>,
): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[settings.repo] updateSubscription no-op (mock mode)');
    revalidateTag('settings', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('subscription_settings')
    .update(patch)
    .eq('id', 'singleton');
  if (error) {
    console.warn('[settings.repo] updateSubscription failed:', error.message);
    return;
  }
  revalidateTag('settings', 'max');
}
