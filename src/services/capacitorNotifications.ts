// Capacitor native notifications service
// This handles push and local notifications for iOS/Android

import { Capacitor } from '@capacitor/core';
import { LocalNotifications, ScheduleOptions, LocalNotificationSchema } from '@capacitor/local-notifications';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';

// Check if running on native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Get current platform
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

// Initialize push notifications (for iOS/Android)
export async function initializePushNotifications(): Promise<string | null> {
  if (!isNativePlatform()) {
    console.log('Push notifications only available on native platforms');
    return null;
  }

  try {
    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    
    if (permResult.receive !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Register for push notifications
    await PushNotifications.register();

    // Wait for registration token
    return new Promise((resolve) => {
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token:', token.value);
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
        resolve(null);
      });
    });
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return null;
  }
}

// Setup push notification listeners
export function setupPushListeners(
  onNotificationReceived: (notification: unknown) => void,
  onNotificationAction: (action: ActionPerformed) => void
): void {
  if (!isNativePlatform()) return;

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received:', notification);
    onNotificationReceived(notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push notification action:', action);
    onNotificationAction(action);
  });
}

// Initialize local notifications
export async function initializeLocalNotifications(): Promise<boolean> {
  if (!isNativePlatform()) {
    console.log('Using web notifications API instead');
    return false;
  }

  try {
    const permResult = await LocalNotifications.requestPermissions();
    return permResult.display === 'granted';
  } catch (error) {
    console.error('Error initializing local notifications:', error);
    return false;
  }
}

// Schedule a local notification
export async function scheduleLocalNotification(
  id: number,
  title: string,
  body: string,
  scheduledAt: Date,
  extra?: Record<string, unknown>
): Promise<void> {
  if (!isNativePlatform()) {
    console.log('Local notifications not available on web');
    return;
  }

  try {
    const notification: LocalNotificationSchema = {
      id,
      title,
      body,
      schedule: { at: scheduledAt },
      sound: 'default',
      actionTypeId: 'DOSE_REMINDER',
      extra: extra || {},
    };

    const options: ScheduleOptions = {
      notifications: [notification],
    };

    await LocalNotifications.schedule(options);
    console.log('Local notification scheduled:', id, scheduledAt);
  } catch (error) {
    console.error('Error scheduling local notification:', error);
  }
}

// Cancel a scheduled notification
export async function cancelLocalNotification(id: number): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    console.log('Local notification cancelled:', id);
  } catch (error) {
    console.error('Error cancelling local notification:', error);
  }
}

// Cancel all scheduled notifications
export async function cancelAllLocalNotifications(): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
      console.log('All local notifications cancelled');
    }
  } catch (error) {
    console.error('Error cancelling all local notifications:', error);
  }
}

// Get pending notifications
export async function getPendingNotifications(): Promise<LocalNotificationSchema[]> {
  if (!isNativePlatform()) return [];

  try {
    const pending = await LocalNotifications.getPending();
    return pending.notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
}

// Setup local notification action listeners
export function setupLocalNotificationListeners(
  onNotificationReceived: (notification: LocalNotificationSchema) => void,
  onNotificationAction: (actionId: string, notification: LocalNotificationSchema) => void
): void {
  if (!isNativePlatform()) return;

  LocalNotifications.addListener('localNotificationReceived', (notification) => {
    console.log('Local notification received:', notification);
    onNotificationReceived(notification);
  });

  LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
    console.log('Local notification action:', event);
    onNotificationAction(event.actionId, event.notification);
  });
}

// Register notification action types
export async function registerNotificationActions(): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'DOSE_REMINDER',
          actions: [
            {
              id: 'taken',
              title: '✓ Taken',
              foreground: true,
            },
            {
              id: 'snooze',
              title: '⏰ Snooze 10min',
              foreground: false,
            },
          ],
        },
      ],
    });
    console.log('Notification action types registered');
  } catch (error) {
    console.error('Error registering notification action types:', error);
  }
}

// Schedule dose reminder (high-level API)
export async function scheduleDoseReminder(
  reminderId: string,
  peptideName: string,
  dose: string,
  scheduledTime: Date,
  peptideId?: string
): Promise<void> {
  // Generate numeric ID from reminder ID
  const numericId = Math.abs(reminderId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));

  await scheduleLocalNotification(
    numericId,
    `💉 Time for ${peptideName}`,
    `Scheduled dose: ${dose}`,
    scheduledTime,
    {
      reminderId,
      peptideName,
      peptideId,
      dose,
      time: scheduledTime.toISOString(),
    }
  );
}

// Cancel dose reminder
export async function cancelDoseReminder(reminderId: string): Promise<void> {
  const numericId = Math.abs(reminderId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));

  await cancelLocalNotification(numericId);
}
