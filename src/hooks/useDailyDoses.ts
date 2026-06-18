import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getStoredData, setStoredData, STORAGE_KEYS } from '@/services/storage';
import { enqueue as enqueueOffline } from '@/services/offlineQueue';

export interface DailyDoseEntry {
  id: string;
  date: string;
  peptide_id: string;
  peptide_name: string;
  dose: number;
  unit: 'mg' | 'IU' | 'units';
  time: string;
  notes?: string;
  user_id?: string;
}

function loadLocalDoses(): DailyDoseEntry[] {
  return getStoredData<DailyDoseEntry[]>(STORAGE_KEYS.DAILY_DOSES, []);
}

function saveLocalDoses(doses: DailyDoseEntry[]) {
  setStoredData(STORAGE_KEYS.DAILY_DOSES, doses);
}

export function useDailyDoses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [doses, setDoses] = useState<DailyDoseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load doses from Supabase or localStorage
  const loadDoses = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('daily_doses')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        const mappedDoses: DailyDoseEntry[] = (data || []).map(d => ({
          id: d.id,
          date: d.date,
          peptide_id: d.peptide_id,
          peptide_name: d.peptide_name,
          dose: Number(d.dose),
          unit: d.unit as 'mg' | 'IU' | 'units',
          time: d.time,
          notes: d.notes || undefined,
          user_id: d.user_id,
        }));

        setDoses(mappedDoses);
        // Also sync to localStorage (per-user namespace) for offline access
        saveLocalDoses(mappedDoses);
      } else {
        // Use localStorage when not logged in (guest namespace)
        setDoses(loadLocalDoses());
      }
    } catch (error) {
      console.error('Error loading doses:', error);
      // Fallback to localStorage
      setDoses(loadLocalDoses());
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Reset in-memory state immediately when the user changes so a stale list
  // from a previous user never flashes on screen.
  useEffect(() => {
    setDoses([]);
    setIsLoading(true);
    loadDoses();
  }, [user?.id, loadDoses]);

  // Sync local doses to cloud when user logs in
  const syncLocalToCloud = useCallback(async () => {
    if (!user) return;

    const localDoses = loadLocalDoses();
    if (localDoses.length === 0) return;

    setIsSyncing(true);
    try {
      // Check which doses already exist in cloud
      const { data: existingDoses } = await supabase
        .from('daily_doses')
        .select('id');

      const existingIds = new Set((existingDoses || []).map(d => d.id));
      const newDoses = localDoses.filter(d => !existingIds.has(d.id));

      if (newDoses.length > 0) {
        const { error } = await supabase.from('daily_doses').upsert(
          newDoses.map(d => ({
            id: d.id,
            user_id: user.id,
            date: d.date,
            peptide_id: d.peptide_id,
            peptide_name: d.peptide_name,
            dose: d.dose,
            unit: d.unit,
            time: d.time,
            notes: d.notes || null,
          })),
          { onConflict: 'id' }
        );

        if (error) throw error;

        toast({
          title: 'Doses synced',
          description: `${newDoses.length} local dose${newDoses.length > 1 ? 's' : ''} synced to cloud`,
        });
      }

      // Reload to get merged data
      await loadDoses();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync failed',
        description: 'Could not sync local doses to cloud',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, loadDoses, toast]);

  // Sync when user logs in
  useEffect(() => {
    if (user) {
      syncLocalToCloud();
    }
  }, [user?.id]);

  const addDose = useCallback(async (dose: Omit<DailyDoseEntry, 'id' | 'user_id'>) => {
    const newDose: DailyDoseEntry = {
      ...dose,
      id: crypto.randomUUID(),
    };

    try {
      if (user) {
        const row = {
          id: newDose.id,
          user_id: user.id,
          date: newDose.date,
          peptide_id: newDose.peptide_id,
          peptide_name: newDose.peptide_name,
          dose: newDose.dose,
          unit: newDose.unit,
          time: newDose.time,
          notes: newDose.notes || null,
        };
        try {
          const { error } = await supabase.from('daily_doses').insert(row);
          if (error) throw error;
        } catch (netErr) {
          console.warn('addDose offline — enqueuing', netErr);
          await enqueueOffline('daily_doses', 'insert', row);
        }
      }

      // Update local state and localStorage
      const updatedDoses = [...doses, newDose];
      setDoses(updatedDoses);
      saveLocalDoses(updatedDoses);

      return newDose;
    } catch (error) {
      console.error('Error adding dose:', error);
      throw error;
    }
  }, [user, doses]);

  const updateDose = useCallback(async (doseId: string, updates: Partial<Pick<DailyDoseEntry, 'time' | 'notes' | 'dose' | 'unit'>>) => {
    try {
      if (user) {
        const patch = {
          ...(updates.time !== undefined && { time: updates.time }),
          ...(updates.notes !== undefined && { notes: updates.notes || null }),
          ...(updates.dose !== undefined && { dose: updates.dose }),
          ...(updates.unit !== undefined && { unit: updates.unit }),
        };
        try {
          const { error } = await supabase.from('daily_doses').update(patch).eq('id', doseId);
          if (error) throw error;
        } catch (netErr) {
          console.warn('updateDose offline — enqueuing', netErr);
          await enqueueOffline('daily_doses', 'update', patch, doseId);
        }
      }

      const updatedDoses = doses.map(d =>
        d.id === doseId ? { ...d, ...updates } : d
      );
      setDoses(updatedDoses);
      saveLocalDoses(updatedDoses);
    } catch (error) {
      console.error('Error updating dose:', error);
      throw error;
    }
  }, [user, doses]);

  const deleteDose = useCallback(async (doseId: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('daily_doses')
          .delete()
          .eq('id', doseId);

        if (error) throw error;
      }

      const updatedDoses = doses.filter(d => d.id !== doseId);
      setDoses(updatedDoses);
      saveLocalDoses(updatedDoses);
    } catch (error) {
      console.error('Error deleting dose:', error);
      throw error;
    }
  }, [user, doses]);

  const getDosesForDate = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return doses.filter(d => d.date === dateStr);
  }, [doses]);

  const getDosesForDateRange = useCallback((startDate: Date, endDate: Date) => {
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');
    return doses.filter(d => d.date >= startStr && d.date <= endStr);
  }, [doses]);

  return {
    doses,
    isLoading,
    isSyncing,
    isCloudEnabled: !!user,
    addDose,
    updateDose,
    deleteDose,
    getDosesForDate,
    getDosesForDateRange,
    refreshDoses: loadDoses,
  };
}
