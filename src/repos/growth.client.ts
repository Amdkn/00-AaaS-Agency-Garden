import 'client-only';
// src/repos/growth.repo.ts
// Phase D — Per-view data repo for Growth (leads, pipeline).

import { LEADS } from '@/lib/constants';
import type { Lead } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_LEADS: ReadonlyArray<Lead> = LEADS;

export function getMockLead(id: string): Lead | null {
  return MOCK_LEADS.find((l) => l.id === id) ?? null;
}

// ---------------------------------------------------------------------------
