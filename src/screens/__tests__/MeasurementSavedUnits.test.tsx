import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MeasurementToolScreen } from '@/screens/MeasurementToolScreen';
const state = vi.hoisted(() => ({ unit: 'mcg' as 'mg' | 'mcg' | undefined }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: null }) }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn() } }));
vi.mock('@/services/storage', () => ({
  getCalculatorSettings: () => ({ syringeType: 'u100', experienceLevel: 'intermediate', lastVialSize: '10', lastBacWater: '1', lastTargetDose: '500', lastTargetUnit: state.unit, lastSelectedPeptide: '', savedAt: '2026-09-12' }),
  getActiveStack: () => [], getDosagePresets: () => [], saveCalculatorSettings: vi.fn(), saveDosagePreset: vi.fn(), deleteDosagePreset: vi.fn(),
}));
describe('saved calculator units', () => {
  it('restores 500 mcg as 0.5 mg, not 500 mg', () => {
    state.unit = 'mcg'; render(<MeasurementToolScreen calculatorOnly />);
    expect(screen.getByLabelText('Amount unit')).toHaveTextContent('mcg');
    expect(screen.getByLabelText('Prescribed or recorded dose')).toHaveValue(500);
    fireEvent.click(screen.getByLabelText('Barrel capacity'));
    fireEvent.click(screen.getByRole('option', { name: '1 mL', exact: true }));
    expect(screen.getAllByText('5 units').length).toBeGreaterThan(0);
    expect(screen.getByText('0.5 mg / 500 mcg')).toBeInTheDocument();
  });
  it('asks for the amount again when a legacy saved value has no unit', () => {
    state.unit = undefined; render(<MeasurementToolScreen calculatorOnly />);
    expect(screen.getByLabelText('Prescribed or recorded dose')).toHaveValue(null);
  });
});
