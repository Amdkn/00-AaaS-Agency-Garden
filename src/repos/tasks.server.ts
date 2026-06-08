import 'server-only';
import { MOCK_TASKS, getMockTask } from './tasks.client';
import type { Task } from '@/lib/types';
import { unstable_cache, revalidateTag } from 'next/cache';
import { SUPABASE_READY } from '@/lib/supabase/client';
import { APP_MODE } from '@/config/mode';
// Server-side cached queries
// ---------------------------------------------------------------------------

async function getSupabaseServer() {
  const { createSupabaseServerClient } = await import('@/lib/supabase/server');
  return createSupabaseServerClient();
}

export const listTasks = unstable_cache(
  async (): Promise<Task[]> => {
    if (!SUPABASE_READY) return [...MOCK_TASKS];
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('deadline', { ascending: true });
    if (error) {
      console.warn('[tasks.repo] listTasks failed:', error.message);
      return [...MOCK_TASKS];
    }
    return (data ?? []) as Task[];
  },
  ['list-tasks', APP_MODE],
  { tags: ['tasks'], revalidate: 60 },
);

export async function getTask(id: string): Promise<Task | null> {
  if (!SUPABASE_READY) return getMockTask(id);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.warn('[tasks.repo] getTask failed:', error.message);
    return getMockTask(id);
  }
  return (data as Task | null) ?? null;
}

export interface TaskInput {
  title: string;
  project: string;
  deadline: string;
  completed: boolean;
  sopLink?: string;
}

export async function createTask(input: TaskInput): Promise<Task> {
  if (!SUPABASE_READY) {
    throw new Error('Supabase not configured — cannot persist task');
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from('tasks').insert(input).select('*').single();
  if (error || !data) {
    throw new Error(`[tasks.repo] createTask failed: ${error?.message ?? 'no data'}`);
  }
  revalidateTag('tasks', 'max');
  return data as Task;
}

export async function updateTask(id: string, patch: Partial<TaskInput>): Promise<Task> {
  if (!SUPABASE_READY) {
    throw new Error('Supabase not configured — cannot update task');
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('tasks')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) {
    throw new Error(`[tasks.repo] updateTask failed: ${error?.message ?? 'no data'}`);
  }
  revalidateTag('tasks', 'max');
  return data as Task;
}

export async function completeTask(id: string, completed: boolean): Promise<void> {
  if (!SUPABASE_READY) {
    console.warn('[tasks.repo] completeTask no-op (mock mode)');
    revalidateTag('tasks', 'max');
    return;
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from('tasks')
    .update({ completed, completed_at: completed ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) {
    console.warn('[tasks.repo] completeTask failed:', error.message);
    return;
  }
  revalidateTag('tasks', 'max');
}
