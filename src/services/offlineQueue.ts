import { openDB, type IDBPDatabase } from 'idb';
import { supabase } from '@/integrations/supabase/client';

export type OutboxOp = 'insert' | 'update' | 'delete';
export type OutboxTable = 'daily_doses' | 'lab_reports';

export interface OutboxItem {
  id: string;
  table: OutboxTable;
  op: OutboxOp;
  payload: Record<string, unknown>;
  matchId?: string; // for update/delete
  createdAt: number;
  attempts: number;
}

const DB_NAME = 'psa-offline';
const STORE = 'outbox';
let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

type Listener = (count: number) => void;
const listeners = new Set<Listener>();

async function notify() {
  const count = await pendingCount();
  listeners.forEach((l) => l(count));
}

export function subscribe(cb: Listener): () => void {
  listeners.add(cb);
  pendingCount().then(cb).catch(() => {});
  return () => listeners.delete(cb);
}

export async function pendingCount(): Promise<number> {
  try {
    const db = await getDB();
    return await db.count(STORE);
  } catch {
    return 0;
  }
}

export async function enqueue(
  table: OutboxTable,
  op: OutboxOp,
  payload: Record<string, unknown>,
  matchId?: string
): Promise<void> {
  const db = await getDB();
  const item: OutboxItem = {
    id: crypto.randomUUID(),
    table,
    op,
    payload,
    matchId,
    createdAt: Date.now(),
    attempts: 0,
  };
  await db.put(STORE, item);
  void notify();
}

async function processItem(item: OutboxItem): Promise<boolean> {
  try {
    if (item.op === 'insert') {
      const { error } = await supabase.from(item.table).insert(item.payload as never);
      if (error) throw error;
    } else if (item.op === 'update' && item.matchId) {
      const { error } = await supabase
        .from(item.table)
        .update(item.payload as never)
        .eq('id', item.matchId);
      if (error) throw error;
    } else if (item.op === 'delete' && item.matchId) {
      const { error } = await supabase.from(item.table).delete().eq('id', item.matchId);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.warn('[offlineQueue] item failed', item, e);
    return false;
  }
}

let draining = false;

export async function drain(): Promise<void> {
  if (draining) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  draining = true;
  try {
    const db = await getDB();
    const items = (await db.getAll(STORE)) as OutboxItem[];
    for (const item of items) {
      const ok = await processItem(item);
      if (ok) {
        await db.delete(STORE, item.id);
      } else {
        item.attempts += 1;
        if (item.attempts >= 10) {
          await db.delete(STORE, item.id);
        } else {
          await db.put(STORE, item);
        }
      }
    }
  } finally {
    draining = false;
    void notify();
  }
}

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startOfflineQueueWatcher(): void {
  if (typeof window === 'undefined') return;
  if (intervalId !== null) return;
  window.addEventListener('online', () => void drain());
  intervalId = setInterval(() => void drain(), 30_000);
  void drain();
}
