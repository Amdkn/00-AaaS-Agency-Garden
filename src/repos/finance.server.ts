import 'server-only';
import { MOCK_FINANCE_KPIS, MOCK_TRANSACTIONS, getMockTransaction } from './finance.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { FINANCE_KPI_CARDS, TRANSACTIONS } from '@/lib/constants';
import type { KPI, Transaction } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listTransactions = unstable_cache(
  async (): Promise<Transaction[]> => {
    if (!SUPABASE_READY) return [...MOCK_TRANSACTIONS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.warn('[finance.repo] listTransactions failed:', error.message);
      return [...MOCK_TRANSACTIONS];
    }
    return (data ?? []) as Transaction[];
  },
  ['list-transactions', APP_MODE],
  { tags: ['finance'], revalidate: 60 },
);

export async function getInvoice(id: string): Promise<Transaction | null> {
  if (!SUPABASE_READY) return getMockTransaction(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[finance.repo] getInvoice failed:', error.message);
    return getMockTransaction(id);
  }
  return (data as Transaction | null) ?? null;
}

export interface InvoiceInput {
  clientName: string;
  clientAvatar: string;
  amount: string;
  type: Transaction['type'];
  status: Transaction['status'];
  date: string;
}

export async function createInvoice(input: InvoiceInput): Promise<Transaction> {
  if (!SUPABASE_READY) {
    throw new Error('Supabase not configured — cannot persist invoice');
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('transactions')
    .insert(input)
    .select('*')
    .single();
  if (error || !data) {
    throw new Error(`[finance.repo] createInvoice failed: ${error?.message ?? 'no data'}`);
  }
  revalidateTag('finance', 'max');
  return data as Transaction;
}
