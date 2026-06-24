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
  if (status === 'break') return 'Paused';
  if (p.isOverdue) return 'Complete';
  if (p.dosesLogged === 0) return 'Not Started';
  if (p.isNearing) return 'Nearing End';
  // Weekly / sub-daily cadence: a single missed expected dose pauses the cycle
  if (p.perWeek < 7 && p.dosesBehind >= 1) return 'Paused';
  if (p.dosesBehind >= 2) return 'Behind';
  return 'On Track';
}

/**
 * Return the set of YYYY-MM-DD dates with a logged dose for this cycle's peptide,
 * on or after the cycle start. Used by calendars to highlight only days the user
 * actually logged — the cycle does not advance for empty days.
 */
export function getLoggedDoseDates(
  cycle: Cycle,
  doses: DailyDoseEntry[] = [],
): Set<string> {
  const cycleSlugs = new Set(
    [slug(cycle.peptideId), slug(cycle.peptideName)].filter(Boolean),
  );
  const out = new Set<string>();
  for (const d of doses) {
    if (d.date < cycle.startDate) continue;
    if (cycleSlugs.has(slug(d.peptide_id)) || cycleSlugs.has(slug(d.peptide_name))) {
      out.add(d.date);
    }
  }
  return out;
}

/** Doses matching this cycle's peptide on/after startDate, sorted ascending by date+time. */
function matchedDoses(cycle: Cycle, doses: DailyDoseEntry[]): DailyDoseEntry[] {
  const cycleSlugs = new Set([slug(cycle.peptideId), slug(cycle.peptideName)].filter(Boolean));
  return doses
    .filter(d => d.date >= cycle.startDate && (cycleSlugs.has(slug(d.peptide_id)) || cycleSlugs.has(slug(d.peptide_name))))
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
}

export type CyclePhase =
  | 'not_started'
  | 'ramp_up'
  | 'maintenance'
  | 'taper'
  | 'complete'
  | 'paused';

export interface PhaseInfo {
  phase: CyclePhase;
  label: string;
  weekNow: number;
  weeksTotal: number;
  weeksLeft: number;
}

export function getCyclePhase(cycle: Cycle, info: CycleProgress): PhaseInfo {
  const weeksTotal = Math.max(1, Math.ceil(cycle.plannedDuration / 7));
  const weekNow = Math.min(weeksTotal, Math.max(1, Math.floor(info.calendarDays / 7) + 1));
  const weeksLeft = Math.max(0, weeksTotal - weekNow);

  if (cycle.status === 'break') {
    return { phase: 'paused', label: 'Paused', weekNow, weeksTotal, weeksLeft };
  }
  if (info.isOverdue) {
    return { phase: 'complete', label: 'Break recommended', weekNow, weeksTotal, weeksLeft: 0 };
  }
  if (info.dosesLogged === 0) {
    return { phase: 'not_started', label: 'Not started', weekNow: 1, weeksTotal, weeksLeft: weeksTotal };
  }
  const pct = info.dosesLogged / info.dosesPlanned;
  if (pct < 0.2) return { phase: 'ramp_up', label: 'Ramp-up', weekNow, weeksTotal, weeksLeft };
  if (pct >= 0.85) return { phase: 'taper', label: 'Taper / nearing end', weekNow, weeksTotal, weeksLeft };
  return { phase: 'maintenance', label: 'Maintenance', weekNow, weeksTotal, weeksLeft };
}

export interface NextDoseInfo {
  /** ISO date YYYY-MM-DD when the next dose is expected */
  date: string;
  /** Time HH:MM if we can infer it from the last log, else null */
  time: string | null;
  /** Whole days from today (negative if overdue) */
  daysFromToday: number;
  /** Friendly label: "Today", "Tomorrow", "in 3 days", "2 days overdue" */
  label: string;
}

export function getNextDose(
  cycle: Cycle,
  doses: DailyDoseEntry[] = [],
  now: Date = new Date(),
): NextDoseInfo | null {
  if (cycle.status === 'break') return null;
  const perWeek = parseFrequencyPerWeek(cycle.frequency);
  if (perWeek <= 0) return null;
  const intervalDays = 7 / perWeek;

  const logs = matchedDoses(cycle, doses);
  let anchor: Date;
  let time: string | null = null;

  if (logs.length === 0) {
    anchor = new Date(cycle.startDate);
    // No prior log → "next" dose is today (or start date if future)
    const todayIso = now.toISOString().split('T')[0];
    const next = anchor > now ? anchor : new Date(todayIso);
    return formatNextDose(next, time, now);
  }

  const last = logs[logs.length - 1];
  anchor = new Date(last.date);
  time = last.time || null;
  const next = new Date(anchor);
  next.setDate(next.getDate() + Math.max(1, Math.round(intervalDays)));
  return formatNextDose(next, time, now);
}

function formatNextDose(next: Date, time: string | null, now: Date): NextDoseInfo {
  const today = new Date(now.toISOString().split('T')[0]);
  const nextDay = new Date(next.toISOString().split('T')[0]);
  const days = Math.round((nextDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  let label: string;
  if (days < 0) label = `${Math.abs(days)}d overdue`;
  else if (days === 0) label = time ? `Today ${time}` : 'Today';
  else if (days === 1) label = time ? `Tomorrow ${time}` : 'Tomorrow';
  else label = `in ${days} days`;
  return { date: nextDay.toISOString().split('T')[0], time, daysFromToday: days, label };
}

export interface BackdateValidation {
  /** True if no issues */
  ok: boolean;
  /** Severity: info = informational, warning = action recommended */
  severity: 'info' | 'warning';
  message: string;
  /** Useful counts */
  logsBeforeStart: number;
  logsAfterStart: number;
  expectedByNow: number;
}

/**
 * Validate a proposed start date against logged doses for this peptide.
 * Surfaces mismatches like "you logged 8 doses but a 2-week-old start expects 4".
 */
export function validateBackdate(
  peptideId: string,
  peptideName: string,
  startDate: string,
  frequency: string,
  doses: DailyDoseEntry[],
  now: Date = new Date(),
): BackdateValidation {
  const cycleSlugs = new Set([slug(peptideId), slug(peptideName)].filter(Boolean));
  const matched = doses.filter(d => cycleSlugs.has(slug(d.peptide_id)) || cycleSlugs.has(slug(d.peptide_name)));
  const logsBeforeStart = matched.filter(d => d.date < startDate).length;
  const logsAfterStart = matched.filter(d => d.date >= startDate).length;

  const perWeek = parseFrequencyPerWeek(frequency);
  const start = new Date(startDate);
  const calendarDays = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
  const expectedByNow = Math.max(1, Math.round(((calendarDays + 1) / 7) * perWeek));

  if (logsBeforeStart > 0) {
    return {
      ok: false,
      severity: 'warning',
      message: `${logsBeforeStart} previously logged dose${logsBeforeStart === 1 ? '' : 's'} fall before this start date and won't count toward the cycle. Pick an earlier start to include them.`,
      logsBeforeStart, logsAfterStart, expectedByNow,
    };
  }
  if (logsAfterStart > expectedByNow * 1.5 && logsAfterStart >= 3) {
    return {
      ok: false,
      severity: 'warning',
      message: `You've logged ${logsAfterStart} doses since ${startDate}, but a cycle starting then would only expect ~${expectedByNow}. Your real start may be earlier.`,
      logsBeforeStart, logsAfterStart, expectedByNow,
    };
  }
  if (logsAfterStart === 0 && start < now && calendarDays > 7) {
    return {
      ok: true,
      severity: 'info',
      message: `No doses logged in the past ${calendarDays} days. The week counter will advance but progress stays at 0% until you log a dose.`,
      logsBeforeStart, logsAfterStart, expectedByNow,
    };
  }
  return {
    ok: true,
    severity: 'info',
    message: `${logsAfterStart} dose${logsAfterStart === 1 ? '' : 's'} logged since ${startDate}.`,
    logsBeforeStart, logsAfterStart, expectedByNow,
  };
}

/**
 * Recalculate cycle metadata from logged doses:
 *  - startDate = earliest logged dose (if earlier than current start)
 *  - plannedDuration unchanged
 *  - status = 'active' if currently 'break' but recent doses logged
 * Returns the updated cycle (or the original if nothing to change).
 */
export function recalculateCycle(
  cycle: Cycle,
  doses: DailyDoseEntry[],
  now: Date = new Date(),
): { cycle: Cycle; changed: boolean; summary: string } {
  const cycleSlugs = new Set([slug(cycle.peptideId), slug(cycle.peptideName)].filter(Boolean));
  const matched = doses
    .filter(d => cycleSlugs.has(slug(d.peptide_id)) || cycleSlugs.has(slug(d.peptide_name)))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (matched.length === 0) {
    return { cycle, changed: false, summary: 'No logged doses found — nothing to reconcile.' };
  }

  const earliest = matched[0].date;
  const latest = matched[matched.length - 1].date;
  const todayIso = now.toISOString().split('T')[0];
  const daysSinceLast = Math.floor((new Date(todayIso).getTime() - new Date(latest).getTime()) / 86400000);

  let next: Cycle = { ...cycle };
  const changes: string[] = [];

  if (earliest < cycle.startDate) {
    next.startDate = earliest;
    changes.push(`start date moved to ${earliest}`);
  }

  // Auto-resume if paused but doses are recent
  if (cycle.status === 'break' && daysSinceLast <= 3) {
    next.status = 'active';
    next.resumedAt = todayIso;
    next.pauseReason = undefined;
    changes.push('cycle resumed (recent doses detected)');
  }

  // Auto-pause if active but no doses in 14+ days
  if (cycle.status === 'active' && daysSinceLast >= 14) {
    next.status = 'break';
    next.pausedAt = todayIso;
    next.pauseReason = 'missed_doses';
    next.missedDays = daysSinceLast;
    changes.push(`paused (${daysSinceLast} days since last dose)`);
  }

  const changed = changes.length > 0;
  return {
    cycle: next,
    changed,
    summary: changed
      ? `Reconciled: ${changes.join(', ')}.`
      : `Already in sync (${matched.length} dose${matched.length === 1 ? '' : 's'} logged, last on ${latest}).`,
  };
}

