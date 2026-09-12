import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DailyCheckinPanel } from '../DailyCheckinPanel';
const state = vi.hoisted(() => ({ payload: null as Record<string, unknown> | null, fail: false, success: vi.fn(), error: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: 'owner-test' } }) }));
vi.mock('sonner', () => ({ toast: { success: state.success, error: state.error } }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: () => {
  const builder = { select: () => builder, eq: () => builder, gte: () => builder, lte: () => builder, order: () => Promise.resolve({ data: [], error: null }),
    upsert: (payload: Record<string, unknown>) => { state.payload = payload; return { select: () => ({ single: async () => state.fail ? { data: null, error: new Error('offline') } : { data: { ...payload, id: 'checkin-test' }, error: null } }) }; } };
  return builder;
} } }));
describe('daily check-in flow', () => {
  beforeEach(() => { state.payload = null; state.fail = false; vi.clearAllMocks(); });
  it('saves actual observations with date, time and account, preserving unrecorded fields', async () => {
    render(<MemoryRouter><DailyCheckinPanel date="2026-09-12" doses={[]} /></MemoryRouter>);
    await screen.findByText('Save daily check-in');
    fireEvent.change(screen.getByLabelText('Sleep (hours)'), { target: { value: '7.5' } });
    fireEvent.change(screen.getByLabelText('Pain (0–10)'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Side effects or symptoms'), { target: { value: 'None noticed at 08:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save daily check-in' }));
    await screen.findByText('Saved to your account');
    expect(state.payload).toMatchObject({ user_id: 'owner-test', date: '2026-09-12', metrics: { sleepHours: 7.5, painScore: 0, weightKg: null, energyScore: null, sideEffects: 'None noticed at 08:00' } });
  });
  it('retains input and reports a failed save without claiming cloud success', async () => {
    state.fail = true; render(<MemoryRouter><DailyCheckinPanel date="2026-09-12" doses={[]} /></MemoryRouter>);
    await screen.findByText('Save daily check-in');
    fireEvent.change(screen.getByLabelText('Sleep (hours)'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save daily check-in' }));
    await waitFor(() => expect(state.error).toHaveBeenCalled());
    expect(state.success).not.toHaveBeenCalled(); expect(screen.getByLabelText('Sleep (hours)')).toHaveValue(8);
  });
});
