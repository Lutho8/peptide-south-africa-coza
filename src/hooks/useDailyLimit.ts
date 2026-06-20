// Daily-limit hook for teaser mode. Tracks how many times a gated action
// (e.g. calculator) has been used today and resets at local midnight.
// Persisted in localStorage so it survives reloads within the same day.
import { useCallback, useEffect, useState } from 'react';

const KEY_PREFIX = 'rtt_daily_limit_';

function todayKey(action: string) {
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `${KEY_PREFIX}${action}_${date}`;
}

function readCount(action: string): number {
  try {
    const raw = localStorage.getItem(todayKey(action));
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export interface UseDailyLimitResult {
  count: number;
  remaining: number;
  limitReached: boolean;
  /** Try to consume one use. Returns true if allowed, false if limit hit. */
  consume: () => boolean;
  reset: () => void;
}

export function useDailyLimit(action: string, max = 1): UseDailyLimitResult {
  const [count, setCount] = useState<number>(() => readCount(action));

  // Refresh when the date rolls over while the tab is open.
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = readCount(action);
      setCount((prev) => (prev !== fresh ? fresh : prev));
    }, 60_000);
    return () => clearInterval(interval);
  }, [action]);

  const consume = useCallback((): boolean => {
    const current = readCount(action);
    if (current >= max) {
      setCount(current);
      return false;
    }
    const next = current + 1;
    try { localStorage.setItem(todayKey(action), String(next)); } catch { /* noop */ }
    setCount(next);
    return true;
  }, [action, max]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(todayKey(action)); } catch { /* noop */ }
    setCount(0);
  }, [action]);

  return {
    count,
    remaining: Math.max(0, max - count),
    limitReached: count >= max,
    consume,
    reset,
  };
}
