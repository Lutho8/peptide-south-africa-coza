import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { saveBodyCompositionEntry, BodyComposition } from '@/services/storage';
import { toast } from 'sonner';

interface RenphoSyncState {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  isConnected: boolean;
  error: string | null;
}

interface RenphoMeasurement {
  weight: number;
  bmi: number;
  body_fat: number;
  muscle_mass: number;
  visceral_fat: number;
  bone_mass: number;
  body_water: number;
  protein: number;
  bmr: number;
  metabolic_age: number;
  subcutaneous_fat: number;
  skeletal_muscle: number;
  time_stamp: number;
}

export function useRenphoSync() {
  const { user } = useAuth();
  const [state, setState] = useState<RenphoSyncState>({
    isSyncing: false,
    lastSyncAt: null,
    isConnected: false,
    error: null,
  });

  // Check if credentials are stored
  const checkConnection = useCallback(async () => {
    if (!user) return false;

    const { data } = await supabase
      .from('renpho_credentials')
      .select('last_sync_at')
      .eq('user_id', user.id)
      .maybeSingle();

    const connected = !!data;
    setState(prev => ({ 
      ...prev, 
      isConnected: connected,
      lastSyncAt: data?.last_sync_at ? new Date(data.last_sync_at) : null,
    }));
    
    return connected;
  }, [user]);

  // Connect Renpho account (now accepts plain password)
  const connectRenpho = useCallback(async (email: string, password: string) => {
    if (!user) {
      toast.error('Please sign in first');
      return false;
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Call edge function to validate and store credentials
      // Password will be hashed server-side
      const { data, error } = await supabase.functions.invoke('renpho-sync', {
        body: { action: 'connect', email, password },
      });

      if (error) {
        // Try to extract meaningful error from the response
        const errorMessage = error.message || 'Connection failed';
        throw new Error(errorMessage);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Connection failed');
      }

      setState(prev => ({ 
        ...prev, 
        isSyncing: false, 
        isConnected: true,
        error: null,
      }));

      toast.success('Renpho account connected!');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setState(prev => ({ ...prev, isSyncing: false, error: message }));
      toast.error(message);
      return false;
    }
  }, [user]);

  // Sync measurements from Renpho
  const syncMeasurements = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('renpho-sync', {
        body: { action: 'sync' },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Sync failed');

      // Process measurements
      const measurements: RenphoMeasurement[] = data.measurements || [];
      
      for (const m of measurements) {
        const date = new Date(m.time_stamp * 1000).toISOString().split('T')[0];
        
        const entry: BodyComposition = {
          date,
          weight: m.weight,
          bmi: m.bmi,
          bodyFat: m.body_fat,
          fatFreeWeight: m.weight * (1 - m.body_fat / 100),
          muscleMass: m.muscle_mass,
          skeletalMuscle: m.skeletal_muscle,
          bodyWater: m.body_water,
          subcutaneousFat: m.subcutaneous_fat,
          visceralFat: m.visceral_fat,
          boneMass: m.bone_mass,
          protein: m.protein,
          bmr: m.bmr,
          metabolicAge: m.metabolic_age,
        };

        // Save locally
        saveBodyCompositionEntry(entry);

        // Save to cloud
        await supabase.from('body_composition').upsert({
          user_id: user.id,
          date: entry.date,
          weight: entry.weight,
          bmi: entry.bmi,
          body_fat: entry.bodyFat,
          fat_free_weight: entry.fatFreeWeight,
          muscle_mass: entry.muscleMass,
          skeletal_muscle: entry.skeletalMuscle,
          body_water: entry.bodyWater,
          subcutaneous_fat: entry.subcutaneousFat,
          visceral_fat: entry.visceralFat,
          bone_mass: entry.boneMass,
          protein: entry.protein,
          bmr: entry.bmr,
          metabolic_age: entry.metabolicAge,
          source: 'renpho',
        }, { onConflict: 'user_id,date' });
      }

      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: new Date(),
        error: null,
      }));

      toast.success(`Synced ${measurements.length} measurements from Renpho`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setState(prev => ({ ...prev, isSyncing: false, error: message }));
      toast.error(message);
    }
  }, [user]);

  // Disconnect Renpho
  const disconnectRenpho = useCallback(async () => {
    if (!user) return;

    await supabase
      .from('renpho_credentials')
      .delete()
      .eq('user_id', user.id);

    setState({
      isSyncing: false,
      lastSyncAt: null,
      isConnected: false,
      error: null,
    });

    toast.success('Renpho account disconnected');
  }, [user]);

  return {
    ...state,
    checkConnection,
    connectRenpho,
    syncMeasurements,
    disconnectRenpho,
  };
}
