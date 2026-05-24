// Paywall removed — every signed-in user has full access.
// This stub keeps existing call-sites working without changing them.

export type SubscriptionStatus = 'active';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan | null;
  status: SubscriptionStatus;
  provider: string;
  provider_subscription_id: string | null;
  provider_customer_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface UseMembershipResult {
  subscription: Subscription | null;
  hasPremium: boolean;
  plan: SubscriptionPlan | null;
  status: SubscriptionStatus | null;
  currentPeriodEnd: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMembership(): UseMembershipResult {
  return {
    subscription: null,
    hasPremium: true,
    plan: null,
    status: null,
    currentPeriodEnd: null,
    isAdmin: false,
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
}
