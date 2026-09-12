import { describe, expect, it } from 'vitest';
import { amountAtMark, calculateMeasurement, formatMeasurementNumber, isMeasurableMark } from '@/lib/measurementMath';
import { blankCheckin, checkinMetricsSchema, csvCell } from '@/lib/dailyCheckin';

describe('concentration and syringe regression checks', () => {
  it.each([[0.25, 0.025, 1, 2.5], [0.5, 0.05, 2, 5], [1, 0.1, 4, 10], [1.5, 0.15, 6, 15], [2, 0.2, 8, 20]])('checks %s mg against both scales for 10 mg in 1 mL', (mg, ml, u40, u100) => {
    for (const [scale, units] of [['U-40', u40], ['U-100', u100]] as const) {
      const r = calculateMeasurement({ vialAmountMg: 10, diluentMl: 1, enteredAmount: mg * 1000, enteredUnit: 'mcg', syringeType: scale, barrelCapacityMl: 1 });
      expect(r?.volumeMl).toBeCloseTo(ml); expect(r?.syringeUnits).toBeCloseTo(units);
      expect(amountAtMark(10, 1, units, scale)?.amountMg).toBeCloseTo(mg);
    }
  });
  it('checks the second supplied concentration without transferring U-100 units to U-40', () => {
    expect(amountAtMark(10, 2, 40, 'U-100')).toEqual({ volumeMl: 0.4, amountMg: 2, amountMcg: 2000 });
    expect(amountAtMark(10, 2, 16, 'U-40')).toEqual({ volumeMl: 0.4, amountMg: 2, amountMcg: 2000 });
    expect(amountAtMark(10, 2, 40, 'U-40')?.amountMg).toBe(5);
  });
  it('never rounds a tiny positive volume to zero and checks the physical increment', () => {
    expect(Number(formatMeasurementNumber(0.000001))).toBeGreaterThan(0);
    expect(isMeasurableMark(2.5, 1)).toBe(false); expect(isMeasurableMark(2.5, 0.5)).toBe(true);
    expect(isMeasurableMark(0.3, 0.1)).toBe(true); expect(isMeasurableMark(2, 0)).toBe(false);
    expect(amountAtMark(10, 1, 101, 'U-100')).toBeNull();
  });
  it('rejects overflow instead of displaying a nonfinite calculated amount', () => {
    expect(calculateMeasurement({ vialAmountMg: 1e308, diluentMl: 1e-308, enteredAmount: 1, enteredUnit: 'mg', syringeType: 'U-100', barrelCapacityMl: 1 })).toBeNull();
  });
});

describe('private check-in data', () => {
  it('distinguishes an unrecorded metric from a measured zero', () => {
    expect(blankCheckin().painScore).toBeNull();
    expect(checkinMetricsSchema.parse({ ...blankCheckin(), sleepHours: 0, painScore: 0 }).painScore).toBe(0);
    expect(checkinMetricsSchema.safeParse({ ...blankCheckin(), weightKg: 0 }).success).toBe(false);
    expect(checkinMetricsSchema.safeParse({ ...blankCheckin(), sleepHours: 25 }).success).toBe(false);
    expect(checkinMetricsSchema.safeParse({ ...blankCheckin(), painScore: 1.5 }).success).toBe(false);
  });
  it('requires custom metric units and exports spreadsheet text safely', () => {
    expect(checkinMetricsSchema.safeParse({ ...blankCheckin(), custom: [{ name: 'TSH', value: 2, unit: '' }] }).success).toBe(false);
    expect(csvCell('=1+1')).toBe('"\'=1+1"'); expect(csvCell('a,"b"')).toBe('"a,""b"""');
  });
});
