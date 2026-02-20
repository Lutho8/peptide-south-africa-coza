import { getCycles, Cycle } from '@/services/storage';
import { peptides } from '@/data/peptides';
import { showNotification, isNotificationSupported } from '@/services/notifications';

const CYCLE_NOTIFICATION_KEY = 'peptide_app_cycle_notifications_sent';

interface SentNotification {
  cycleId: string;
  type: 'warning' | 'overdue';
  sentAt: string;
}

function getSentNotifications(): SentNotification[] {
  try {
    const stored = localStorage.getItem(CYCLE_NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function markNotificationSent(cycleId: string, type: 'warning' | 'overdue'): void {
  const sent = getSentNotifications();
  sent.push({ cycleId, type, sentAt: new Date().toISOString() });
  localStorage.setItem(CYCLE_NOTIFICATION_KEY, JSON.stringify(sent));
}

function wasNotificationSent(cycleId: string, type: 'warning' | 'overdue'): boolean {
  const sent = getSentNotifications();
  const today = new Date().toISOString().split('T')[0];
  return sent.some(
    n => n.cycleId === cycleId && n.type === type && n.sentAt.startsWith(today)
  );
}

function getDaysElapsed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function checkCycleNotifications(): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const cycles = getCycles();

  cycles
    .filter(c => c.status === 'active')
    .forEach(cycle => {
      const peptide = peptides.find(p => p.id === cycle.peptideId);
      const protocol = peptide?.cycleProtocol;
      if (!protocol) return;

      const daysElapsed = getDaysElapsed(cycle.startDate);
      const daysRemaining = protocol.maxDays - daysElapsed;
      const warningThreshold = Math.min(7, Math.floor(protocol.maxDays * 0.15)); // 15% or 7 days

      // Warning: nearing end
      if (daysRemaining <= warningThreshold && daysRemaining > 0) {
        if (!wasNotificationSent(cycle.id, 'warning')) {
          showNotification(`⏰ ${cycle.peptideName} — Cycle Ending Soon`, {
            body: `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining in your recommended ${protocol.maxDays}-day cycle. Plan your ${protocol.breakDays}-day break.`,
            tag: `cycle-warning-${cycle.id}`,
            requireInteraction: true,
          });
          markNotificationSent(cycle.id, 'warning');
        }
      }

      // Overdue: exceeded recommended duration
      if (daysRemaining <= 0) {
        if (!wasNotificationSent(cycle.id, 'overdue')) {
          const overdueDays = Math.abs(daysRemaining);
          showNotification(`🛑 ${cycle.peptideName} — Break Overdue`, {
            body: `You've exceeded the recommended cycle by ${overdueDays} day${overdueDays > 1 ? 's' : ''}. Take a ${protocol.breakDays}-day break to maintain receptor sensitivity and safety.`,
            tag: `cycle-overdue-${cycle.id}`,
            requireInteraction: true,
          });
          markNotificationSent(cycle.id, 'overdue');
        }
      }
    });
}

// Start periodic checking (every hour while app is open)
let checkInterval: ReturnType<typeof setInterval> | null = null;

export function startCycleNotificationChecker(): void {
  // Check immediately
  checkCycleNotifications();
  
  // Then check every hour
  if (checkInterval) clearInterval(checkInterval);
  checkInterval = setInterval(checkCycleNotifications, 60 * 60 * 1000);
}

export function stopCycleNotificationChecker(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}
