// Parse cycle frequency strings into reminder schedules

export interface ParsedSchedule {
  days: string[]; // empty means every day
  suggestedTime: string; // HH:MM format
}

/**
 * Parse frequency strings like "Daily", "3x weekly", "Before bed" into
 * day/time schedules for reminders
 */
export function parseFrequencyToSchedule(frequency: string): ParsedSchedule {
  const freqLower = frequency.toLowerCase().trim();

  // Time-based patterns
  if (freqLower.includes('before bed') || freqLower.includes('evening') || freqLower.includes('night')) {
    return { days: [], suggestedTime: '22:00' };
  }
  
  if (freqLower.includes('morning') || freqLower.includes('am') || freqLower.includes('fasted')) {
    return { days: [], suggestedTime: '07:00' };
  }

  // Frequency patterns
  if (freqLower === 'daily' || freqLower.includes('every day')) {
    return { days: [], suggestedTime: '09:00' };
  }

  if (freqLower.includes('weekly') && !freqLower.includes('x')) {
    // Once weekly
    return { days: ['mon'], suggestedTime: '09:00' };
  }

  // Match patterns like "3x weekly", "3x/week", "3 times weekly"
  const xWeeklyMatch = freqLower.match(/(\d+)\s*x\s*(\/?\s*week|weekly)/);
  if (xWeeklyMatch) {
    const times = parseInt(xWeeklyMatch[1], 10);
    return { days: getSpreadDays(times), suggestedTime: '09:00' };
  }

  // Match "2x daily", "twice daily"
  if (freqLower.includes('2x daily') || freqLower.includes('twice daily')) {
    return { days: [], suggestedTime: '09:00' }; // Will need to create 2 reminders
  }

  // Match "EOD" or "every other day"
  if (freqLower.includes('eod') || freqLower.includes('every other day') || freqLower.includes('alternate')) {
    return { days: ['mon', 'wed', 'fri', 'sun'], suggestedTime: '09:00' };
  }

  // Split AM/PM patterns
  if (freqLower.includes('split am/pm') || freqLower.includes('split')) {
    return { days: [], suggestedTime: '08:00' }; // First dose
  }

  // Default to daily at 9am
  return { days: [], suggestedTime: '09:00' };
}

/**
 * Spread dose days evenly across the week
 */
function getSpreadDays(timesPerWeek: number): string[] {
  switch (timesPerWeek) {
    case 1:
      return ['mon'];
    case 2:
      return ['mon', 'thu'];
    case 3:
      return ['mon', 'wed', 'fri'];
    case 4:
      return ['mon', 'tue', 'thu', 'sat'];
    case 5:
      return ['mon', 'tue', 'wed', 'thu', 'fri'];
    case 6:
      return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    case 7:
    default:
      return []; // Every day
  }
}

/**
 * Check if a frequency suggests multiple doses per day
 */
export function needsMultipleReminders(frequency: string): boolean {
  const freqLower = frequency.toLowerCase();
  return freqLower.includes('2x daily') || 
         freqLower.includes('twice daily') ||
         freqLower.includes('split am/pm') ||
         freqLower.includes('split');
}

/**
 * Get second reminder time for split doses
 */
export function getSecondDoseTime(firstTime: string): string {
  const [hours] = firstTime.split(':').map(Number);
  // Add ~10 hours for PM dose
  const pmHours = (hours + 10) % 24;
  return `${pmHours.toString().padStart(2, '0')}:00`;
}

/**
 * Format days array to readable string
 */
export function formatDaysToString(days: string[]): string {
  if (days.length === 0) return 'Every day';
  if (days.length === 7) return 'Every day';
  
  const dayMap: Record<string, string> = {
    'sun': 'Sun',
    'mon': 'Mon',
    'tue': 'Tue',
    'wed': 'Wed',
    'thu': 'Thu',
    'fri': 'Fri',
    'sat': 'Sat',
  };
  
  return days.map(d => dayMap[d] || d).join(', ');
}
