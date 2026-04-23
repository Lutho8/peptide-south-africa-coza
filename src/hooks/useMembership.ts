// Free-access stub. The membership table has been removed; this hook is kept
// only so any straggling imports keep compiling. All users always have access.

export type MembershipStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export interface Membership {
  id: string;
  user_id: string;
  status: MembershipStatus;
  paypal_subscription_id: string | null;
  paypal_payer_id: string | null;
  plan_id: string | null;
  price_amount: number;
  currency: string;
  started_at: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

const noop = async () => null;

export function useMembership() {
  return {
    membership: null as Membership | null,
    hasMembership: true,
    isLoading: false,
    error: null as Error | null,
    refetch: noop,
    createPendingMembership: noop,
    activateMembership: noop,
    cancelMembership: noop,
  };
}
