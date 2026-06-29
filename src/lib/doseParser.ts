// Parse peptide dosing strings into a structured plan.
// Examples handled:
//   "5mg daily for 10 days"            → 1×/day, 7 days/week, split=1
//   "0.8mg 2x/week"                    → 2 administrations/week, split=1
//   "10mg daily"                       → 1×/day, 7 days/week
//   "300mcg daily intranasal"          → 1×/day, 7 days/week (mcg→mg)
//   "500 mcg AM + 500 mcg PM daily"    → split=2 (AM+PM both complete one daily dose)
//   "2.5 mg x twice a week"            → daysPerWeek=2, split=2 (2 sub-doses complete 1 weekly dose)
//   "10mg every other day"             → EOD, daysPerWeek=3.5
//
// `splitParts > 1` means N sub-doses logged on the same dosing day count as
// ONE complete dose for cycle progress.

export interface DosingPlan {
  /** Per-administration amount the user injects */
  perAdministration: { amount: number; unit: 'mg' | 'IU' | 'units' };
  /** Total complete-dose target per week */
  dosesPerWeek: number;
  /** Number of sub-doses that together make one complete dose (1, 2, 3...) */
  splitParts: number;
  /** Sum of all sub-doses that make a single complete dose */
  completePerDose: { amount: number; unit: 'mg' | 'IU' | 'units' };
  /** Plain-English summary, e.g. "5 mg split 2×2.5 mg, 1×/week" */
  summary: string;
  /** Original input for debugging */
  raw: string;
}

const UNIT_REGEX = /(mcg|mg|iu|units?)/i;

function normaliseUnit(u: string): 'mg' | 'IU' | 'units' {
  const x = u.toLowerCase();
  if (x === 'mcg' || x === 'mg') return 'mg';
  if (x === 'iu') return 'IU';
  return 'units';
}

function amountInMg(amount: number, rawUnit: string): { amount: number; unit: 'mg' | 'IU' | 'units' } {
  const u = rawUnit.toLowerCase();
  if (u === 'mcg') return { amount: amount / 1000, unit: 'mg' };
  return { amount, unit: normaliseUnit(rawUnit) };
}

export function parseDosing(input: string | undefined | null): DosingPlan | null {
  if (!input) return null;
  const raw = input.trim();
  const lower = raw.toLowerCase();

  // Collect every "<number> <unit>" pair the string contains.
  const pairs: { amount: number; unit: string }[] = [];
  const pairRegex = /(\d+(?:\.\d+)?)\s*(mcg|mg|IU|units?)/gi;
  let m: RegExpExecArray | null;
  while ((m = pairRegex.exec(raw)) !== null) {
    pairs.push({ amount: parseFloat(m[1]), unit: m[2] });
  }
  if (pairs.length === 0) return null;

  // Per-administration amount = first amount/unit (e.g. "2.5 mg" in "2.5 mg x twice a week")
  const per = amountInMg(pairs[0].amount, pairs[0].unit);

  // ── Determine cadence ────────────────────────────────────────────────
  let dosesPerWeek = 7;       // default: daily
  let splitParts = 1;
  let administrationsPerWeek = 7;

  // AM + PM (or morning + evening) on same day → split=2
  const amPm = /am\s*\+\s*pm|morning\s*\+\s*evening|split\s*(am|pm)/i.test(lower);

  // "N×/week" or "N times a week" or "Nx weekly"
  const xWeek = lower.match(/(\d+)\s*(?:x|times?)\s*(?:per|a|\/)?\s*week/);
  // "twice a week" / "thrice a week"
  const twiceWeek = /twice\s*(?:a|per|\/)?\s*week/.test(lower);
  const thriceWeek = /(?:thrice|three\s*times)\s*(?:a|per|\/)?\s*week/.test(lower);
  // EOD / every other day
  const eod = /eod|every\s*other\s*day|alternate\s*day/.test(lower);
  // Weekly / once a week
  const weekly = /(once\s*(a|per)\s*week|weekly|per\s*week)/.test(lower);
  // "N×/day" / "twice daily"
  const xDay = lower.match(/(\d+)\s*(?:x|times?)\s*(?:per|a|\/)?\s*day/);
  const twiceDay = /twice\s*daily|2x\s*daily/.test(lower);
  const thriceDay = /thrice\s*daily|3x\s*daily/.test(lower);

  // "x split" / "split-dose"
  const splitMarker = /\bsplit\b/.test(lower);

  if (xWeek) {
    administrationsPerWeek = Math.max(1, parseInt(xWeek[1], 10));
  } else if (twiceWeek) {
    administrationsPerWeek = 2;
  } else if (thriceWeek) {
    administrationsPerWeek = 3;
  } else if (eod) {
    administrationsPerWeek = 3.5;
  } else if (weekly) {
    administrationsPerWeek = 1;
  } else if (xDay) {
    administrationsPerWeek = 7 * parseInt(xDay[1], 10);
  } else if (twiceDay || amPm) {
    administrationsPerWeek = 14;
  } else if (thriceDay) {
    administrationsPerWeek = 21;
  } else {
    administrationsPerWeek = 7; // daily default
  }

  // Determine split parts.
  if (amPm || twiceDay || splitMarker) {
    splitParts = 2;
    dosesPerWeek = administrationsPerWeek / 2;
  } else if (thriceDay) {
    splitParts = 3;
    dosesPerWeek = administrationsPerWeek / 3;
  } else if (twiceWeek && pairs.length >= 1 && /split|x\s*twice/i.test(lower)) {
    splitParts = 2;
    dosesPerWeek = 1;
  } else {
    splitParts = 1;
    dosesPerWeek = administrationsPerWeek;
  }

  const completeAmount = per.amount * splitParts;
  const completePerDose = { amount: completeAmount, unit: per.unit };

  const cadenceLabel =
    dosesPerWeek === 1 ? '1×/week'
    : dosesPerWeek === 3.5 ? 'EOD'
    : dosesPerWeek === 7 ? 'daily'
    : dosesPerWeek > 7 ? `${dosesPerWeek / 7}×/day`
    : `${dosesPerWeek}×/week`;

  const summary = splitParts > 1
    ? `${completeAmount} ${per.unit} split ${splitParts}×${per.amount} ${per.unit}, ${cadenceLabel}`
    : `${per.amount} ${per.unit}, ${cadenceLabel}`;

  return {
    perAdministration: per,
    dosesPerWeek,
    splitParts,
    completePerDose,
    summary,
    raw,
  };
}

/** Map experience level → key on a peptide.dosing object. */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'athlete';

export function planForExperience(
  dosing: { beginner: string; intermediate: string; advanced: string; athlete: string } | undefined,
  level: ExperienceLevel,
): DosingPlan | null {
  if (!dosing) return null;
  return parseDosing(dosing[level]);
}
