// Preferred dosing unit per peptide id, plus a converter used by the daily-log
// dose edit modal so users don't have to confirm a unit mismatch — we silently
// convert to the peptide's standard unit when possible.
export type DoseUnit = 'mg' | 'IU' | 'units';

export const PEPTIDE_PREFERRED_UNIT: Record<string, DoseUnit> = {
  retatrutide: 'mg',
  semaglutide: 'mg',
  tirzepatide: 'mg',
  'cjc-1295-no-dac': 'mg',
  'cjc-1295': 'mg',
  tesamorelin: 'mg',
  tesamorellin: 'mg',
  'bpc-157': 'mg',
  'tb-500': 'mg',
  ipamorelin: 'mg',
  'mots-c': 'mg',
  hgh: 'IU',
  hcg: 'IU',
  insulin: 'units',
};

export function getPreferredUnit(peptideId: string | undefined): DoseUnit | undefined {
  if (!peptideId) return undefined;
  return PEPTIDE_PREFERRED_UNIT[peptideId];
}

// Known mass↔activity conversions. Returns null when no safe conversion exists.
// HGH: 1 mg ≈ 3 IU is the standard rDNA somatropin assumption.
function knownConversionFactor(
  peptideId: string | undefined,
  from: DoseUnit,
  to: DoseUnit
): number | null {
  if (from === to) return 1;
  if (peptideId === 'hgh') {
    if (from === 'mg' && to === 'IU') return 3;
    if (from === 'IU' && to === 'mg') return 1 / 3;
  }
  return null;
}

export interface ConvertResult {
  value: number;
  unit: DoseUnit;
  /** True when value was numerically converted (not just a label swap). */
  converted: boolean;
}

export function convertDose(
  value: number,
  from: DoseUnit,
  to: DoseUnit,
  peptideId?: string
): ConvertResult {
  if (from === to) return { value, unit: to, converted: false };
  const factor = knownConversionFactor(peptideId, from, to);
  if (factor != null) {
    const converted = Math.round(value * factor * 1000) / 1000;
    return { value: converted, unit: to, converted: true };
  }
  // No safe numeric conversion — swap label only.
  return { value, unit: to, converted: false };
}
