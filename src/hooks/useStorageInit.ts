import { useEffect } from 'react';
import { initializeStorage, getCycles } from '@/services/storage';
import { scheduleAllTodaysDoses, getNotificationPermission, isNotificationSupported } from '@/services/notifications';
import {
  registerServiceWorker,
  syncRemindersToIndexedDB,
  forceSyncAndCheck,
  scheduleAllCycleReminders,
} from '@/services/pushScheduler';
import { startOfflineQueueWatcher } from '@/services/offlineQueue';
import { getStoredData, STORAGE_KEYS } from '@/services/storage';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';

export function useStorageInit() {
  useEffect(() => {
    initializeStorage();
    startOfflineQueueWatcher();

    registerServiceWorker().then(async () => {
      await syncRemindersToIndexedDB();
      await forceSyncAndCheck();
      // Schedule per-cycle reminders from current cycles + logged doses.
      const cycles = getCycles();
      const doses = getStoredData<DailyDoseEntry[]>(STORAGE_KEYS.DAILY_DOSES, []);
      await scheduleAllCycleReminders(cycles, doses);
    });

    const reschedule = async () => {
      try {
        const cycles = getCycles();
        const doses = getStoredData<DailyDoseEntry[]>(STORAGE_KEYS.DAILY_DOSES, []);
        await scheduleAllCycleReminders(cycles, doses);
      } catch (err) {
        console.warn('cycle reminder reschedule failed', err);
      }
    };
    window.addEventListener('rtd:dose-logged', reschedule);
    window.addEventListener('rtd:stack-changed', reschedule);

    if (isNotificationSupported() && getNotificationPermission() === 'granted') {
      setTimeout(() => { scheduleAllTodaysDoses(); }, 1000);
    }

    return () => {
      window.removeEventListener('rtd:dose-logged', reschedule);
      window.removeEventListener('rtd:stack-changed', reschedule);
    };
  }, []);
}



