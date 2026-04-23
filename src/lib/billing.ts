// ============================================================
// Billing — Tagadapay (NOT YET WIRED)
// ------------------------------------------------------------
// The Premium UI is built; the actual checkout call is stubbed.
// When Tagadapay credentials are provided we will:
//   1. Add secrets: TAGADAPAY_API_KEY, TAGADAPAY_WEBHOOK_SECRET,
//      TAGADAPAY_PRICE_MONTHLY, TAGADAPAY_PRICE_ANNUAL.
//   2. Create an edge function `tagadapay-checkout` that returns
//      a hosted checkout URL given a plan + the current user.
//   3. Create an edge function `tagadapay-webhook` that updates
//      the `subscriptions` row on `subscription.created`,
//      `.updated`, `.cancelled`, `.payment_succeeded`, etc.
//   4. Replace the body of `startCheckout` below with a fetch
//      to that edge function and a `window.location.href` redirect.
// ============================================================

import { toast } from 'sonner';

export type Plan = 'monthly' | 'annual';

const PENDING_INTENT_KEY = 'rtd_pending_premium_intent';

interface PendingIntent {
  plan: Plan;
  createdAt: string;
  email?: string | null;
}

export function getPendingIntent(): PendingIntent | null {
  try {
    const raw = localStorage.getItem(PENDING_INTENT_KEY);
    return raw ? (JSON.parse(raw) as PendingIntent) : null;
  } catch {
    return null;
  }
}

export function clearPendingIntent() {
  try {
    localStorage.removeItem(PENDING_INTENT_KEY);
  } catch {
    /* noop */
  }
}

/**
 * STUB — records intent in localStorage and notifies the user.
 * Replace with the Tagadapay checkout redirect once credentials are wired.
 */
export async function startCheckout(plan: Plan, email?: string | null): Promise<void> {
  const intent: PendingIntent = {
    plan,
    createdAt: new Date().toISOString(),
    email: email ?? null,
  };

  try {
    localStorage.setItem(PENDING_INTENT_KEY, JSON.stringify(intent));
  } catch {
    /* noop */
  }

  toast.success('You\'re on the early-access list', {
    description:
      'Premium checkout launches soon via Tagadapay — we\'ll email you the moment it\'s live.',
    duration: 6000,
  });
}

/**
 * STUB — opens the customer billing portal.
 * Will hit a Tagadapay billing-portal edge function once wired.
 */
export async function openCustomerPortal(): Promise<void> {
  toast.info('Billing portal coming soon', {
    description: 'Subscription management will be available once Tagadapay is connected.',
  });
}
