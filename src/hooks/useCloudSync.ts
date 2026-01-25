import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCalculatorSettings, 
  saveCalculatorSettings,
  getScheduledReminders,
  getBodyCompositionHistory,
  updateBodyCompositionHistory,
  BodyComposition,
  ScheduledReminder,
  CalculatorSettings,
} from '@/services/storage';
import { toast } from 'sonner';

interface CloudSyncState {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
}

export function useCloudSync() {
  const { user } = useAuth();
  const [syncState, setSyncState] = useState<CloudSyncState>({
    isSyncing: false,
    lastSyncAt: null,
    error: null,
  });

  // Sync calculator settings to cloud
  const syncCalculatorSettings = useCallback(async () => {
    if (!user) return;

    const localSettings = getCalculatorSettings();
    
    try {
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
    } catch (err) {
      console.error('Error syncing calculator settings:', err);
      throw err;
    }
  }, [user]);

  // Sync reminders to cloud
  const syncReminders = useCallback(async () => {
    if (!user) return;

    const localReminders = getScheduledReminders();
    
    try {
      // First delete all existing reminders for this user
      await supabase
        .from('dose_reminders')
        .delete()
        .eq('user_id', user.id);

      // Then insert current reminders
      if (localReminders.length > 0) {
        const { error } = await supabase
          .from('dose_reminders')
          .insert(localReminders.map(r => ({
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
    } catch (err) {
      console.error('Error syncing reminders:', err);
      throw err;
    }
  }, [user]);

  // Sync body composition to cloud
  const syncBodyComposition = useCallback(async () => {
    if (!user) return;

    const localHistory = getBodyCompositionHistory();
    
    try {
      // Get existing cloud entries
      const { data: cloudEntries } = await supabase
        .from('body_composition')
        .select('date')
        .eq('user_id', user.id);

      const cloudDates = new Set(cloudEntries?.map(e => e.date) || []);
      
      // Only insert entries that don't exist in cloud
      const newEntries = localHistory.filter(e => !cloudDates.has(e.date));
      
      if (newEntries.length > 0) {
        const { error } = await supabase
          .from('body_composition')
          .insert(newEntries.map(e => ({
            user_id: user.id,
            date: e.date,
            weight: e.weight,
            bmi: e.bmi,
            body_fat: e.bodyFat,
            fat_free_weight: e.fatFreeWeight,
            muscle_mass: e.muscleMass,
            skeletal_muscle: e.skeletalMuscle,
            body_water: e.bodyWater,
            subcutaneous_fat: e.subcutaneousFat,
            visceral_fat: e.visceralFat,
            bone_mass: e.boneMass,
            protein: e.protein,
            bmr: e.bmr,
            metabolic_age: e.metabolicAge,
            source: 'manual',
          })));

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error syncing body composition:', err);
      throw err;
    }
  }, [user]);

  // Load data from cloud
  const loadFromCloud = useCallback(async () => {
    if (!user) return;

    try {
      // Load calculator settings
      const { data: settingsData } = await supabase
        .from('calculator_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

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

      // Load body composition
      const { data: bodyData } = await supabase
        .from('body_composition')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (bodyData && bodyData.length > 0) {
        const history: BodyComposition[] = bodyData.map(e => ({
          date: e.date,
          weight: Number(e.weight),
          bmi: Number(e.bmi) || 0,
          bodyFat: Number(e.body_fat) || 0,
          fatFreeWeight: Number(e.fat_free_weight) || 0,
          muscleMass: Number(e.muscle_mass) || 0,
          skeletalMuscle: Number(e.skeletal_muscle) || 0,
          bodyWater: Number(e.body_water) || 0,
          subcutaneousFat: Number(e.subcutaneous_fat) || 0,
          visceralFat: Number(e.visceral_fat) || 0,
          boneMass: Number(e.bone_mass) || 0,
          protein: Number(e.protein) || 0,
          bmr: Number(e.bmr) || 0,
          metabolicAge: Number(e.metabolic_age) || 0,
        }));
        updateBodyCompositionHistory(history);
      }
    } catch (err) {
      console.error('Error loading from cloud:', err);
    }
  }, [user]);

  // Full sync function
  const syncAll = useCallback(async () => {
    if (!user) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      await Promise.all([
        syncCalculatorSettings(),
        syncReminders(),
        syncBodyComposition(),
      ]);

      setSyncState({
        isSyncing: false,
        lastSyncAt: new Date(),
        error: null,
      });

      toast.success('Synced to cloud');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: message,
      }));
      toast.error('Sync failed: ' + message);
    }
  }, [user, syncCalculatorSettings, syncReminders, syncBodyComposition]);

  // Load from cloud on first login
  useEffect(() => {
    if (user) {
      loadFromCloud();
    }
  }, [user, loadFromCloud]);

  return {
    ...syncState,
    syncAll,
    syncCalculatorSettings,
    syncReminders,
    syncBodyComposition,
    loadFromCloud,
    isAuthenticated: !!user,
  };
}
