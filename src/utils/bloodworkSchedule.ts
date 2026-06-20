// Build a weekly schedule from a completed lab report's ranked peptide suggestions.
import { peptides } from '@/data/peptides';
import { parseFrequencyToSchedule } from './frequencyParser';

export interface ScheduleEntry {
  peptideId: string;
  peptideName: string;
  dose: string;
  days: string[]; // empty = every day
  time: string; // HH:MM
  goals: string[]; // biomarker goal labels (e.g. "Low IGF-1")
  rank: number; // best rank seen across biomarkers (1 = top)
}

interface SuggestedPeptide {
  id: string;
  name: string;
  rank: number;
  reason: string;
}

interface ExtractedBiomarker {
  name: string;
  short_name: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  suggested_peptides?: SuggestedPeptide[];
}

interface LabReportLike {
  extracted_biomarkers: ExtractedBiomarker[];
}

/**
 * Aggregate top-ranked suggested peptides (rank ≤ 2) from out-of-range biomarkers
 * and produce a weekly schedule with timing & dosing.
 */
export function buildWeeklyScheduleFromReport(report: LabReportLike): ScheduleEntry[] {
  const map = new Map<string, ScheduleEntry>();

  for (const bm of report.extracted_biomarkers || []) {
    if (!['high', 'low', 'critical'].includes(bm.status)) continue;
    const suggestions = bm.suggested_peptides || [];

    for (const s of suggestions) {
      if (s.rank > 2) continue;

      const peptideMeta = peptides.find(p => p.id === s.id);
      const dose = peptideMeta?.dosing?.beginner || '—';
      const frequency = peptideMeta?.frequency || 'Daily';
      const { days, suggestedTime } = parseFrequencyToSchedule(frequency);

      const goalLabel = `${capitalize(bm.status)} ${bm.short_name || bm.name}`;
      const existing = map.get(s.id);

      if (existing) {
        if (!existing.goals.includes(goalLabel)) existing.goals.push(goalLabel);
        existing.rank = Math.min(existing.rank, s.rank);
      } else {
        map.set(s.id, {
          peptideId: s.id,
          peptideName: peptideMeta?.name || s.name,
          dose,
          days,
          time: suggestedTime,
          goals: [goalLabel],
          rank: s.rank,
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.rank - b.rank);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function expandDays(days: string[]): string[] {
  return days.length === 0 ? ALL_DAYS : days;
}

export function formatFrequencyFromDays(days: string[]): string {
  if (days.length === 0 || days.length === 7) return 'Daily';
  return `${days.length}x weekly`;
}
