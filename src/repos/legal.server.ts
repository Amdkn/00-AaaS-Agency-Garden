import 'server-only';
import { MOCK_LEGAL_DOCS, getMockContract } from './legal.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { LEGAL_DOCS } from '@/lib/constants';
import type { LegalDoc } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listContracts = unstable_cache(
  async (): Promise<LegalDoc[]> => {
    if (!SUPABASE_READY) return [...MOCK_LEGAL_DOCS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from('legal_docs')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.warn('[legal.repo] listContracts failed:', error.message);
      return [...MOCK_LEGAL_DOCS];
    }
    return (data ?? []) as LegalDoc[];
  },
  ['list-contracts', APP_MODE],
  { tags: ['legal'], revalidate: 60 },
);

export async function getContract(id: string): Promise<LegalDoc | null> {
  if (!SUPABASE_READY) return getMockContract(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('legal_docs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[legal.repo] getContract failed:', error.message);
    return getMockContract(id);
  }
  return (data as LegalDoc | null) ?? null;
}

export interface ComplianceMetrics {
  score: number;
  signedCount: number;
  pendingCount: number;
  draftCount: number;
}

export const getComplianceMetrics = unstable_cache(
  async (): Promise<ComplianceMetrics> => {
    const docs = [...MOCK_LEGAL_DOCS];
    if (SUPABASE_READY) {
      const supabase = await getSupabaseServer();
      const { data, error } = await supabase.from('legal_docs').select('*');
      if (!error && data) {
        return compute(data as LegalDoc[]);
      }
    }
    return compute(docs);
  },
  ['compliance-metrics', APP_MODE],
  { tags: ['legal'], revalidate: 60 },
);

const compute = (docs: LegalDoc[]): ComplianceMetrics => {
  const signed = docs.filter((d) => d.status === 'Signed').length;
  const pending = docs.filter((d) => d.status === 'Pending').length;
  const draft = docs.filter((d) => d.status === 'Draft').length;
  const total = docs.length || 1;
  return {
    score: Math.round((signed / total) * 100),
    signedCount: signed,
    pendingCount: pending,
    draftCount: draft,
  };
};

export async function signContract(id: string): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[legal.repo] signContract no-op (mock mode)');
    revalidateTag('legal', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('legal_docs')
    .update({ status: 'Signed' })
    .eq('id', id);
  if (error) {
    console.warn('[legal.repo] signContract failed:', error.message);
    return;
  }
  revalidateTag('legal', 'max');
}
