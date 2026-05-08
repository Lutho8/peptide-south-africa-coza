import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCalculatorSettings, 
  saveCalculatorSettings,
  getScheduledReminders,
  getBodyCompositionHistory,
  updateBodyCompositionHistory,
  getActiveStack,
  saveActiveStack,
  BodyComposition,
  ScheduledReminder,
  CalculatorSettings,
  ActiveStackItem,
} from '@/services/storage';
import { recordStackChange } from '@/services/stackHistory';
import { toast } from 'sonner';

export type SyncPhase = 'idle' | 'hydrating' | 'syncing' | 'ready' | 'error' | 'offline';

interface CloudSyncState {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  phase: SyncPhase;
}

// Module-level singleton state so every consumer shares the same hydration phase
const listeners = new Set<(s: CloudSyncState) => void>();
let sharedState: CloudSyncState = {
  isSyncing: false,
  lastSyncAt: null,
  error: null,
  phase: 'idle',
};
let hydrationInFlight = false;
let hydratedForUser: string | null = null;

function setSharedState(updater: (s: CloudSyncState) => CloudSyncState) {
  sharedState = updater(sharedState);
  listeners.forEach((l) => l(sharedState));
  try {
    window.dispatchEvent(new CustomEvent('rtd:sync-phase', { detail: sharedState }));
  } catch { /* noop */ }
}

function backfillKey(userId: string) {
  return `rtd:stack-backfilled:${userId}`;
}

export function useCloudSync() {
  const { user } = useAuth();
  const [syncState, setSyncState] = useState<CloudSyncState>(sharedState);
  const stableUserId = useRef<string | null>(null);

  useEffect(() => {
    listeners.add(setSyncState);
    setSyncState(sharedState);
    return () => { listeners.delete(setSyncState); };
  }, []);

  // Sync calculator settings to cloud
  const syncCalculatorSettings = useCallback(async () => {
    if (!user) return;
    const localSettings = getCalculatorSettings();
    const { error } = await supabase
      .from('calculator_settings')
      .upsert({
        user_id: user.id,
        syringe_type: localSettings.syringeType,
        experience_level: localSettings.experienceLevel,
        last_vial_size: localSettings.lastVialSize,
        last_bac_water: localSettings.lastBacWater,
        last_target_dose: localSettings.lastTargetDose,
        last_selected_peptide: localSettings.lastSelectedPeptide,
      }, { onConflict: 'user_id' });
    if (error) throw error;
  }, [user]);

  const syncReminders = useCallback(async () => {
    if (!user) return;
    const localReminders = getScheduledReminders();
    await supabase.from('dose_reminders').delete().eq('user_id', user.id);
    if (localReminders.length > 0) {
      const { error } = await supabase.from('dose_reminders').insert(localReminders.map(r => ({
        user_id: user.id,
        peptide_id: r.peptideId,
        peptide_name: r.peptideName,
        dose: r.dose,
        time: r.time,
        days: r.days,
        enabled: r.enabled,
      })));
      if (error) throw error;
    }
  }, [user]);

  const syncBodyComposition = useCallback(async () => {
    if (!user) return;
    const localHistory = getBodyCompositionHistory();
    const { data: cloudEntries } = await supabase
      .from('body_composition').select('date').eq('user_id', user.id);
    const cloudDates = new Set(cloudEntries?.map(e => e.date) || []);
    const newEntries = localHistory.filter(e => !cloudDates.has(e.date));
    if (newEntries.length > 0) {
      const { error } = await supabase.from('body_composition').insert(newEntries.map(e => ({
        user_id: user.id, date: e.date, weight: e.weight, bmi: e.bmi,
        body_fat: e.bodyFat, fat_free_weight: e.fatFreeWeight, muscle_mass: e.muscleMass,
        skeletal_muscle: e.skeletalMuscle, body_water: e.bodyWater, subcutaneous_fat: e.subcutaneousFat,
        visceral_fat: e.visceralFat, bone_mass: e.boneMass, protein: e.protein,
        bmr: e.bmr, metabolic_age: e.metabolicAge, source: 'manual',
      })));
      if (error) throw error;
    }
  }, [user]);

  // Idempotent stack sync: upsert current items, delete only items removed
  const syncActiveStack = useCallback(async () => {
    if (!user) return;
    setSharedState(s => ({ ...s, phase: 'syncing', isSyncing: true, error: null }));
    try {
      const localStack = getActiveStack();
      const peptideIds = localStack.map(i => i.peptideId);

      // Fetch current cloud peptide ids
      const { data: cloudRows } = await supabase
        .from('user_stacks').select('peptide_id').eq('user_id', user.id);
      const cloudIds = new Set((cloudRows || []).map(r => r.peptide_id));

      // Delete only those that are no longer present locally
      const toDelete = [...cloudIds].filter(id => !peptideIds.includes(id));
      if (toDelete.length > 0) {
        await supabase.from('user_stacks').delete()
          .eq('user_id', user.id).in('peptide_id', toDelete);
      }

      if (localStack.length > 0) {
        const { error } = await supabase
          .from('user_stacks')
          .upsert(localStack.map(item => ({
            user_id: user.id,
            peptide_id: item.peptideId,
            dose: item.dose,
            frequency: item.frequency,
          })), { onConflict: 'user_id,peptide_id' });
        if (error) throw error;
      }
      setSharedState(s => ({ ...s, phase: 'ready', isSyncing: false, lastSyncAt: new Date() }));
    } catch (err) {
      console.error('Error syncing active stack:', err);
      setSharedState(s => ({ ...s, phase: 'error', isSyncing: false, error: (err as Error).message }));
      throw err;
    }
  }, [user]);

  const loadFromCloud = useCallback(async () => {
    if (!user) return;
    if (hydrationInFlight) return;
    if (hydratedForUser === user.id && sharedState.phase === 'ready') return;

    hydrationInFlight = true;
    setSharedState(s => ({ ...s, phase: 'hydrating', error: null }));

    try {
      const { data: settingsData } = await supabase
        .from('calculator_settings').select('*').eq('user_id', user.id).maybeSingle();
      if (settingsData) {
        saveCalculatorSettings({
          syringeType: settingsData.syringe_type as 'u100' | 'u40' | 'u50',
          experienceLevel: settingsData.experience_level as 'beginner' | 'intermediate' | 'advanced' | 'athlete',
          lastVialSize: settingsData.last_vial_size || '',
          lastBacWater: settingsData.last_bac_water || '',
          lastTargetDose: settingsData.last_target_dose || '',
          lastSelectedPeptide: settingsData.last_selected_peptide || '',
        });
      }

      const { data: bodyData } = await supabase
        .from('body_composition').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (bodyData && bodyData.length > 0) {
        const history: BodyComposition[] = bodyData.map(e => ({
          date: e.date, weight: Number(e.weight), bmi: Number(e.bmi) || 0,
          bodyFat: Number(e.body_fat) || 0, fatFreeWeight: Number(e.fat_free_weight) || 0,
          muscleMass: Number(e.muscle_mass) || 0, skeletalMuscle: Number(e.skeletal_muscle) || 0,
          bodyWater: Number(e.body_water) || 0, subcutaneousFat: Number(e.subcutaneous_fat) || 0,
          visceralFat: Number(e.visceral_fat) || 0, boneMass: Number(e.bone_mass) || 0,
          protein: Number(e.protein) || 0, bmr: Number(e.bmr) || 0, metabolicAge: Number(e.metabolic_age) || 0,
        }));
        updateBodyCompositionHistory(history);
      }

      const { data: stackData } = await supabase
        .from('user_stacks').select('*').eq('user_id', user.id);

      const prevLocal = getActiveStack();

      if (stackData && stackData.length > 0) {
        const stack: ActiveStackItem[] = stackData.map(item => ({
          peptideId: item.peptide_id,
          dose: item.dose,
          frequency: item.frequency,
        }));
        // Record hydration if it differs from previous local
        if (JSON.stringify(prevLocal) !== JSON.stringify(stack)) {
          recordStackChange(prevLocal, stack, 'hydrate');
        }
        saveActiveStack(stack);
      } else {
        // Cloud empty — backfill from local once per user (idempotent)
        const alreadyBackfilled = (() => {
          try { return localStorage.getItem(backfillKey(user.id)) === '1'; }
          catch { return false; }
        })();

        if (prevLocal.length > 0 && !alreadyBackfilled) {
          try {
            const { error } = await supabase
              .from('user_stacks')
              .upsert(prevLocal.map(item => ({
                user_id: user.id,
                peptide_id: item.peptideId,
                dose: item.dose,
                frequency: item.frequency,
              })), { onConflict: 'user_id,peptide_id' });
            if (!error) {
              try { localStorage.setItem(backfillKey(user.id), '1'); } catch { /* noop */ }
            }
          } catch (pushErr) {
            console.error('Error backfilling local stack to cloud:', pushErr);
          }
        } else if (prevLocal.length === 0) {
          saveActiveStack([]);
        }
      }

      hydratedForUser = user.id;
      setSharedState(s => ({ ...s, phase: 'ready', lastSyncAt: new Date() }));

      try {
        window.dispatchEvent(new CustomEvent('rtd:cloud-hydrated'));
        window.dispatchEvent(new CustomEvent('rtd:stack-changed'));
      } catch { /* noop */ }
    } catch (err) {
      console.error('Error loading from cloud:', err);
      setSharedState(s => ({ ...s, phase: 'error', error: (err as Error).message }));
    } finally {
      hydrationInFlight = false;
    }
  }, [user]);

  const syncAll = useCallback(async () => {
    if (!user) return;
    setSharedState(s => ({ ...s, isSyncing: true, phase: 'syncing', error: null }));
    try {
      await Promise.all([
        syncCalculatorSettings(),
        syncReminders(),
        syncBodyComposition(),
        syncActiveStack(),
      ]);
      setSharedState(s => ({ ...s, isSyncing: false, phase: 'ready', lastSyncAt: new Date() }));
      toast.success('Synced to cloud');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setSharedState(s => ({ ...s, isSyncing: false, phase: 'error', error: message }));
      toast.error('Sync failed: ' + message);
    }
  }, [user, syncCalculatorSettings, syncReminders, syncBodyComposition, syncActiveStack]);

  // Trigger hydration on user change
  useEffect(() => {
    if (user) {
      if (stableUserId.current !== user.id) {
        stableUserId.current = user.id;
        hydratedForUser = null; // force refresh on user change
      }
      loadFromCloud();
    } else {
      stableUserId.current = null;
      hydratedForUser = null;
      setSharedState(s => ({ ...s, phase: 'offline' }));
    }
  }, [user, loadFromCloud]);

  return {
    ...syncState,
    syncAll,
    syncCalculatorSettings,
    syncReminders,
    syncBodyComposition,
    syncActiveStack,
    loadFromCloud,
    isAuthenticated: !!user,
  };
}

/** Lightweight subscription hook for components that only need sync phase. */
export function useSyncPhase() {
  const [state, setState] = useState<CloudSyncState>(sharedState);
  useEffect(() => {
    listeners.add(setState);
    setState(sharedState);
    return () => { listeners.delete(setState); };
  }, []);
  return state;
}
