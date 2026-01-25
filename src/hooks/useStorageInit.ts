import { useEffect } from 'react';
import { initializeStorage } from '@/services/storage';
import { scheduleAllTodaysDoses, getNotificationPermission, isNotificationSupported } from '@/services/notifications';

export function useStorageInit() {
  useEffect(() => {
    // Initialize storage with default data if empty
    initializeStorage();
    
    // Schedule notifications for today's doses if permissions are granted
    if (isNotificationSupported() && getNotificationPermission() === 'granted') {
      // Small delay to ensure reminders are loaded from storage
      setTimeout(() => {
        scheduleAllTodaysDoses();
      }, 1000);
    }
  }, []);
}
