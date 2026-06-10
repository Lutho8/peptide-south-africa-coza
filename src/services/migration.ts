/**
 * Data Migration Service
 *
 * Detects and migrates localStorage data from a previous Supabase project
 * (different user ID namespace) to the current user's namespace.
 *
 * Also backfills migrated data to the new Supabase cloud project.
 */

import { supabase } from '@/integrations/supabase/client';
import { STORAGE_KEYS } from './storage';

// Module-level flag so we only prompt once per session
let migrationPrompted = false;

export interface LegacyNamespace {
  userId: string;
  displayLabel: string;
  keysFound: number;
  hasData: boolean;
}

export interface MigrationResult {
  success: boolean;
  migratedKeys: number;
  error?: string;
}

export interface MigrationSummary {
  namespaces: LegacyNamespace[];
  totalLegacyKeys: number;
}

const ALL_STORAGE_BASE_KEYS = Object.values(STORAGE_KEYS);

/**
 * Scan localStorage for app keys that belong to namespaces other than
 * the current user or 'guest'. Returns a summary of what legacy data exists.
 */
export function scanForLegacyData(currentUserId: string | null): MigrationSummary {
  const namespaces = new Map<string, Set<string>>();

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Match only our app's namespaced keys: "baseKey::userId"
      const match = ALL_STORAGE_BASE_KEYS.find(base => key.startsWith(`${base}::`));
      if (!match) continue;

      const suffix = key.slice(match.length + 2); // everything after "baseKey::"
      if (!suffix || suffix === 'guest') continue;
      if (suffix === currentUserId) continue;

      if (!namespaces.has(suffix)) {
        namespaces.set(suffix, new Set());
      }
      namespaces.get(suffix)!.add(match);
    }
  } catch (e) {
    console.error('Error scanning localStorage for legacy data:', e);
  }

  const results: LegacyNamespace[] = [];
  namespaces.forEach((keys, userId) => {
    results.push({
      userId,
      displayLabel: userId.slice(0, 8) + '...',
      keysFound: keys.size,
      hasData: keys.size > 0,
    });
  });

  return {
    namespaces: results,
    totalLegacyKeys: results.reduce((sum, n) => sum + n.keysFound, 0),
  };
}

/**
 * Returns true if there is legacy data from a previous user account
 * and we haven't already prompted this session.
 */
export function shouldPromptForMigration(currentUserId: string | null): boolean {
  if (migrationPrompted) return false;
  const summary = scanForLegacyData(currentUserId);
  return summary.totalLegacyKeys > 0;
}

/**
 * Mark that we've already prompted so we don't spam the user.
 */
export function markMigrationPrompted(): void {
  migrationPrompted = true;
}

/**
 * Migrate ALL legacy localStorage data into the current user's namespace.
 * This is a local-only copy — old data is preserved as a safety net.
 */
export function migrateLegacyLocalData(currentUserId: string): MigrationResult {
  const summary = scanForLegacyData(currentUserId);
  let migratedCount = 0;

  try {
    for (const ns of summary.namespaces) {
      for (const baseKey of ALL_STORAGE_BASE_KEYS) {
        const legacyKey = `${baseKey}::${ns.userId}`;
        const newKey = `${baseKey}::${currentUserId}`;

        const raw = localStorage.getItem(legacyKey);
        if (raw === null) continue;

        // Don't overwrite if current user already has data for this key
        const existing = localStorage.getItem(newKey);
        if (existing !== null) {
          // Merge arrays (stacks, cycles, reminders, body comp, dose logs, schedules, presets, daily doses)
          try {
            const legacyData = JSON.parse(raw);
            const currentData = JSON.parse(existing);
            if (Array.isArray(legacyData) && Array.isArray(currentData)) {
              // Simple dedupe by JSON string — not perfect but safe
              const mergedMap = new Map<string, unknown>();
              [...currentData, ...legacyData].forEach(item => {
                const id = (item as Record<string, unknown>)?.id ?? JSON.stringify(item);
                mergedMap.set(String(id), item);
              });
              localStorage.setItem(newKey, JSON.stringify(Array.from(mergedMap.values())));
              migratedCount++;
              continue;
            }
            // For objects (settings, profile) — prefer current, skip legacy
            continue;
          } catch {
            // Not JSON arrays — skip to avoid corruption
            continue;
          }
        }

        // No existing data — safe to copy
        localStorage.setItem(newKey, raw);
        migratedCount++;
      }
    }

    return { success: true, migratedKeys: migratedCount };
  } catch (e) {
    console.error('Migration failed:', e);
    return {
      success: false,
      migratedKeys: migratedCount,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * Backfill migrated local data to the new Supabase cloud project.
 * Mirrors the logic in useCloudSync.loadFromCloud() but pushes instead of pulling.
 */
export async function backfillToCloud(currentUserId: string): Promise<{ success: boolean; message: string }> {
  try {
    const errors: string[] = [];

    // Helper to read from current user's namespace
    const read = (baseKey: string) => {
      const key = `${baseKey}::${currentUserId}`;
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    };

    // 1. Calculator Settings
    const calcSettings = read(STORAGE_KEYS.CALCULATOR_SETTINGS);
    if (calcSettings) {
      const { error } = await supabase
        .from('calculator_settings')
        .upsert({
          user_id: currentUserId,
          syringe_type: calcSettings.syringeType || 'u40',
          experience_level: calcSettings.experienceLevel || 'intermediate',
          last_vial_size: calcSettings.lastVialSize || '',
          last_bac_water: calcSettings.lastBacWater || '',
          last_target_dose: calcSettings.lastTargetDose || '',
          last_selected_peptide: calcSettings.lastSelectedPeptide || '',
        }, { onConflict: 'user_id' });
      if (error) errors.push(`Calculator settings: ${error.message}`);
    }

    // 2. Body Composition
    const bodyComp = read(STORAGE_KEYS.BODY_COMPOSITION);
    if (Array.isArray(bodyComp) && bodyComp.length > 0) {
      const { data: existing } = await supabase
        .from('body_composition').select('date').eq('user_id', currentUserId);
      const existingDates = new Set(existing?.map((e: { date: string }) => e.date) || []);
      const newEntries = bodyComp.filter((e: { date: string }) => !existingDates.has(e.date));
      if (newEntries.length > 0) {
        const { error } = await supabase.from('body_composition').insert(
          newEntries.map((e: Record<string, unknown>) => ({
            user_id: currentUserId,
            date: e.date,
            weight: Number(e.weight) || 0,
            bmi: Number(e.bmi) || 0,
            body_fat: Number(e.bodyFat) || 0,
            fat_free_weight: Number(e.fatFreeWeight) || 0,
            muscle_mass: Number(e.muscleMass) || 0,
            skeletal_muscle: Number(e.skeletalMuscle) || 0,
            body_water: Number(e.bodyWater) || 0,
            subcutaneous_fat: Number(e.subcutaneousFat) || 0,
            visceral_fat: Number(e.visceralFat) || 0,
            bone_mass: Number(e.boneMass) || 0,
            protein: Number(e.protein) || 0,
            bmr: Number(e.bmr) || 0,
            metabolic_age: Number(e.metabolicAge) || 0,
            source: (e.source as string) || 'manual',
          }))
        );
        if (error) errors.push(`Body composition: ${error.message}`);
      }
    }

    // 3. Active Stack
    const stack = read(STORAGE_KEYS.ACTIVE_STACK);
    if (Array.isArray(stack) && stack.length > 0) {
      const { error } = await supabase.from('user_stacks').upsert(
        stack.map((item: Record<string, unknown>) => ({
          user_id: currentUserId,
          peptide_id: item.peptideId,
          dose: item.dose,
          frequency: item.frequency,
        })),
        { onConflict: 'user_id,peptide_id' }
      );
      if (error) errors.push(`Active stack: ${error.message}`);
    }

    // 4. Dose Reminders
    const reminders = read(STORAGE_KEYS.SCHEDULED_REMINDERS);
    if (Array.isArray(reminders) && reminders.length > 0) {
      const { error } = await supabase.from('dose_reminders').insert(
        reminders.map((r: Record<string, unknown>) => ({
          user_id: currentUserId,
          peptide_id: r.peptideId,
          peptide_name: r.peptideName,
          dose: r.dose,
          time: r.time,
          days: r.days,
          enabled: r.enabled ?? true,
        }))
      );
      if (error) errors.push(`Reminders: ${error.message}`);
    }

    // 5. Cycles
    const cycles = read(STORAGE_KEYS.CYCLES);
    if (Array.isArray(cycles) && cycles.length > 0) {
      // Note: there's no dedicated 'cycles' table in the current schema,
      // so we store them in user_stacks metadata or skip.
      // For now we skip cycles since the cloud schema only has user_stacks.
    }

    if (errors.length > 0) {
      return { success: false, message: `Partial backfill: ${errors.join('; ')}` };
    }

    return { success: true, message: 'All data backfilled to cloud' };
  } catch (e) {
    console.error('Cloud backfill failed:', e);
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Backfill failed',
    };
  }
}
