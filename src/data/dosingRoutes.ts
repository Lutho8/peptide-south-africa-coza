// Route- and sex-aware dosing tables for peptides that can be administered
// via more than one route (e.g. intranasal AND subcutaneous). This is kept
// centralized so we don't have to edit the giant peptide catalog files.
//
// All values in mg / IU / units / mcg (for intranasal micro-doses where mcg
// is the clinical standard). UI renders mg equivalents alongside.
//
// Female values default to ~80% of male dose where sex-specific research is
// thin — flagged in `notes`. Research-only, not medical advice.

export type DoseRoute = 'intranasal' | 'subcutaneous';
export type ExperienceTier = 'beginner' | 'intermediate' | 'advanced' | 'athlete';
export type Sex = 'male' | 'female';

export interface DoseCell {
  male: string;
  female: string;
  notes?: string;
}

export interface DoseTable {
  beginner: DoseCell;
  intermediate: DoseCell;
  advanced: DoseCell;
  athlete: DoseCell;
  frequency: string;
  cycleDays: string;
  sourceNotes?: string;
}

export interface RouteDosing {
  intranasal?: DoseTable;
  subcutaneous?: DoseTable;
  /** Human label for the "why two routes" line rendered under the toggle. */
  routeGuidance?: string;
}

/**
 * Peptide id → per-route dosing.
 * Keys match `id` fields in src/data/peptides.ts and peptidesExpanded.ts.
 */
export const ROUTE_DOSING: Record<string, RouteDosing> = {
  selank: {
    routeGuidance:
      'Selank is bioactive intranasally and subcutaneously. Intranasal is the most-studied route (Russian clinical trials); SC delivers a higher systemic dose per mg.',
    intranasal: {
      beginner:     { male: '250 mcg / day', female: '200 mcg / day' },
      intermediate: { male: '500 mcg / day', female: '400 mcg / day' },
      advanced:     { male: '750 mcg / day', female: '600 mcg / day' },
      athlete:      { male: '500 mcg × 2 / day', female: '400 mcg × 2 / day', notes: 'Split AM / pre-training' },
      frequency: '1–2× daily, morning ± pre-stress',
      cycleDays: '14–30 on / 14 off',
      sourceNotes: 'Kozlovskaya et al. (2003); Medvedev et al. (2015). Female column extrapolated (~80%).',
    },
    subcutaneous: {
      beginner:     { male: '100 mcg / day', female: '80 mcg / day' },
      intermediate: { male: '200 mcg / day', female: '160 mcg / day' },
      advanced:     { male: '300 mcg / day', female: '250 mcg / day' },
      athlete:      { male: '200 mcg × 2 / day', female: '160 mcg × 2 / day', notes: 'Split AM / pre-training' },
      frequency: '1–2× daily',
      cycleDays: '14–30 on / 14 off',
      sourceNotes: 'SC bioavailability ~2.5× intranasal — total daily dose reduced accordingly.',
    },
  },

  semax: {
    routeGuidance:
      'Semax works both intranasally (primary clinical route) and subcutaneously. SC gives faster onset for acute nootropic use.',
    intranasal: {
      beginner:     { male: '300 mcg / day', female: '250 mcg / day' },
      intermediate: { male: '600 mcg / day', female: '500 mcg / day' },
      advanced:     { male: '900 mcg / day', female: '750 mcg / day' },
      athlete:      { male: '600 mcg × 2 / day', female: '500 mcg × 2 / day', notes: 'AM + pre-training' },
      frequency: '1–2× daily',
      cycleDays: '30–90 on / 14 off',
      sourceNotes: 'Ashmarin et al.; Gusev & Skvortsova (2011). Female column extrapolated.',
    },
    subcutaneous: {
      beginner:     { male: '100 mcg / day', female: '80 mcg / day' },
      intermediate: { male: '250 mcg / day', female: '200 mcg / day' },
      advanced:     { male: '400 mcg / day', female: '320 mcg / day' },
      athlete:      { male: '250 mcg × 2 / day', female: '200 mcg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '30–90 on / 14 off',
      sourceNotes: 'SC route less common; dose reduced ~3× vs intranasal.',
    },
  },

  'na-selank-amidate': {
    routeGuidance:
      'N-Acetyl Selank Amidate is stabilized — longer half-life allows lower / less frequent dosing on either route.',
    intranasal: {
      beginner:     { male: '150 mcg / day', female: '120 mcg / day' },
      intermediate: { male: '300 mcg / day', female: '250 mcg / day' },
      advanced:     { male: '500 mcg / day', female: '400 mcg / day' },
      athlete:      { male: '300 mcg × 2 / day', female: '250 mcg × 2 / day' },
      frequency: '1× daily (2× under load)',
      cycleDays: '21–30 on / 14 off',
      sourceNotes: 'Extended half-life vs Selank — approx. 0.6× dose parity.',
    },
    subcutaneous: {
      beginner:     { male: '60 mcg / day', female: '50 mcg / day' },
      intermediate: { male: '120 mcg / day', female: '100 mcg / day' },
      advanced:     { male: '200 mcg / day', female: '160 mcg / day' },
      athlete:      { male: '120 mcg × 2 / day', female: '100 mcg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '21–30 on / 14 off',
    },
  },

  'na-semax-amidate': {
    routeGuidance:
      'N-Acetyl Semax Amidate is stabilized — longer duration allows lower / less frequent dosing.',
    intranasal: {
      beginner:     { male: '150 mcg / day', female: '120 mcg / day' },
      intermediate: { male: '300 mcg / day', female: '250 mcg / day' },
      advanced:     { male: '500 mcg / day', female: '400 mcg / day' },
      athlete:      { male: '300 mcg × 2 / day', female: '250 mcg × 2 / day' },
      frequency: '1× daily',
      cycleDays: '30–90 on / 14 off',
    },
    subcutaneous: {
      beginner:     { male: '60 mcg / day', female: '50 mcg / day' },
      intermediate: { male: '120 mcg / day', female: '100 mcg / day' },
      advanced:     { male: '200 mcg / day', female: '160 mcg / day' },
      athlete:      { male: '120 mcg × 2 / day', female: '100 mcg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '30–90 on / 14 off',
    },
  },

  dsip: {
    routeGuidance:
      'DSIP is dosed subcutaneously (most common) or intranasally. SC is preferred for sleep protocols; intranasal for stress attenuation.',
    subcutaneous: {
      beginner:     { male: '100 mcg pre-sleep',  female: '80 mcg pre-sleep' },
      intermediate: { male: '200 mcg pre-sleep',  female: '160 mcg pre-sleep' },
      advanced:     { male: '300 mcg pre-sleep',  female: '250 mcg pre-sleep' },
      athlete:      { male: '200 mcg pre-sleep',  female: '160 mcg pre-sleep', notes: 'Recovery block only' },
      frequency: 'Nightly, 30–60 min before bed',
      cycleDays: '5 on / 2 off — up to 8 weeks',
    },
    intranasal: {
      beginner:     { male: '200 mcg / day', female: '160 mcg / day' },
      intermediate: { male: '400 mcg / day', female: '320 mcg / day' },
      advanced:     { male: '600 mcg / day', female: '480 mcg / day' },
      athlete:      { male: '400 mcg × 2 / day', female: '320 mcg × 2 / day' },
      frequency: 'Evening ± acute stress',
      cycleDays: '4 weeks on / 2 off',
    },
  },

  oxytocin: {
    routeGuidance:
      'Oxytocin is short-acting — intranasal is standard for behavioral / bonding effects; SC used for milk let-down and off-label protocols.',
    intranasal: {
      beginner:     { male: '10 IU / day', female: '8 IU / day' },
      intermediate: { male: '20 IU / day', female: '16 IU / day' },
      advanced:     { male: '40 IU / day', female: '32 IU / day' },
      athlete:      { male: '20 IU pre-event', female: '16 IU pre-event' },
      frequency: '1–2× daily as needed',
      cycleDays: 'Acute or 2–4 weeks continuous',
      sourceNotes: 'MacDonald & MacDonald (2010) intranasal social protocols.',
    },
    subcutaneous: {
      beginner:     { male: '2 IU / day', female: '2 IU / day' },
      intermediate: { male: '5 IU / day', female: '5 IU / day' },
      advanced:     { male: '10 IU / day', female: '10 IU / day' },
      athlete:      { male: '5 IU pre-event', female: '5 IU pre-event' },
      frequency: '1× daily',
      cycleDays: 'Short cycles (≤ 2 weeks)',
      sourceNotes: 'SC bioavailability ~4× intranasal — dose reduced accordingly.',
    },
  },

  pt141: {
    routeGuidance:
      'PT-141 (Bremelanotide) — SC is the FDA-approved route (Vyleesi). Intranasal is the older Palatin formulation, still used off-label.',
    subcutaneous: {
      beginner:     { male: '0.5 mg pre-activity', female: '0.5 mg pre-activity' },
      intermediate: { male: '1.0 mg pre-activity', female: '1.0 mg pre-activity' },
      advanced:     { male: '1.75 mg pre-activity', female: '1.75 mg pre-activity', notes: 'FDA cap for HSDD indication' },
      athlete:      { male: '1.0 mg pre-activity', female: '1.0 mg pre-activity' },
      frequency: '45 min before activity, max 1× / 24 h, ≤ 8× / month',
      cycleDays: 'PRN; assess after 8 weeks',
      sourceNotes: 'Vyleesi label; RECONNECT trial (Simon 2019).',
    },
    intranasal: {
      beginner:     { male: '5 mg pre-activity', female: '4 mg pre-activity' },
      intermediate: { male: '10 mg pre-activity', female: '7.5 mg pre-activity' },
      advanced:     { male: '15 mg pre-activity', female: '10 mg pre-activity' },
      athlete:      { male: '10 mg pre-activity', female: '7.5 mg pre-activity' },
      frequency: '30–60 min before activity, PRN',
      cycleDays: 'PRN',
      sourceNotes: 'Legacy Palatin intranasal formulation — ~10× SC due to low nasal bioavailability.',
    },
  },

  kisspeptin: {
    routeGuidance:
      'Kisspeptin-10 is dosed subcutaneously in research; intranasal is used experimentally for HPG-axis stimulation.',
    subcutaneous: {
      beginner:     { male: '50 mcg / day', female: '40 mcg / day' },
      intermediate: { male: '100 mcg / day', female: '80 mcg / day' },
      advanced:     { male: '200 mcg / day', female: '150 mcg / day' },
      athlete:      { male: '100 mcg × 2 / day', female: '80 mcg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '4 weeks on / 4 off',
      sourceNotes: 'Dhillo et al. (Imperial College) clinical studies.',
    },
    intranasal: {
      beginner:     { male: '200 mcg / day', female: '160 mcg / day' },
      intermediate: { male: '400 mcg / day', female: '320 mcg / day' },
      advanced:     { male: '600 mcg / day', female: '480 mcg / day' },
      athlete:      { male: '400 mcg × 2 / day', female: '320 mcg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '4 weeks on / 4 off',
      sourceNotes: 'Experimental; low intranasal bioavailability — dose ~4× SC.',
    },
  },

  vip: {
    routeGuidance:
      'VIP has short plasma half-life — intranasal preferred for CNS effects, SC for systemic anti-inflammatory protocols.',
    intranasal: {
      beginner:     { male: '25 mcg / spray, 1× day', female: '25 mcg / spray, 1× day' },
      intermediate: { male: '50 mcg × 4 / day', female: '50 mcg × 4 / day' },
      advanced:     { male: '50 mcg × 6 / day', female: '50 mcg × 6 / day' },
      athlete:      { male: '50 mcg × 4 / day', female: '50 mcg × 4 / day' },
      frequency: '4× daily titration (Shoemaker protocol)',
      cycleDays: 'Titrate over weeks; long-term maintenance',
      sourceNotes: 'Shoemaker CIRS intranasal titration protocol.',
    },
    subcutaneous: {
      beginner:     { male: '50 mcg / day', female: '50 mcg / day' },
      intermediate: { male: '100 mcg / day', female: '100 mcg / day' },
      advanced:     { male: '200 mcg / day', female: '200 mcg / day' },
      athlete:      { male: '100 mcg / day', female: '100 mcg / day' },
      frequency: '1× daily',
      cycleDays: '4–8 weeks',
    },
  },

  p21: {
    routeGuidance:
      'P21 (Cerebrolysin-derived) — intranasal for cognitive/neuroprotective use; SC for systemic BDNF elevation.',
    intranasal: {
      beginner:     { male: '1 mg / day',   female: '0.8 mg / day' },
      intermediate: { male: '2 mg / day',   female: '1.6 mg / day' },
      advanced:     { male: '3 mg / day',   female: '2.5 mg / day' },
      athlete:      { male: '2 mg × 2 / day', female: '1.6 mg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '30 on / 14 off',
    },
    subcutaneous: {
      beginner:     { male: '0.5 mg / day', female: '0.4 mg / day' },
      intermediate: { male: '1 mg / day',   female: '0.8 mg / day' },
      advanced:     { male: '1.5 mg / day', female: '1.2 mg / day' },
      athlete:      { male: '1 mg × 2 / day', female: '0.8 mg × 2 / day' },
      frequency: '1–2× daily',
      cycleDays: '30 on / 14 off',
    },
  },
};

export function getRouteDosing(peptideId: string): RouteDosing | undefined {
  return ROUTE_DOSING[peptideId];
}

export function getAvailableRoutes(peptideId: string): DoseRoute[] {
  const rd = ROUTE_DOSING[peptideId];
  if (!rd) return [];
  const out: DoseRoute[] = [];
  if (rd.intranasal) out.push('intranasal');
  if (rd.subcutaneous) out.push('subcutaneous');
  return out;
}

export function getDoseCell(
  peptideId: string,
  route: DoseRoute,
  tier: ExperienceTier,
  sex: Sex,
): DoseCell | undefined {
  const table = ROUTE_DOSING[peptideId]?.[route];
  if (!table) return undefined;
  return table[tier];
}
