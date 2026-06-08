import 'client-only';
// src/repos/people.repo.ts
// Phase D — Per-view data repo for People (team members, role allocations).

import { TEAM_MEMBERS, ROLE_ALLOCATIONS } from '@/lib/constants';
import type { TeamMember, RoleAllocation } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_TEAM_MEMBERS: ReadonlyArray<TeamMember> = TEAM_MEMBERS;
export const MOCK_ROLE_ALLOCATIONS: ReadonlyArray<RoleAllocation> = ROLE_ALLOCATIONS;

export function getMockMember(id: string): TeamMember | null {
  return MOCK_TEAM_MEMBERS.find((m) => m.id === id) ?? null;
}

// ---------------------------------------------------------------------------
