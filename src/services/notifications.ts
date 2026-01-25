import { getNotificationSettings, saveNotificationSettings } from './storage';

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const settings = getNotificationSettings();
    settings.enabled = true;
    saveNotificationSettings(settings);
  }
  
  return permission;
}

// Get current notification permission
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Show a notification
export function showNotification(
  title: string, 
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    console.warn('Cannot show notification - not permitted');
    return null;
  }

  const notification = new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'peptide-reminder',
    requireInteraction: true,
    ...options,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
}

// Show dose reminder notification
export function showDoseReminder(peptideName: string, dose: string, time: string): Notification | null {
  return showNotification(`💉 Time for ${peptideName}`, {
    body: `Scheduled dose: ${dose} at ${time}`,
    tag: `dose-${peptideName}-${time}`,
    requireInteraction: true,
  });
}

// Scheduled notification tracking
interface ScheduledNotification {
  id: string;
  timeoutId: number;
  scheduleId: string;
  scheduledFor: Date;
}

const scheduledNotifications: Map<string, ScheduledNotification> = new Map();

// Schedule a notification for a specific time today
export function scheduleNotification(
  scheduleId: string,
  peptideName: string,
  dose: string,
  timeString: string // HH:MM format
): string | null {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || Notification.permission !== 'granted') {
    return null;
  }

  // Parse time and create date for today
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // Subtract reminder minutes
  const reminderTime = new Date(scheduledTime.getTime() - settings.reminderMinutesBefore * 60 * 1000);

  // If the reminder time has already passed today, don't schedule
  if (reminderTime <= now) {
    return null;
  }

  const delay = reminderTime.getTime() - now.getTime();
  const notificationId = `${scheduleId}-${timeString}-${now.toDateString()}`;

  // Clear any existing notification for this schedule
  cancelNotification(notificationId);

  const timeoutId = window.setTimeout(() => {
    showDoseReminder(peptideName, dose, timeString);
    scheduledNotifications.delete(notificationId);
  }, delay);

  scheduledNotifications.set(notificationId, {
    id: notificationId,
    timeoutId,
    scheduleId,
    scheduledFor: reminderTime,
  });

  return notificationId;
}

// Cancel a scheduled notification
export function cancelNotification(notificationId: string): void {
  const scheduled = scheduledNotifications.get(notificationId);
  if (scheduled) {
    window.clearTimeout(scheduled.timeoutId);
    scheduledNotifications.delete(notificationId);
  }
}

// Cancel all scheduled notifications
export function cancelAllNotifications(): void {
  scheduledNotifications.forEach((scheduled) => {
    window.clearTimeout(scheduled.timeoutId);
  });
  scheduledNotifications.clear();
}

// Schedule all today's doses from cloud-synced reminders
export function scheduleAllTodaysDoses(): void {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || Notification.permission !== 'granted') {
    return;
  }

  // Try to load from localStorage (the useDoseReminders hook keeps this synced)
  try {
    const stored = localStorage.getItem('peptide-dose-reminders');
    if (!stored) return;
    
    const reminders = JSON.parse(stored) as Array<{
      id: string;
      peptide_name: string;
      dose: string;
      time: string;
      days: string[];
      enabled: boolean;
    }>;
    
    const today = new Date();
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDay = dayNames[today.getDay()];
    
    reminders.forEach((reminder) => {
      if (!reminder.enabled) return;
      
      // Check if today is a scheduled day (empty means every day)
      if (reminder.days.length > 0 && !reminder.days.includes(currentDay)) {
        return;
      }
      
      scheduleNotification(
        reminder.id,
        reminder.peptide_name,
        reminder.dose,
        reminder.time
      );
    });
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
}

// Enable notifications for a schedule
export function enableNotificationForSchedule(scheduleId: string): void {
  const settings = getNotificationSettings();
  if (!settings.scheduleIds.includes(scheduleId)) {
    settings.scheduleIds.push(scheduleId);
    saveNotificationSettings(settings);
  }
}

// Disable notifications for a schedule
export function disableNotificationForSchedule(scheduleId: string): void {
  const settings = getNotificationSettings();
  settings.scheduleIds = settings.scheduleIds.filter(id => id !== scheduleId);
  saveNotificationSettings(settings);
}

// Check if notifications are enabled for a schedule
export function isNotificationEnabledForSchedule(scheduleId: string): boolean {
  const settings = getNotificationSettings();
  return settings.scheduleIds.length === 0 || settings.scheduleIds.includes(scheduleId);
}
