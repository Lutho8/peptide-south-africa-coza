// Real DB-backed Premium membership hook.
// Source of truth: `subscriptions` table + admin role.
// Admin (lutho.kote@relicom.de via has_role) always returns hasPremium = true.

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'pending'
  | 'paused';

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

const ACTIVE_STATUSES: SubscriptionStatus[] = ['active', 'trialing'];

export function useMembership(): UseMembershipResult {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [subRes, roleRes] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle(),
      ]);

      if (subRes.error && subRes.error.code !== 'PGRST116') throw subRes.error;
      setSubscription((subRes.data as Subscription | null) ?? null);
      setIsAdmin(Boolean(roleRes.data));
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const subActive =
    !!subscription &&
    ACTIVE_STATUSES.includes(subscription.status) &&
    (!subscription.current_period_end ||
      new Date(subscription.current_period_end) > new Date());

  const hasPremium = isAdmin || subActive;

  return {
    subscription,
    hasPremium,
    plan: subscription?.plan ?? null,
    status: subscription?.status ?? null,
    currentPeriodEnd: subscription?.current_period_end ?? null,
    isAdmin,
    isLoading,
    error,
    refetch: fetchData,
  };
}
