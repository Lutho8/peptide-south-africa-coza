import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

export function useMembership() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasMembership = membership?.status === 'active' && 
    (!membership.expires_at || new Date(membership.expires_at) > new Date());

  useEffect(() => {
    if (!user) {
      setMembership(null);
      setIsLoading(false);
      return;
    }

    fetchMembership();
  }, [user]);

  const fetchMembership = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_memberships')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setMembership(data as Membership | null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPendingMembership = async () => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('user_memberships')
        .insert({
          user_id: user.id,
          status: 'pending',
          price_amount: 9.99,
          currency: 'EUR',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setMembership(data as Membership);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const activateMembership = async (paypalSubscriptionId: string, paypalPayerId: string, planId: string) => {
    if (!user) return null;

    try {
      const { data, error: updateError } = await supabase
        .from('user_memberships')
        .upsert({
          user_id: user.id,
          status: 'active',
          paypal_subscription_id: paypalSubscriptionId,
          paypal_payer_id: paypalPayerId,
          plan_id: planId,
          started_at: new Date().toISOString(),
          // Set expiry to 1 month from now
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (updateError) throw updateError;
      setMembership(data as Membership);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const cancelMembership = async () => {
    if (!user || !membership) return null;

    try {
      const { data, error: updateError } = await supabase
        .from('user_memberships')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setMembership(data as Membership);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  return {
    membership,
    hasMembership,
    isLoading,
    error,
    refetch: fetchMembership,
    createPendingMembership,
    activateMembership,
    cancelMembership,
  };
}
