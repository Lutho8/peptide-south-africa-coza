import { useEffect } from 'react';
import { initializeStorage } from '@/services/storage';
import { scheduleAllTodaysDoses, getNotificationPermission, isNotificationSupported } from '@/services/notifications';
import { registerServiceWorker, syncRemindersToIndexedDB } from '@/services/pushScheduler';

export function useStorageInit() {
  useEffect(() => {
    // Initialize storage with default data if empty
    initializeStorage();
    
    // Register service worker for background notifications
    registerServiceWorker().then(() => {
      syncRemindersToIndexedDB();
    });
    
    // Schedule notifications for today's doses if permissions are granted
    if (isNotificationSupported() && getNotificationPermission() === 'granted') {
      // Small delay to ensure reminders are loaded from storage
      setTimeout(() => {
        scheduleAllTodaysDoses();
      }, 1000);
    }
  }, []);
}
