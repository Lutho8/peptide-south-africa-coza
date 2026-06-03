// Paywall removed — stub kept for compatibility.
export interface UseSubscriptionResult {
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  purchase: () => Promise<{ ok: boolean; cancelled?: boolean }>;
  restore: () => Promise<{ ok: boolean }>;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionResult {
  return {
    isPremium: true,
    isLoading: false,
    error: null,
    purchase: async () => ({ ok: true }),
    restore: async () => ({ ok: true }),
    refresh: async () => {},
  };
}
