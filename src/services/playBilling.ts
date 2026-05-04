// Per-platform billing wrapper.
// - Native (Capacitor Android/iOS): routes to Google Play Billing / App Store IAP.
//   Real plugin (@capacitor-community/in-app-purchases) installation + Play Console
//   SKU setup is a follow-up task. Until then, calling purchaseSubscription on
//   native throws a clear configuration error.
// - Web/PWA: routes to Tagadapay checkout via existing src/lib/billing.ts.
import { Capacitor } from '@capacitor/core';
import { startCheckout } from '@/lib/billing';
import { toast } from 'sonner';

const PREMIUM_SKU = 'premium_weekly_trial';

export function isNativeBilling(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function purchaseSubscription(): Promise<void> {
  if (isNativeBilling()) {
    // TODO: Wire @capacitor-community/in-app-purchases once the SKU
    // `premium_weekly_trial` is configured in Google Play Console.
    toast.error('Play Billing not yet configured', {
      description: `Configure SKU "${PREMIUM_SKU}" in Play Console, then install @capacitor-community/in-app-purchases.`,
    });
    throw new Error('Play Billing SKU not configured');
  }
  // Web fallback — Tagadapay (currently stubbed)
  await startCheckout('monthly');
}

export async function restorePurchases(): Promise<void> {
  if (isNativeBilling()) {
    toast.info('Restore purchases', {
      description: 'Play Billing not yet configured. Once SKUs are live, this will restore an existing subscription.',
    });
    return;
  }
  toast.info('Restore not available on web', {
    description: 'Sign in with the account that purchased Premium to restore access.',
  });
}
