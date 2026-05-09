// Pure helpers for dose unit parsing and mg ↔ mL ↔ syringe-units conversion.
// Kept free of React so unit tests can cover the math without rendering.
import { findBlendData } from '@/data/blendAdapters';

export type SyringeType = 'U-40' | 'U-100';
export type ParsedDoseUnit = 'ml' | 'mg' | 'iu' | 'units';

export interface ParsedDose {
  value: number;
  unit: ParsedDoseUnit;
}

export interface Concentration {
  mgPerMl: number;
  source: string;
}

const FALLBACK: Concentration = {
  mgPerMl: 5,
  source: 'Assumes standard 10 mg vial + 2 mL BAC water = 5 mg/mL',
};

export function unitsPerMl(syringe: SyringeType): 40 | 100 {
  return syringe === 'U-40' ? 40 : 100;
}

export function parseDose(s: string | undefined | null): ParsedDose | null {
  if (!s) return null;
  const m = s.match(/([\d.]+)\s*(ml|mg|iu|units?|u)\b/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!isFinite(value) || value <= 0) return null;
  const raw = m[2].toLowerCase();
  let unit: ParsedDoseUnit;
  if (raw === 'ml') unit = 'ml';
  else if (raw === 'mg') unit = 'mg';
  else if (raw === 'iu') unit = 'iu';
  else unit = 'units';
  return { value, unit };
}

export function resolveConcentration(
  peptideId: string,
  vialMgOverride?: number,
  bacWaterMlOverride?: number
): Concentration {
  const blend = findBlendData(peptideId);
  if (blend) {
    const mg = vialMgOverride ?? parseFloat(blend.vialSize.match(/([\d.]+)\s*mg/i)?.[1] ?? '');
    const ml = bacWaterMlOverride ?? parseFloat(blend.quickstart.reconstitute.match(/([\d.]+)\s*mL/i)?.[1] ?? '');
    if (mg > 0 && ml > 0) {
      return {
        mgPerMl: mg / ml,
        source: `${mg} mg vial + ${ml} mL BAC water = ${(mg / ml).toFixed(2)} mg/mL`,
      };
    }
  }
  if (vialMgOverride && bacWaterMlOverride && bacWaterMlOverride > 0) {
    return {
      mgPerMl: vialMgOverride / bacWaterMlOverride,
      source: `${vialMgOverride} mg vial + ${bacWaterMlOverride} mL BAC water = ${(vialMgOverride / bacWaterMlOverride).toFixed(2)} mg/mL`,
    };
  }
  return FALLBACK;
}

export interface ConvertedDose {
  mg: number;
  mL: number;
  units: number;
}

/** Convert a parsed dose into mg, mL, and syringe units. Returns null for IU/units. */
export function convertDose(
  parsed: ParsedDose,
  mgPerMl: number,
  syringe: SyringeType = 'U-40'
): ConvertedDose | null {
  if (parsed.unit === 'iu' || parsed.unit === 'units') return null;
  if (mgPerMl <= 0) return null;
  let mL: number;
  let mg: number;
  if (parsed.unit === 'ml') {
    mL = parsed.value;
    mg = mL * mgPerMl;
  } else {
    mg = parsed.value;
    mL = mg / mgPerMl;
  }
  return { mg, mL, units: mL * unitsPerMl(syringe) };
}

