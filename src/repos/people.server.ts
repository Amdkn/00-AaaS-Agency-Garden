import 'server-only';
import { MOCK_TEAM_MEMBERS, MOCK_ROLE_ALLOCATIONS, getMockMember } from './people.client';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
import { TEAM_MEMBERS, ROLE_ALLOCATIONS } from '@/lib/constants';
import type { TeamMember, RoleAllocation } from '@/lib/types';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    if (!SUPABASE_READY) return [...MOCK_TEAM_MEMBERS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('team_members').select('*');
    if (error) {
      console.warn('[people.repo] listMembers failed:', error.message);
      return [...MOCK_TEAM_MEMBERS];
    }
    return (data ?? []) as TeamMember[];
  },
  ['list-members', APP_MODE],
  { tags: ['people'], revalidate: 60 },
);

export async function getMember(id: string): Promise<TeamMember | null> {
  if (!SUPABASE_READY) return getMockMember(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[people.repo] getMember failed:', error.message);
    return getMockMember(id);
  }
  return (data as TeamMember | null) ?? null;
}

export const listRoleAllocations = unstable_cache(
  async (): Promise<RoleAllocation[]> => {
    if (!SUPABASE_READY) return [...MOCK_ROLE_ALLOCATIONS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('role_allocations').select('*');
    if (error) {
      console.warn('[people.repo] listRoleAllocations failed:', error.message);
      return [...MOCK_ROLE_ALLOCATIONS];
    }
    return (data ?? []) as RoleAllocation[];
  },
  ['list-role-allocations', APP_MODE],
  { tags: ['people'], revalidate: 60 },
);

export async function updateMemberLoad(id: string, load: number): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[people.repo] updateMemberLoad no-op (mock mode)');
    revalidateTag('people', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('team_members')
    .update({ load })
    .eq('id', id);
  if (error) {
    console.warn('[people.repo] updateMemberLoad failed:', error.message);
    return;
  }
  revalidateTag('people', 'max');
}
