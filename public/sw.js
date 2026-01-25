// Peptide Tracker Service Worker for Background Notifications

const CACHE_NAME = 'peptide-tracker-v1';
const DB_NAME = 'peptide-reminders-db';
const DB_VERSION = 1;
const STORE_NAME = 'scheduled-reminders';

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('nextFireTime', 'nextFireTime', { unique: false });
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

// Check and show due notifications
async function checkDueNotifications() {
  try {
    const reminders = await getReminders();
    const now = Date.now();
    
    for (const reminder of reminders) {
      if (reminder.enabled && reminder.nextFireTime && reminder.nextFireTime <= now) {
        await self.registration.showNotification(`💉 Time for ${reminder.peptideName}`, {
          body: `Scheduled dose: ${reminder.dose} at ${reminder.time}`,
          icon: '/favicon.png',
          badge: '/favicon.png',
          tag: `dose-${reminder.id}`,
          requireInteraction: true,
          actions: [
            { action: 'taken', title: '✓ Taken' },
            { action: 'snooze', title: '⏰ Snooze 10min' }
          ],
          data: {
            reminderId: reminder.id,
            peptideName: reminder.peptideName,
            dose: reminder.dose,
            time: reminder.time
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
}

// Handle service worker install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Handle service worker activate
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle push notifications
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
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find an existing window/tab
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
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
        return clients.openWindow('/');
      }
    })
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'CHECK_REMINDERS') {
    checkDueNotifications();
  }
  
  if (event.data.type === 'SCHEDULE_CHECK') {
    // Schedule periodic checks
    setInterval(() => {
      checkDueNotifications();
    }, 60000); // Check every minute
  }
});

// Periodic sync for checking reminders (when supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkDueNotifications());
  }
});
