import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { CLIENT_PROFILES } from '@/lib/constants';
import type { ClientProfile } from '@/lib/types';
import { MOCK_CLIENTS, getMockClient } from './clients.client';
// Server-side cached queries (Server Components / Route Handlers)
// ---------------------------------------------------------------------------

/**
 * Lazy import of the Supabase server client. We keep it out of the static
 * module graph so the file stays client-importable.
 */
async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

const fetchClientsLive = async (): Promise<ClientProfile[]> => {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[clients.repo] listClients live query failed:', error.message);
    return [...MOCK_CLIENTS];
  }
  return (data ?? []) as ClientProfile[];
};

export const listClients = unstable_cache(
  async (): Promise<ClientProfile[]> => {
    if (!SUPABASE_READY) return [...MOCK_CLIENTS];
    return fetchClientsLive();
  },
  ['list-clients', APP_MODE],
  { tags: ['clients'], revalidate: 60 },
);

export async function getClient(id: string): Promise<ClientProfile | null> {
  if (!SUPABASE_READY) return getMockClient(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[clients.repo] getClient failed:', error.message);
    return getMockClient(id);
  }
  return (data as ClientProfile | null) ?? null;
}

// ---------------------------------------------------------------------------
// Mutations — revalidate the 'clients' tag on success
// ---------------------------------------------------------------------------

export interface ClientInput {
  name: string;
  logo: string;
  contactName: string;
  healthScore: number;
  tier: string;
  status: ClientProfile['status'];
}

export async function createClient(input: ClientInput): Promise<ClientProfile> {
  if (!SUPABASE_READY) {
    throw new Error('Supabase not configured — cannot persist client');
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('clients')
    .insert(input)
    .select('*')
    .single();
  if (error || !data) {
    throw new Error(`[clients.repo] createClient failed: ${error?.message ?? 'no data'}`);
  }
  revalidateTag('clients', 'max');
  return data as ClientProfile;
}

export async function updateClient(
  id: string,
  patch: Partial<ClientInput>,
): Promise<ClientProfile> {
  if (!SUPABASE_READY) {
    throw new Error('Supabase not configured — cannot update client');
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('clients')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) {
    throw new Error(`[clients.repo] updateClient failed: ${error?.message ?? 'no data'}`);
  }
  revalidateTag('clients', 'max');
  return data as ClientProfile;
}
