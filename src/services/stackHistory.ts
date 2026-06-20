import type { ActiveStackItem } from '@/services/storage';

export type StackChangeReason = 'add' | 'remove' | 'update' | 'clear' | 'edit' | 'hydrate';

export interface StackChangeEntry {
  id: string;
  ts: number;
  reason: StackChangeReason;
  prev: ActiveStackItem[];
  next: ActiveStackItem[];
}

const KEY = 'rtd:stack-history:v1';
const MAX = 10;

function read(): StackChangeEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StackChangeEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: StackChangeEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX)));
  } catch { /* noop */ }
}

export function recordStackChange(prev: ActiveStackItem[], next: ActiveStackItem[], reason: StackChangeReason) {
  // Skip noop
  if (JSON.stringify(prev) === JSON.stringify(next)) return;
  const entries = read();
  entries.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    reason,
    prev,
    next,
  });
  write(entries);
}

export function getLastChange(): StackChangeEntry | null {
  const entries = read();
  return entries.length ? entries[entries.length - 1] : null;
}

export function popLastChange(): StackChangeEntry | null {
  const entries = read();
  const last = entries.pop() ?? null;
  write(entries);
  return last;
}

export function canUndo(): boolean {
  return read().length > 0;
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
