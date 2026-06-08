import 'client-only';
// src/repos/settings.repo.ts
// Phase D — Per-view data repo for Settings (branding, subscription).


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BrandingSettings {
  agencyName: string;
  slogan: string;
  primaryColor: string;
  logoUrl: string | null;
}

export interface SubscriptionSettings {
  tier: 'Tier 1: Starter' | 'Tier 2: Sovereign Box' | 'Tier 3: Enterprise';
  monthlyPrice: number;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
  renewalDate: string;
}

// ---------------------------------------------------------------------------
// Mock data (client-safe)
// ---------------------------------------------------------------------------

export const MOCK_BRANDING: BrandingSettings = {
  agencyName: "A'Space Agency",
  slogan: 'Future of Work',
  primaryColor: '#059669',
  logoUrl: null,
};

export const MOCK_SUBSCRIPTION: SubscriptionSettings = {
  tier: 'Tier 2: Sovereign Box',
  monthlyPrice: 199,
  paymentMethod: {
    brand: 'Visa',
    last4: '4242',
    expiry: '12/25',
  },
  renewalDate: '2026-07-01',
};

// ---------------------------------------------------------------------------
