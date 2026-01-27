import { useMemo } from 'react';
import { useDoseReminders, DoseReminder } from './useDoseReminders';
import { useDailyDoses, DailyDoseEntry } from './useDailyDoses';
import { format, subDays, startOfDay } from 'date-fns';

export interface PeptideAdherence {
  peptideId: string;
  peptideName: string;
  expected: number;
  actual: number;
  percentage: number;
}

export interface AdherenceReport {
  overall: {
    expected: number;
    actual: number;
    percentage: number;
  };
  byPeptide: PeptideAdherence[];
  streak: number;
  isLoading: boolean;
  hasReminders: boolean;
}

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function getLast7Days(): Date[] {
  const days: Date[] = [];
  const today = startOfDay(new Date());
  
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(today, i));
  }
  
  return days;
}

function getDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

function isReminderScheduledForDay(reminder: DoseReminder, day: Date): boolean {
  if (!reminder.enabled) return false;
  
  // Empty days array means every day
  if (reminder.days.length === 0) return true;
  
  const dayName = getDayName(day);
  return reminder.days.includes(dayName);
}

function calculatePeptideAdherence(
  peptideId: string,
  peptideName: string,
  reminders: DoseReminder[],
  doses: DailyDoseEntry[],
  days: Date[]
): PeptideAdherence {
  let expected = 0;
  let actual = 0;
  
  for (const day of days) {
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Count scheduled reminders for this peptide on this day
    const scheduledCount = reminders.filter(r => 
      r.peptide_id === peptideId && isReminderScheduledForDay(r, day)
    ).length;
    
    expected += scheduledCount;
    
    // Count logged doses for this peptide on this day
    const loggedCount = doses.filter(d => 
      d.peptide_id === peptideId && d.date === dateStr
    ).length;
    
    // Cap actual at expected to avoid over-counting
    actual += Math.min(loggedCount, scheduledCount);
  }
  
  return {
    peptideId,
    peptideName,
    expected,
    actual,
    percentage: expected > 0 ? Math.round((actual / expected) * 100) : 0
  };
}

function calculateStreak(
  reminders: DoseReminder[],
  doses: DailyDoseEntry[]
): number {
  if (reminders.length === 0) return 0;
  
  let streak = 0;
  const today = startOfDay(new Date());
  
  // Check backwards from today
  for (let i = 0; i < 30; i++) {
    const day = subDays(today, i);
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Get expected doses for this day
    let expectedForDay = 0;
    let actualForDay = 0;
    
    for (const reminder of reminders) {
      if (isReminderScheduledForDay(reminder, day)) {
        expectedForDay++;
        
        const hasLog = doses.some(d => 
          d.peptide_id === reminder.peptide_id && d.date === dateStr
        );
        
        if (hasLog) actualForDay++;
      }
    }
    
    // If no reminders scheduled for this day, continue streak
    if (expectedForDay === 0) continue;
    
    // If 100% adherence, increment streak
    if (actualForDay >= expectedForDay) {
      streak++;
    } else {
      // Streak broken
      break;
    }
  }
  
  return streak;
}

export function useAdherenceReport(): AdherenceReport {
  const { reminders, isLoading: remindersLoading } = useDoseReminders();
  const { doses, isLoading: dosesLoading } = useDailyDoses();
  
  const report = useMemo(() => {
    const days = getLast7Days();
    
    // Get unique peptide IDs from enabled reminders
    const peptideMap = new Map<string, string>();
    reminders.forEach(r => {
      if (r.enabled) {
        peptideMap.set(r.peptide_id, r.peptide_name);
      }
    });
    
    // Calculate adherence per peptide
    const byPeptide: PeptideAdherence[] = [];
    let totalExpected = 0;
    let totalActual = 0;
    
    peptideMap.forEach((peptideName, peptideId) => {
      const adherence = calculatePeptideAdherence(
        peptideId,
        peptideName,
        reminders,
        doses,
        days
      );
      
      byPeptide.push(adherence);
      totalExpected += adherence.expected;
      totalActual += adherence.actual;
    });
    
    // Sort by peptide name
    byPeptide.sort((a, b) => a.peptideName.localeCompare(b.peptideName));
    
    // Calculate overall
    const overall = {
      expected: totalExpected,
      actual: totalActual,
      percentage: totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0
    };
    
    // Calculate streak
    const streak = calculateStreak(reminders, doses);
    
    return {
      overall,
      byPeptide,
      streak,
      hasReminders: reminders.filter(r => r.enabled).length > 0
    };
  }, [reminders, doses]);
  
  return {
    ...report,
    isLoading: remindersLoading || dosesLoading
  };
}
