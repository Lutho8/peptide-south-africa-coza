import { z } from 'zod';

export const checkinMetricsSchema = z.object({
  sleepHours: z.number().finite().min(0).max(24).nullable(),
  weightKg: z.number().finite().positive().max(700).nullable(),
  painScore: z.number().int().min(0).max(10).nullable(),
  energyScore: z.number().int().min(0).max(10).nullable(),
  sideEffects: z.string().max(2000),
  notes: z.string().max(3000),
  custom: z.array(z.object({ name: z.string().trim().min(1).max(80), value: z.number().finite(), unit: z.string().trim().min(1).max(40) })).max(20),
});
export type CheckinMetrics = z.infer<typeof checkinMetricsSchema>;
export interface DailyCheckin { id: string; user_id: string; date: string; observed_at: string; metrics: CheckinMetrics }
export function blankCheckin(): CheckinMetrics {
  return { sleepHours: null, weightKg: null, painScore: null, energyScore: null, sideEffects: '', notes: '', custom: [] };
}
export function csvCell(value: unknown): string {
  const text = String(value ?? '');
  const escaped = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
  return `"${escaped.replace(/"/g, '""')}"`;
}
