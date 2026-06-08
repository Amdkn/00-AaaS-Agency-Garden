import 'client-only';
import type { Task } from '@/lib/types';
// src/repos/tasks.repo.ts
// Phase D — Per-view data repo for Tasks.
//
// Tasks have a client-local persistence layer (localStorage) in the existing
// SPA UX. The repo provides:
//   - MOCK_TASKS / getMockTask — client-safe read accessors (mock fallback).
//   - listTasks / getTask / createTask / updateTask / completeTask — server
//     functions intended for Server Components / Route Handlers / Server
//     Actions. They use the schema-aware Supabase server client and
//     revalidate the 'tasks' cache tag on mutation.

import { TASKS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_TASKS: ReadonlyArray<Task> = TASKS;

export function getMockTask(id: string): Task | null {
  return MOCK_TASKS.find((t) => t.id === id) ?? null;
}

// ---------------------------------------------------------------------------
