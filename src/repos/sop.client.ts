import 'client-only';
// src/repos/sop.repo.ts
// Phase D — Per-view data repo for SOP Library (standard operating procedures).

import { SOPS } from '@/lib/constants';
import type { SOP } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_SOPS: ReadonlyArray<SOP> = SOPS;

export function getMockSop(id: string): SOP | null {
  return MOCK_SOPS.find((s) => s.id === id) ?? null;
}

// ---------------------------------------------------------------------------
