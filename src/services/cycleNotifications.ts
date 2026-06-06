import { getCycles, Cycle } from '@/services/storage';
import { findPeptideOrBlend } from '@/data/blendAdapters';
import { getCycleSuggestion } from '@/data/cycleSuggestions';
import { showNotification, isNotificationSupported } from '@/services/notifications';
import { getStoredData } from '@/services/storage';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';
import { getCycleProgress } from '@/lib/cycleProgress';

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

function getProtocolForCycle(cycle: Cycle): { maxDays: number; breakDays: number } | null {
  // Try peptide cycleProtocol first
  const peptide = findPeptideOrBlend(cycle.peptideId);
  if (peptide?.cycleProtocol) {
    return peptide.cycleProtocol;
  }

  // Fall back to cycle suggestions (covers blends)
  const suggestion = getCycleSuggestion(cycle.peptideId);
  if (suggestion?.protocols?.length) {
    const proto = suggestion.protocols[0];
    return { maxDays: proto.cycleDuration, breakDays: proto.breakDuration };
  }

  // Use the cycle's own planned duration as last resort
  if (cycle.plannedDuration > 0) {
    return { maxDays: cycle.plannedDuration, breakDays: cycle.breakDuration };
  }

  return null;
}

export function checkCycleNotifications(): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const cycles = getCycles();
  // Logged doses drive cycle progress so a paused/skipped schedule doesn't
  // trigger end-of-cycle alerts based on wall-clock time alone.
  const doses = getStoredData<DailyDoseEntry[]>('peptide-daily-doses', []);

  cycles
    .filter(c => c.status === 'active')
    .forEach(cycle => {
      const protocol = getProtocolForCycle(cycle);
      if (!protocol) return;

      const progress = getCycleProgress(cycle, doses);
      const dosesRemaining = progress.dosesPlanned - progress.dosesLogged;
      const warningThreshold = Math.max(1, Math.floor(progress.dosesPlanned * 0.15));

      // Warning: 85% of planned doses logged
      if (dosesRemaining <= warningThreshold && dosesRemaining > 0) {
        if (!wasNotificationSent(cycle.id, 'warning')) {
          showNotification(`⏰ ${cycle.peptideName} — Cycle Ending Soon`, {
            body: `${dosesRemaining} dose${dosesRemaining > 1 ? 's' : ''} left in your ${progress.dosesPlanned}-dose cycle. Plan your ${protocol.breakDays}-day break.`,
            tag: `cycle-warning-${cycle.id}`,
            requireInteraction: true,
          });
          markNotificationSent(cycle.id, 'warning');
        }
      }

      // Overdue: all planned doses logged
      if (progress.isOverdue) {
        if (!wasNotificationSent(cycle.id, 'overdue')) {
          showNotification(`🛑 ${cycle.peptideName} — Cycle Complete`, {
            body: `You've logged all ${progress.dosesPlanned} planned doses. Take a ${protocol.breakDays}-day break to maintain receptor sensitivity and safety.`,
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
