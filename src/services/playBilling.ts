// Per-platform billing router.
// - Native (Capacitor Android/iOS): RevenueCat → Google Play Billing / App Store IAP.
// - Web/PWA: Tagadapay checkout via src/lib/billing.ts.
//
// React components should prefer the `useSubscription` hook. This module exists
// for non-React callers and as the single place that knows which provider runs
// on which platform.
import { Capacitor } from '@capacitor/core';
import { startCheckout } from '@/lib/billing';
import {
  purchaseWeekly,
  restorePurchases as rcRestore,
  checkSubscriptionStatus as rcStatus,
} from '@/lib/revenuecat';
import { toast } from 'sonner';

export function isNativeBilling(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function purchaseSubscription(): Promise<void> {
  if (isNativeBilling()) {
    const result = await purchaseWeekly();
    if (!result.ok) {
      if (result.reason === 'cancelled') return;
      if (result.reason === 'no-key') {
        toast.error('Billing not configured', {
          description: 'RevenueCat API key missing. Add VITE_REVENUECAT_ANDROID_KEY in Project Settings.',
        });
      } else if (result.reason === 'no-offering') {
        toast.error('Subscription unavailable', {
          description: 'Could not load the Premium offering from the store. Try again shortly.',
        });
      } else {
        toast.error('Purchase failed', { description: result.error ?? 'Please try again.' });
      }
      throw new Error(result.error ?? `Purchase failed (${result.reason})`);
    }
    return;
  }
  // Web fallback — Tagadapay (currently stubbed)
  await startCheckout('monthly');
}

export async function restorePurchases(): Promise<void> {
  if (isNativeBilling()) {
    const result = await rcRestore();
    if (result.ok) {
      toast.success(result.isPremium ? 'Premium restored' : 'No active purchases found');
      return;
    }
    toast.error('Restore failed', { description: result.error ?? 'Please try again.' });
    return;
  }
  toast.info('Restore not available on web', {
    description: 'Sign in with the account that purchased Premium to restore access.',
  });
}

export async function checkSubscriptionStatus(): Promise<{ isPremium: boolean }> {
  if (isNativeBilling()) return rcStatus();
  return { isPremium: false };
}
