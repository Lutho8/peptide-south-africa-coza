// IndexedDB-based push notification scheduler for service worker

const DB_NAME = 'peptide-reminders-db';
const DB_VERSION = 2;
const STORE_NAME = 'scheduled-reminders';

export interface ScheduledReminder {
  id: string;
  peptideId: string;
  peptideName: string;
  dose: string;
  time: string; // HH:MM
  days: string[];
  enabled: boolean;
  nextFireTime?: number; // Unix timestamp
  isSnooze?: boolean;
}

// Service worker registration reference
let swRegistration: ServiceWorkerRegistration | null = null;

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create reminders store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('nextFireTime', 'nextFireTime', { unique: false });
        store.createIndex('enabled', 'enabled', { unique: false });
      }
      
      // Create fired notifications store
      if (!db.objectStoreNames.contains('fired-notifications')) {
        const firedStore = db.createObjectStore('fired-notifications', { keyPath: 'id' });
        firedStore.createIndex('firedAt', 'firedAt', { unique: false });
      }
    };
  });
}

// Calculate next fire time for a reminder
function calculateNextFireTime(time: string, days: string[]): number {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  
  // Check next 7 days
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    checkDate.setHours(hours, minutes, 0, 0);
    
    // Skip if in the past (with 1 min buffer)
    if (checkDate.getTime() <= now.getTime() + 60000) continue;
    
    const dayName = dayNames[checkDate.getDay()];
    
    // If days is empty, every day is valid
    if (days.length === 0 || days.includes(dayName)) {
      return checkDate.getTime();
    }
  }
  
  // Fallback to next week same time
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(hours, minutes, 0, 0);
  return nextWeek.getTime();
}

// Save reminder to IndexedDB
export async function saveReminderToIndexedDB(reminder: ScheduledReminder): Promise<void> {
  const db = await openDB();
  
  const reminderWithFireTime = {
    ...reminder,
    nextFireTime: reminder.enabled ? calculateNextFireTime(reminder.time, reminder.days) : undefined,
  };
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(reminderWithFireTime);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Notify service worker of the update
      notifyServiceWorker('SYNC_REMINDERS');
      resolve();
    };
  });
}

// Save multiple reminders at once
export async function bulkSaveReminders(reminders: ScheduledReminder[]): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    for (const reminder of reminders) {
      const reminderWithFireTime = {
        ...reminder,
        nextFireTime: reminder.enabled ? calculateNextFireTime(reminder.time, reminder.days) : undefined,
      };
      store.put(reminderWithFireTime);
    }
    
    transaction.oncomplete = () => {
      // Notify service worker of the update
      notifyServiceWorker('SYNC_REMINDERS');
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

// Delete reminder from IndexedDB
export async function deleteReminderFromIndexedDB(id: string): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      notifyServiceWorker('SYNC_REMINDERS');
      resolve();
    };
  });
}

// Get all reminders from IndexedDB
export async function getAllRemindersFromIndexedDB(): Promise<ScheduledReminder[]> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Clear all reminders from IndexedDB (useful for re-sync)
export async function clearAllRemindersFromIndexedDB(): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Clear the fired-notifications de-dup store
async function clearFiredNotificationsStore(): Promise<void> {
  try {
    const db = await openDB();
    if (!db.objectStoreNames.contains('fired-notifications')) return;
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('fired-notifications', 'readwrite');
      const store = tx.objectStore('fired-notifications');
      const req = store.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (err) {
    console.warn('Failed to clear fired-notifications store:', err);
  }
}

// Clear all scheduled reminders, fired-notification history,
// and any currently displayed OS notifications. Used on sign-out.
export async function clearAllScheduledNotifications(): Promise<void> {
  try {
    await clearAllRemindersFromIndexedDB();
  } catch (err) {
    console.warn('Failed to clear scheduled reminders:', err);
  }

  await clearFiredNotificationsStore();

  // Close any currently displayed OS notification banners
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const notifications = await registration.getNotifications();
        notifications.forEach((n) => {
          try { n.close(); } catch { /* noop */ }
        });
      }
    }
  } catch (err) {
    console.warn('Failed to close active notifications:', err);
  }

  // Notify the SW so it re-reads the now-empty store and stops scheduling
  notifyServiceWorker('SYNC_REMINDERS');
}

// Sync reminders from localStorage to IndexedDB
export async function syncRemindersToIndexedDB(): Promise<void> {
  try {
    const stored = localStorage.getItem('peptide-dose-reminders');
    if (!stored) return;
    
    const reminders = JSON.parse(stored) as Array<{
      id: string;
      peptide_id: string;
      peptide_name: string;
      dose: string;
      time: string;
      days: string[];
      enabled: boolean;
    }>;
    
    // Map to ScheduledReminder format
    const scheduledReminders: ScheduledReminder[] = reminders.map(r => ({
      id: r.id,
      peptideId: r.peptide_id,
      peptideName: r.peptide_name,
      dose: r.dose,
      time: r.time,
      days: r.days || [],
      enabled: r.enabled,
    }));
    
    await bulkSaveReminders(scheduledReminders);
    console.log(`Synced ${scheduledReminders.length} reminders to IndexedDB`);
  } catch (error) {
    console.error('Error syncing reminders to IndexedDB:', error);
  }
}

// Notify service worker of changes
function notifyServiceWorker(type: string, data?: unknown): void {
  if (swRegistration?.active) {
    swRegistration.active.postMessage({ type, data });
  }
}

// Register service worker and set up periodic checks
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers not supported');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    
    swRegistration = registration;
    
    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    
    // Sync reminders to IndexedDB
    await syncRemindersToIndexedDB();
    
    // Tell service worker to start checking
    notifyServiceWorker('START_CHECKING');
    
    // Try to register for periodic background sync (if supported)
    if ('periodicSync' in registration) {
      try {
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName,
        });
        
        if (status.state === 'granted') {
          await (registration as unknown as { periodicSync: { register: (tag: string, options: { minInterval: number }) => Promise<void> } })
            .periodicSync.register('check-reminders', {
              minInterval: 60 * 1000, // 1 minute minimum
            });
          console.log('Periodic background sync registered');
        }
      } catch (error) {
        console.log('Periodic background sync not available:', error);
      }
    }
    
    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'NOTIFICATION_ACTION') {
        // Dispatch custom event for app to handle
        window.dispatchEvent(new CustomEvent('swNotificationAction', {
          detail: event.data
        }));
      }
    });
    
    console.log('Service worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

// Request notification permission
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Check if push is supported and enabled
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Get service worker registration status
export async function getServiceWorkerStatus(): Promise<'active' | 'installing' | 'waiting' | 'none'> {
  if (!('serviceWorker' in navigator)) return 'none';
  
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return 'none';
  if (registration.active) return 'active';
  if (registration.installing) return 'installing';
  if (registration.waiting) return 'waiting';
  return 'none';
}

// Force sync reminders and trigger check
export async function forceSyncAndCheck(): Promise<void> {
  await syncRemindersToIndexedDB();
  notifyServiceWorker('CHECK_REMINDERS');
}

// Schedule a snooze notification
export function scheduleSnooze(reminderData: {
  reminderId: string;
  peptideId: string;
  peptideName: string;
  dose: string;
  time: string;
}, minutes: number = 10): void {
  notifyServiceWorker('SCHEDULE_SNOOZE', { reminderData, minutes });
}

// Get the current service worker registration
export function getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
  return swRegistration;
}
