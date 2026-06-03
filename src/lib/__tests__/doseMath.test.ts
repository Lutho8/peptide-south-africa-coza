import { describe, it, expect } from 'vitest';
import { parseDose, resolveConcentration, convertDose, unitsPerMl } from '@/lib/doseMath';

describe('parseDose', () => {
  it('parses mL', () => expect(parseDose('0.5 mL')).toEqual({ value: 0.5, unit: 'ml' }));
  it('parses ml without space', () => expect(parseDose('0.25ml')).toEqual({ value: 0.25, unit: 'ml' }));
  it('parses mg', () => expect(parseDose('2 mg')).toEqual({ value: 2, unit: 'mg' }));
  it('parses IU', () => expect(parseDose('5 IU')).toEqual({ value: 5, unit: 'iu' }));
  it('parses units', () => expect(parseDose('10 units')).toEqual({ value: 10, unit: 'units' }));
  it('parses u as units', () => expect(parseDose('15 u')).toEqual({ value: 15, unit: 'units' }));
  it('returns null for garbage', () => expect(parseDose('abc')).toBeNull());
  it('returns null for empty', () => expect(parseDose('')).toBeNull());
  it('returns null for negative', () => expect(parseDose('-1 mg')).toBeNull());
  it('returns null for zero', () => expect(parseDose('0 mg')).toBeNull());
});

describe('unitsPerMl', () => {
  it('U-40 = 40', () => expect(unitsPerMl('U-40')).toBe(40));
  it('U-100 = 100', () => expect(unitsPerMl('U-100')).toBe(100));
});

describe('convertDose', () => {
  // KLOW concentration: 80 mg / 3 mL = 26.667 mg/mL
  const klow = 80 / 3;

  it('mL -> mg with KLOW concentration', () => {
    const r = convertDose({ value: 0.5, unit: 'ml' }, klow, 'U-40')!;
    expect(r.mg).toBeCloseTo(13.333, 2);
    expect(r.mL).toBe(0.5);
    expect(r.units).toBeCloseTo(20, 5);
  });

  it('mg -> mL with KLOW concentration', () => {
    const r = convertDose({ value: 5, unit: 'mg' }, klow, 'U-40')!;
    expect(r.mL).toBeCloseTo(0.1875, 4);
    expect(r.mg).toBe(5);
  });

  it('U-40 vs U-100 unit math', () => {
    const u40 = convertDose({ value: 0.5, unit: 'ml' }, klow, 'U-40')!;
    const u100 = convertDose({ value: 0.5, unit: 'ml' }, klow, 'U-100')!;
    expect(u40.units).toBeCloseTo(20, 5);
    expect(u100.units).toBeCloseTo(50, 5);
  });

  it('returns null for IU dose', () =>
    expect(convertDose({ value: 5, unit: 'iu' }, 5)).toBeNull());

  it('returns null for units dose', () =>
    expect(convertDose({ value: 10, unit: 'units' }, 5)).toBeNull());

  it('returns null when concentration is 0', () =>
    expect(convertDose({ value: 1, unit: 'mg' }, 0)).toBeNull());

  it('fallback concentration produces 5 mg/mL', () => {
    const conc = resolveConcentration('definitely-not-a-real-peptide-xyz');
    expect(conc.mgPerMl).toBe(5);
    const r = convertDose({ value: 1, unit: 'ml' }, conc.mgPerMl, 'U-40')!;
    expect(r.mg).toBe(5);
    expect(r.units).toBe(40);
  });

  it('vial overrides change concentration', () => {
    const conc = resolveConcentration('not-real', 10, 2);
    expect(conc.mgPerMl).toBe(5);
    const conc2 = resolveConcentration('not-real', 20, 2);
    expect(conc2.mgPerMl).toBe(10);
  });
});
