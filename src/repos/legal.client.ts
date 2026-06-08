import 'client-only';
// src/repos/legal.repo.ts
// Phase D — Per-view data repo for Legal (contracts, documents).

import { LEGAL_DOCS } from '@/lib/constants';
import type { LegalDoc } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_LEGAL_DOCS: ReadonlyArray<LegalDoc> = LEGAL_DOCS;

export function getMockContract(id: string): LegalDoc | null {
  return MOCK_LEGAL_DOCS.find((d) => d.id === id) ?? null;
}

// ---------------------------------------------------------------------------
