import 'client-only';
// src/repos/itdata.repo.ts
// Phase D — Per-view data repo for IT & Infrastructure (stack connections).

import { STACK_CONNECTIONS } from '@/lib/constants';
import type { StackConnection } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_STACK_CONNECTIONS: ReadonlyArray<StackConnection> = STACK_CONNECTIONS;

export function getMockDataPoint(id: string): StackConnection | null {
  return MOCK_STACK_CONNECTIONS.find((c) => c.id === id) ?? null;
}

// ---------------------------------------------------------------------------
