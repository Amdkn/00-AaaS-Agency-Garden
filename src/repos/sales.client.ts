import 'client-only';
// src/repos/sales.repo.ts
// Phase D — Per-view data repo for Sales (leads, deals, pipeline columns).

import { LEADS } from '@/lib/constants';
import type { Lead } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_DEALS: ReadonlyArray<Lead> = LEADS;

export function getMockDeal(id: string): Lead | null {
  return MOCK_DEALS.find((d) => d.id === id) ?? null;
}

// Sales view also uses inbox/agents/logs which are view-local data in
// Phase D. The repo exposes typed accessors so future phases can persist
// them server-side.

export interface SalesInboxEntry {
  id: string;
  name: string;
  agency: string;
  bleed: string;
  bottleneck: string;
}

export interface SalesAgentStatus {
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Processing';
  iconName: 'Brain' | 'Cpu' | 'ShieldCheck' | 'Activity';
}

export interface SalesPipelineColumn {
  title: string;
  items: { id: string; name: string; sub: string }[];
}

const MOCK_INBOX: SalesInboxEntry[] = [
  { id: '1', name: 'Alaric Chen', agency: 'Nebula Scale', bleed: '4,200', bottleneck: 'Manual Lead Scoring' },
  { id: '2', name: 'Sarah Jenkins', agency: 'Zenith SEO', bleed: '12,500', bottleneck: 'Unoptimized Outbound' },
  { id: '3', name: 'Marcus Thorne', agency: 'Crimson Creative', bleed: '8,900', bottleneck: 'Client Service Bottleneck' },
  { id: '4', name: 'Elena Vost', agency: 'Alpha Dev', bleed: '6,100', bottleneck: 'Low LTV Retention' },
];

const MOCK_AGENT_STATUS: SalesAgentStatus[] = [
  { name: 'Dr. Strange', role: 'Drafting Audits', status: 'Active', iconName: 'Brain' },
  { name: 'Iron Man', role: 'Generating UI Demos', status: 'Active', iconName: 'Cpu' },
  { name: 'Black Panther', role: 'Drafting Contracts', status: 'Idle', iconName: 'ShieldCheck' },
  { name: 'Namor', role: 'Filtering Intent', status: 'Processing', iconName: 'Activity' },
];

const MOCK_PIPELINE_COLUMNS: SalesPipelineColumn[] = [
  { title: 'Audit Sent', items: [{ id: 'p1', name: 'Nebula Scale', sub: 'Audit Delivered 2h ago' }] },
  { title: 'Demo Vault Active', items: [{ id: 'p2', name: 'Zenith SEO', sub: 'Active session (4m ago)' }] },
  { title: 'Proposal / Contract Sent', items: [{ id: 'p3', name: 'Alpha Dev', sub: 'Pending signature' }] },
  { title: 'Awaiting Stripe Deposit', items: [{ id: 'p4', name: 'Crimson Creative', sub: 'Stripe Invoice View' }] },
];

export const MOCK_SALES_INBOX: ReadonlyArray<SalesInboxEntry> = MOCK_INBOX;
export const MOCK_SALES_AGENT_STATUS: ReadonlyArray<SalesAgentStatus> = MOCK_AGENT_STATUS;
export const MOCK_SALES_PIPELINE: ReadonlyArray<SalesPipelineColumn> = MOCK_PIPELINE_COLUMNS;

// ---------------------------------------------------------------------------
