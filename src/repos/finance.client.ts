import 'client-only';
// src/repos/finance.repo.ts
// Phase D — Per-view data repo for Finance (KPIs, transactions).

import { FINANCE_KPI_CARDS, TRANSACTIONS } from '@/lib/constants';
import type { KPI, Transaction } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_FINANCE_KPIS: ReadonlyArray<KPI> = FINANCE_KPI_CARDS;
export const MOCK_TRANSACTIONS: ReadonlyArray<Transaction> = TRANSACTIONS;

export function getMockTransaction(id: string): Transaction | null {
  return MOCK_TRANSACTIONS.find((t) => t.id === id) ?? null;
}

// ---------------------------------------------------------------------------
