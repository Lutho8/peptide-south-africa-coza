// React hook around RevenueCat (native) with web fallback to Tagadapay.
// Initializes on mount when a user is signed in, exposes Premium status
// + purchase/restore/refresh actions, and never throws.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  initializeBilling,
  purchaseWeekly,
  restorePurchases as rcRestore,
  checkSubscriptionStatus,
} from '@/lib/revenuecat';
import { isNativeBilling, purchaseSubscription as webPurchase } from '@/services/playBilling';

export interface UseSubscriptionResult {
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  /** Native: RevenueCat purchase. Web: Tagadapay checkout. */
  purchase: () => Promise<{ ok: boolean; cancelled?: boolean }>;
  /** Native: restore previous purchases. Web: no-op (sign-in is the restore). */
  restore: () => Promise<{ ok: boolean }>;
  /** Re-read entitlement state from the store. */
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionResult {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initFor = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { isPremium } = await checkSubscriptionStatus();
      setIsPremium(isPremium);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check subscription');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const userId = user?.id ?? null;

    async function run() {
      setIsLoading(true);
      setError(null);

      if (!isNativeBilling() || !userId) {
        if (!cancelled) {
          setIsPremium(false);
          setIsLoading(false);
        }
        return;
      }

      if (initFor.current === userId) {
        await refresh();
        if (!cancelled) setIsLoading(false);
        return;
      }

      const init = await initializeBilling(userId);
      if (!init.ok && init.reason !== 'not-native') {
        if (!cancelled) {
          setError(init.error ?? `Billing init failed (${init.reason})`);
          setIsLoading(false);
        }
        return;
      }
      initFor.current = userId;
      await refresh();
      if (!cancelled) setIsLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [user?.id, refresh]);

  const purchase = useCallback(async (): Promise<{ ok: boolean; cancelled?: boolean }> => {
    setError(null);
    if (!isNativeBilling()) {
      try {
        await webPurchase();
        return { ok: true };
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Checkout failed');
        return { ok: false };
      }
    }
    const result = await purchaseWeekly();
    if (result.ok) {
      setIsPremium(Boolean(result.isPremium));
      return { ok: true };
    }
    if (result.reason === 'cancelled') return { ok: false, cancelled: true };
    setError(result.error ?? `Purchase failed (${result.reason})`);
    return { ok: false };
  }, []);

  const restore = useCallback(async (): Promise<{ ok: boolean }> => {
    setError(null);
    if (!isNativeBilling()) return { ok: false };
    const result = await rcRestore();
    if (result.ok) {
      setIsPremium(Boolean(result.isPremium));
      return { ok: true };
    }
    setError(result.error ?? `Restore failed (${result.reason})`);
    return { ok: false };
  }, []);

  return { isPremium, isLoading, error, purchase, restore, refresh };
}
