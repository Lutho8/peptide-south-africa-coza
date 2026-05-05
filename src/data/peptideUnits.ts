// Preferred dosing unit per peptide id. Used for unit-mismatch validation
// in the daily-log dose edit modal.
export const PEPTIDE_PREFERRED_UNIT: Record<string, 'mg' | 'IU' | 'units'> = {
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

export function getPreferredUnit(
  peptideId: string | undefined
): 'mg' | 'IU' | 'units' | undefined {
  if (!peptideId) return undefined;
  return PEPTIDE_PREFERRED_UNIT[peptideId];
}
