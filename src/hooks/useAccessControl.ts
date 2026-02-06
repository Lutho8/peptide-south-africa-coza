import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';

export function useAccessControl() {
  const { user } = useAuth();
  const { hasMembership, isLoading: membershipLoading } = useMembership();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        setIsAdmin(!!data && !error);
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const hasAccess = isAdmin || hasMembership;
  const loading = isLoading || membershipLoading;

  return { hasAccess, isAdmin, hasMembership, isLoading: loading };
}
