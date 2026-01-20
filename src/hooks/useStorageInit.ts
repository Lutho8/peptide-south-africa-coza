import { useEffect } from 'react';
import { initializeStorage } from '@/services/storage';
import { scheduleAllTodaysDoses } from '@/services/notifications';

export function useStorageInit() {
  useEffect(() => {
    // Initialize storage with default data if empty
    initializeStorage();
    
    // Schedule notifications for today's doses
    scheduleAllTodaysDoses();
  }, []);
}
