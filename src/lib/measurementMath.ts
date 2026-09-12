export type MeasurementSyringeType = 'U-40' | 'U-100';
export type MeasurementAmountUnit = 'mg' | 'mcg';

export interface MeasurementInput {
  vialAmountMg: number;
  diluentMl: number;
  enteredAmount: number;
  enteredUnit: MeasurementAmountUnit;
  syringeType: MeasurementSyringeType;
  barrelCapacityMl: number;
}

export interface MeasurementResult {
  targetAmountMg: number;
  concentrationMgPerMl: number;
  volumeMl: number;
  syringeUnits: number;
  syringeUnitsPerMl: 40 | 100;
  maximumBarrelUnits: number;
  fitsSelectedBarrel: boolean;
}

export function calculateMeasurement(input: MeasurementInput): MeasurementResult | null {
  if (!['mg', 'mcg'].includes(input.enteredUnit) || !['U-40', 'U-100'].includes(input.syringeType)) return null;
  const values = [input.vialAmountMg, input.diluentMl, input.enteredAmount, input.barrelCapacityMl];
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) return null;

  const targetAmountMg = input.enteredUnit === 'mcg'
    ? input.enteredAmount / 1000
    : input.enteredAmount;
  if (targetAmountMg > input.vialAmountMg) return null;

  const concentrationMgPerMl = input.vialAmountMg / input.diluentMl;
  const volumeMl = targetAmountMg / concentrationMgPerMl;
  const syringeUnitsPerMl = input.syringeType === 'U-40' ? 40 : 100;
  const syringeUnits = volumeMl * syringeUnitsPerMl;
  const maximumBarrelUnits = input.barrelCapacityMl * syringeUnitsPerMl;
  if ([targetAmountMg, concentrationMgPerMl, volumeMl, syringeUnits, maximumBarrelUnits].some(value => !Number.isFinite(value) || value <= 0)) return null;

  return {
    targetAmountMg,
    concentrationMgPerMl,
    volumeMl,
    syringeUnits,
    syringeUnitsPerMl,
    maximumBarrelUnits,
    fitsSelectedBarrel: volumeMl <= input.barrelCapacityMl,
  };
}

/** Never display a positive amount as zero, even for very small measurements. */
export function formatMeasurementNumber(value: number, decimals = 4): string {
  const rounded = Number(value.toFixed(decimals));
  return value > 0 && rounded === 0 ? value.toExponential(3) : String(rounded);
}

export function isMeasurableMark(units: number, increment: number): boolean {
  if (![units, increment].every(value => Number.isFinite(value) && value > 0)) return false;
  const ticks = units / increment;
  return Math.abs(ticks - Math.round(ticks)) < 1e-8;
}

export function amountAtMark(vialAmountMg: number, diluentMl: number, units: number, syringeType: MeasurementSyringeType) {
  if (![vialAmountMg, diluentMl, units].every(value => Number.isFinite(value) && value > 0)) return null;
  if (!['U-40', 'U-100'].includes(syringeType)) return null;
  const volumeMl = units / (syringeType === 'U-40' ? 40 : 100);
  const amountMg = volumeMl * vialAmountMg / diluentMl;
  if (!Number.isFinite(amountMg) || amountMg <= 0 || volumeMl > diluentMl) return null;
  return { volumeMl, amountMg, amountMcg: amountMg * 1000 };
}
