import { useEffect } from 'react';
import { initializeStorage } from '@/services/storage';
import { scheduleAllTodaysDoses, getNotificationPermission, isNotificationSupported } from '@/services/notifications';
import { registerServiceWorker, syncRemindersToIndexedDB, forceSyncAndCheck } from '@/services/pushScheduler';
import { startOfflineQueueWatcher } from '@/services/offlineQueue';

export function useStorageInit() {
  useEffect(() => {
    // Initialize storage with default data if empty
    initializeStorage();

    // Start the offline-queue watcher (drains pending writes when back online).
    startOfflineQueueWatcher();

    // Register service worker for background notifications, then sync any
    // existing reminders so they're scheduled immediately on app load.
    registerServiceWorker().then(async () => {
      await syncRemindersToIndexedDB();
      await forceSyncAndCheck();
    });

    // Foreground fallback: schedule today's doses via setTimeout while the
    // tab is open. The service worker remains the source of truth.
    if (isNotificationSupported() && getNotificationPermission() === 'granted') {
      setTimeout(() => {
        scheduleAllTodaysDoses();
      }, 1000);
    }
  }, []);
}


