import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, saveUserProfile, UserProfile } from '@/services/storage';

const STORAGE_FLAG = 'rtd-profile-setup-completed';

interface ProfileSyncState {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  hydrated: boolean;
}

/**
 * Syncs the local UserProfile (age, height, weight, gender, activity, experience, goals)
 * to the Supabase `profiles` table so it persists across devices and survives a
 * localStorage clear. On login, cloud data wins if it has stats and local doesn't.
 */
export function useProfileSync() {
  const { user } = useAuth();
  const [state, setState] = useState<ProfileSyncState>({
    isSyncing: false,
    lastSyncAt: null,
    error: null,
    hydrated: false,
  });

  /** Push the current localStorage profile up to Supabase. */
  const pushProfile = useCallback(async (profile?: UserProfile): Promise<boolean> => {
    if (!user) return false;
    const p = profile ?? getUserProfile();

    setState((s) => ({ ...s, isSyncing: true, error: null }));
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            display_name: p.name || null,
            full_name: p.name || null,
            age: p.age || null,
            gender: p.gender || null,
            height_cm: p.height || null,
            weight_kg: p.weight || null,
            activity_level: p.activityLevel || null,
            experience: p.experience || null,
            goals: p.goals || [],
            profile_completed_at:
              p.age > 0 && p.height > 0 && p.weight > 0 ? new Date().toISOString() : null,
          },
          { onConflict: 'id' }
        );

      if (error) throw error;
      setState({ isSyncing: false, lastSyncAt: new Date(), error: null, hydrated: true });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile sync failed';
      console.error('[useProfileSync] push error:', err);
      setState((s) => ({ ...s, isSyncing: false, error: message }));
      return false;
    }
  }, [user]);

  /** Pull cloud profile into localStorage. Cloud wins if it has body stats. */
  const pullProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setState((s) => ({ ...s, hydrated: true }));
        return null;
      }

      const cloudHasStats =
        Number(data.age) > 0 && Number(data.height_cm) > 0 && Number(data.weight_kg) > 0;

      if (cloudHasStats) {
        const profile: UserProfile = {
          name: data.full_name || data.display_name || '',
          age: Number(data.age) || 0,
          gender: (data.gender as 'male' | 'female') || 'male',
          height: Number(data.height_cm) || 0,
          weight: Number(data.weight_kg) || 0,
          activityLevel:
            (data.activity_level as UserProfile['activityLevel']) || 'moderate',
          experience: (data.experience as UserProfile['experience']) || 'beginner',
          goals: Array.isArray(data.goals) ? (data.goals as string[]) : [],
        };
        saveUserProfile(profile);
        // Mark wizard as completed so it doesn't re-prompt on this device
        localStorage.setItem(`${STORAGE_FLAG}:${user.id}`, 'cloud-restored');
        setState((s) => ({ ...s, hydrated: true, lastSyncAt: new Date() }));
        return profile;
      }

      setState((s) => ({ ...s, hydrated: true }));
      return null;
    } catch (err) {
      console.error('[useProfileSync] pull error:', err);
      setState((s) => ({ ...s, hydrated: true, error: 'Failed to load cloud profile' }));
      return null;
    }
  }, [user]);

  // Hydrate from cloud once per login
  useEffect(() => {
    if (user && !state.hydrated) {
      pullProfile();
    }
  }, [user, state.hydrated, pullProfile]);

  return {
    ...state,
    pushProfile,
    pullProfile,
    isAuthenticated: !!user,
  };
}
