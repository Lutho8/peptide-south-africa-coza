// Peptide Tracker Service Worker for Background Notifications

const CACHE_NAME = 'peptide-tracker-v2';
const DB_NAME = 'peptide-reminders-db';
const DB_VERSION = 2;
const STORE_NAME = 'scheduled-reminders';
const FIRED_STORE = 'fired-notifications';

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create reminders store if not exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('nextFireTime', 'nextFireTime', { unique: false });
        store.createIndex('enabled', 'enabled', { unique: false });
      }
      
      // Create fired notifications store to prevent duplicates
      if (!db.objectStoreNames.contains(FIRED_STORE)) {
        const firedStore = db.createObjectStore(FIRED_STORE, { keyPath: 'id' });
        firedStore.createIndex('firedAt', 'firedAt', { unique: false });
      }
    };
  });
}

// Get all reminders from IndexedDB
async function getReminders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Check if notification was already fired
async function wasNotificationFired(notificationId) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(FIRED_STORE, 'readonly');
      const store = transaction.objectStore(FIRED_STORE);
      const request = store.get(notificationId);
      
      request.onerror = () => resolve(false);
      request.onsuccess = () => resolve(!!request.result);
    });
  } catch {
    return false;
  }
}

// Mark notification as fired
async function markNotificationFired(notificationId) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(FIRED_STORE, 'readwrite');
      const store = transaction.objectStore(FIRED_STORE);
      store.put({ id: notificationId, firedAt: Date.now() });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  } catch {
    // Ignore errors
  }
}

// Clean up old fired notifications (older than 24 hours)
async function cleanupFiredNotifications() {
  try {
    const db = await openDB();
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    
    return new Promise((resolve) => {
      const transaction = db.transaction(FIRED_STORE, 'readwrite');
      const store = transaction.objectStore(FIRED_STORE);
      const index = store.index('firedAt');
      const range = IDBKeyRange.upperBound(cutoff);
      
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  } catch {
    // Ignore errors
  }
}

// Update reminder's next fire time in IndexedDB
async function updateReminderNextFireTime(reminderId, nextFireTime) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(reminderId);
      
      getRequest.onsuccess = () => {
        const reminder = getRequest.result;
        if (reminder) {
          reminder.nextFireTime = nextFireTime;
          store.put(reminder);
        }
      };
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  } catch {
    // Ignore errors
  }
}

// Calculate next fire time for a reminder
function calculateNextFireTime(time, days) {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  
  // Check next 7 days
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    checkDate.setHours(hours, minutes, 0, 0);
    
    // Skip if in the past (with 1 min buffer for processing)
    if (checkDate.getTime() <= now.getTime() + 60000) continue;
    
    const dayName = dayNames[checkDate.getDay()];
    
    // If days is empty, every day is valid
    if (!days || days.length === 0 || days.includes(dayName)) {
      return checkDate.getTime();
    }
  }
  
  // Fallback to next week same time
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(hours, minutes, 0, 0);
  return nextWeek.getTime();
}

// Check and show due notifications
async function checkDueNotifications() {
  try {
    const reminders = await getReminders();
    const now = Date.now();
    const notificationsToShow = [];
    
    for (const reminder of reminders) {
      if (!reminder.enabled || !reminder.nextFireTime) continue;
      
      // Check if due (within 1 minute window)
      const timeDiff = now - reminder.nextFireTime;
      if (timeDiff >= -30000 && timeDiff <= 60000) {
        // Create unique ID for this specific notification instance
        const notificationId = `${reminder.id}-${reminder.nextFireTime}`;
        
        // Check if already fired
        const alreadyFired = await wasNotificationFired(notificationId);
        if (alreadyFired) continue;
        
        notificationsToShow.push({
          reminder,
          notificationId
        });
      }
    }
    
    // Show notifications
    for (const { reminder, notificationId } of notificationsToShow) {
      await markNotificationFired(notificationId);
      
      await self.registration.showNotification(`💉 Time for ${reminder.peptideName}`, {
        body: `Scheduled dose: ${reminder.dose} at ${reminder.time}`,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: notificationId,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          { action: 'taken', title: '✓ Taken' },
          { action: 'snooze', title: '⏰ Snooze 10min' }
        ],
        data: {
          reminderId: reminder.id,
          peptideName: reminder.peptideName,
          peptideId: reminder.peptideId,
          dose: reminder.dose,
          time: reminder.time
        }
      });
      
      // Calculate and update next fire time
      const nextFireTime = calculateNextFireTime(reminder.time, reminder.days);
      await updateReminderNextFireTime(reminder.id, nextFireTime);
    }
    
    // Clean up old fired notifications periodically
    if (Math.random() < 0.1) {
      await cleanupFiredNotifications();
    }
    
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
}

// Schedule a snooze notification
async function scheduleSnooze(data, minutes = 10) {
  const snoozeTime = Date.now() + minutes * 60 * 1000;
  
  // Store snooze in IndexedDB
  try {
    const db = await openDB();
    const snoozeReminder = {
      id: `snooze-${data.reminderId}-${snoozeTime}`,
      peptideId: data.peptideId,
      peptideName: data.peptideName,
      dose: data.dose,
      time: data.time,
      days: [],
      enabled: true,
      nextFireTime: snoozeTime,
      isSnooze: true
    };
    
    await new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(snoozeReminder);
      transaction.oncomplete = () => resolve();
    });
  } catch (error) {
    console.error('Error scheduling snooze:', error);
  }
}

// Handle service worker install
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Handle service worker activate
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Start checking immediately
      checkDueNotifications()
    ])
  );
});

// Handle push notifications (for server-triggered push)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || '💉 Dose Reminder', {
        body: data.body || 'Time for your scheduled dose',
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: data.tag || 'dose-reminder',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          { action: 'taken', title: '✓ Taken' },
          { action: 'snooze', title: '⏰ Snooze' }
        ],
        data: data.payload || {}
      })
    );
  } catch (error) {
    console.error('Push event error:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  event.waitUntil(
    (async () => {
      // Handle snooze action
      if (action === 'snooze') {
        await scheduleSnooze(data, 10);
        // Notify clients about snooze
        const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of allClients) {
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: 'snooze',
            data: data
          });
        }
        return;
      }
      
      // Find or open a window
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      
      for (const client of allClients) {
        if ('focus' in client) {
          await client.focus();
          // Send message to the client
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: action || 'click',
            data: data
          });
          return;
        }
      }
      
      // No window found, open a new one
      if (clients.openWindow) {
        const newClient = await clients.openWindow('/');
        // Wait a bit for the page to load, then send message
        setTimeout(() => {
          newClient?.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: action || 'click',
            data: data
          });
        }, 2000);
      }
    })()
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'CHECK_REMINDERS':
      checkDueNotifications();
      break;
      
    case 'START_CHECKING':
      // Start periodic checks
      startPeriodicChecks();
      break;
      
    case 'SYNC_REMINDERS':
      // Reminders have been updated, check immediately
      checkDueNotifications();
      break;
      
    case 'SCHEDULE_SNOOZE':
      scheduleSnooze(data.reminderData, data.minutes);
      break;
  }
});

// Periodic checking interval
let checkInterval = null;

function startPeriodicChecks() {
  if (checkInterval) return;
  
  // Check every 30 seconds
  checkInterval = setInterval(() => {
    checkDueNotifications();
  }, 30000);
  
  // Also check immediately
  checkDueNotifications();
}

// Start checking when service worker starts
startPeriodicChecks();

// Periodic sync for checking reminders (when supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkDueNotifications());
  }
});

// Background sync for when coming back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reminders') {
    event.waitUntil(checkDueNotifications());
  }
});

// Alarm API fallback check (using setTimeout chain for reliability)
function scheduleNextCheck() {
  // Calculate time until next minute boundary
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  
  setTimeout(() => {
    checkDueNotifications();
    scheduleNextCheck();
  }, msUntilNextMinute);
}

// Start the minute-boundary check chain
scheduleNextCheck();
