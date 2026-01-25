// IndexedDB-based push notification scheduler for service worker

const DB_NAME = 'peptide-reminders-db';
const DB_VERSION = 1;
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
}

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('nextFireTime', 'nextFireTime', { unique: false });
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
    
    // Skip if in the past today
    if (i === 0 && checkDate <= now) continue;
    
    const dayName = dayNames[checkDate.getDay()];
    
    // If days is empty, every day is valid
    if (days.length === 0 || days.includes(dayName)) {
      return checkDate.getTime();
    }
  }
  
  // Fallback to tomorrow same time
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return tomorrow.getTime();
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
    request.onsuccess = () => resolve();
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
    
    transaction.oncomplete = () => resolve();
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
    request.onsuccess = () => resolve();
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

// Sync reminders from localStorage to IndexedDB
export async function syncRemindersToIndexedDB(): Promise<void> {
  try {
    const stored = localStorage.getItem('peptide-dose-reminders');
    if (!stored) return;
    
    const reminders = JSON.parse(stored) as ScheduledReminder[];
    await bulkSaveReminders(reminders);
  } catch (error) {
    console.error('Error syncing reminders to IndexedDB:', error);
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
      scope: '/'
    });
    
    // Sync reminders to IndexedDB
    await syncRemindersToIndexedDB();
    
    // Tell service worker to start checking
    if (registration.active) {
      registration.active.postMessage({ type: 'SCHEDULE_CHECK' });
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
