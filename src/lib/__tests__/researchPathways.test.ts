import { describe, expect, it } from 'vitest';
import { buildResearchPathways } from '@/lib/bloodwork/researchPathways';
import type { ResultBiomarker } from '@/components/bloodwork/BloodworkResults';

const marker = (overrides: Partial<ResultBiomarker>): ResultBiomarker => ({
  name: 'Glucose',
  value: 6.2,
  unit: 'mmol/L',
  reference_range: '3.5 - 5.5',
  status: 'high',
  category: 'metabolic',
  ...overrides,
});

describe('buildResearchPathways', () => {
  it('gives a non-prescriptive metabolic discussion path', () => {
    const result = buildResearchPathways([marker({})], ['Weight Loss']);
    expect(result[0].title).toBe('Metabolic-treatment discussion');
    expect(result[0].body).toContain('do not establish');
    expect(result[0].body).not.toMatch(/start|take \d|inject/i);
  });

  it('suppresses peptide paths when a critical result needs review', () => {
    const result = buildResearchPathways([marker({ status: 'critical' })], ['Weight Loss']);
    expect(result).toHaveLength(1);
    expect(result[0].level).toBe('caution');
  });

  it('does not infer a protocol from normal results', () => {
    const result = buildResearchPathways([marker({ status: 'normal' })], ['Recovery']);
    expect(result[0].title).toContain('No peptide protocol');
  });
});
