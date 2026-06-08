import 'client-only';
// src/repos/marketplace.repo.ts
// Phase D — Per-view data repo for Marketplace (modules, listings).

import { MARKETPLACE_ITEMS } from '@/lib/constants';
import type { MarketplaceItem } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_LISTINGS: ReadonlyArray<MarketplaceItem> = MARKETPLACE_ITEMS;

export function getMockListing(id: string): MarketplaceItem | null {
  return MOCK_LISTINGS.find((i) => i.id === id) ?? null;
}

// ---------------------------------------------------------------------------
