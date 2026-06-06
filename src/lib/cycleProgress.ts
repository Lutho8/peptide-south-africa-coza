// Cycle progress driven by actual daily-log entries.
// A cycle no longer auto-advances by wall-clock time — it advances only when
// the user logs a dose for that peptide. This means a weekly peptide stays at
// "1 / N" until the next dose is logged, and a daily peptide pauses on days
// without a log.

import type { Cycle } from '@/services/storage';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';

export interface CycleProgress {
  /** Distinct dose occurrences logged for this cycle's peptide since startDate */
  dosesLogged: number;
  /** Doses the schedule expects by today (frequency × elapsed time, capped at planned) */
  dosesExpected: number;
  /** Total planned doses for the whole cycle */
  dosesPlanned: number;
  /** % complete based on logged / planned */
  progress: number;
  /** Approaching end of cycle (>=85% of planned doses logged) */
  isNearing: boolean;
  /** Logged >= planned */
  isOverdue: boolean;
  /** Wall-clock days since startDate, for contextual labels only */
  calendarDays: number;
  /** Doses behind the expected pace (>= 0) */
  dosesBehind: number;
  /** Doses per week implied by the frequency string */
  perWeek: number;
}

/** Normalise an id or peptide name to a comparable slug. */
function slug(s: string | undefined | null): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Parse a frequency string into doses-per-week. Unknown → daily (7). */
export function parseFrequencyPerWeek(frequency: string | undefined): number {
  if (!frequency) return 7;
  const f = frequency.toLowerCase().trim();

  // Multiple doses per day
  if (/(2x|twice)\s*(daily|\/?\s*day)/.test(f) || f.includes('split')) return 14;
  if (/(3x|thrice)\s*(daily|\/?\s*day)/.test(f)) return 21;

  // Every other day / EOD / alternate
  if (f.includes('eod') || f.includes('every other day') || f.includes('alternate')) return 3.5;

  // Nx per week / Nx weekly
  const xWeekly = f.match(/(\d+)\s*x\s*\/?\s*(week|weekly)/);
  if (xWeekly) return Math.min(14, Math.max(1, parseInt(xWeekly[1], 10)));

  // "N times weekly"
  const nTimes = f.match(/(\d+)\s*times?\s*(per\s*)?week/);
  if (nTimes) return Math.min(14, Math.max(1, parseInt(nTimes[1], 10)));

  // Once weekly / weekly
  if (f.includes('weekly') || f.includes('once a week') || f.includes('per week')) return 1;

  // Monthly
  if (f.includes('monthly')) return 0.25;

  // Daily / every day / every night / morning / bedtime — default
  return 7;
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Count logged doses for a cycle's peptide between startDate and now.
 * Daily peptides collapse multiple same-day logs into one occurrence so a
 * burst of corrective entries doesn't fast-forward the cycle.
 */
function countLoggedDoses(cycle: Cycle, doses: DailyDoseEntry[], perWeek: number): number {
  const cycleSlugs = new Set([slug(cycle.peptideId), slug(cycle.peptideName)].filter(Boolean));
  const startStr = cycle.startDate;

  const matches = doses.filter(d => {
    if (d.date < startStr) return false;
    return cycleSlugs.has(slug(d.peptide_id)) || cycleSlugs.has(slug(d.peptide_name));
  });

  // For daily-or-more frequencies, dedupe by date so two same-day logs still
  // count as one cycle day. For sub-daily frequencies (weekly, EOD, monthly),
  // every logged dose counts as its own occurrence.
  if (perWeek >= 7) {
    const days = new Set(matches.map(m => m.date));
    return days.size;
  }
  return matches.length;
}

export function getCycleProgress(
  cycle: Cycle,
  doses: DailyDoseEntry[] = [],
  now: Date = new Date(),
): CycleProgress {
  const perWeek = parseFrequencyPerWeek(cycle.frequency);
  const start = new Date(cycle.startDate);
  const calendarDays = daysBetween(start, now);

  // Planned dose count for the entire cycle.
  const dosesPlanned = Math.max(1, Math.round((cycle.plannedDuration / 7) * perWeek));

  // Expected by today based on the schedule (capped at planned).
  const dosesExpectedRaw = Math.floor(((calendarDays + 1) / 7) * perWeek);
  const dosesExpected = Math.min(dosesPlanned, Math.max(0, dosesExpectedRaw));

  const dosesLogged = Math.min(dosesPlanned, countLoggedDoses(cycle, doses, perWeek));
  const dosesBehind = Math.max(0, dosesExpected - dosesLogged);

  const progress = Math.min(100, (dosesLogged / dosesPlanned) * 100);
  const warningThreshold = dosesPlanned * 0.85;

  return {
    dosesLogged,
    dosesExpected,
    dosesPlanned,
    progress,
    isNearing: dosesLogged >= warningThreshold && dosesLogged < dosesPlanned,
    isOverdue: dosesLogged >= dosesPlanned,
    calendarDays,
    dosesBehind,
    perWeek,
  };
}

/** Short status word used in badges / labels. */
export function cycleStatusLabel(p: CycleProgress, status?: string): string {
  if (status === 'break') return 'On Break';
  if (p.isOverdue) return 'Complete';
  if (p.isNearing) return 'Nearing End';
  if (p.dosesBehind >= 2) return 'Behind';
  if (p.dosesLogged === 0) return 'Not Started';
  return 'Active';
}
