// Lightweight client-side error log persisted to localStorage.
// Ring buffer of the most recent 50 entries. No backend dependency.

export interface ClientErrorEntry {
  id: string;
  timestamp: string; // ISO
  route: string;
  userAgent: string;
  kind: 'render' | 'global' | 'promise' | 'import';
  message: string;
  stack?: string;
  componentStack?: string;
  context?: Record<string, unknown>;
}

const STORAGE_KEY = 'peptide-sa:error-log';
const MAX_ENTRIES = 50;

const IMPORT_PATTERNS = [
  'Failed to fetch dynamically imported module',
  'Importing a module script failed',
  'error loading dynamically imported module',
  'ChunkLoadError',
  'Loading chunk',
];

export function isImportFailure(err: unknown): boolean {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  if (e.name === 'ChunkLoadError') return true;
  const msg = e.message ?? String(err);
  return IMPORT_PATTERNS.some((p) => msg.includes(p));
}

function safeRoute(): string {
  try {
    return window.location.hash || window.location.pathname || '/';
  } catch {
    return '/';
  }
}

function readAll(): ClientErrorEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: ClientErrorEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    // Quota / private mode — silently drop.
  }
}

export interface LogContext {
  kind?: ClientErrorEntry['kind'];
  componentStack?: string;
  context?: Record<string, unknown>;
}

export function logClientError(error: unknown, ctx: LogContext = {}): ClientErrorEntry {
  const err = error instanceof Error ? error : new Error(String(error));
  const kind: ClientErrorEntry['kind'] =
    ctx.kind ?? (isImportFailure(err) ? 'import' : 'render');

  const entry: ClientErrorEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    route: safeRoute(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    kind,
    message: err.message || 'Unknown error',
    stack: err.stack,
    componentStack: ctx.componentStack,
    context: ctx.context,
  };

  const existing = readAll();
  writeAll([...existing, entry]);

  try {
    // Single grouped console log for DevTools visibility.
    // eslint-disable-next-line no-console
    console.error(
      `[client-error:${kind}] ${entry.message}\nroute=${entry.route}`,
      err,
      ctx.componentStack ? `\ncomponentStack:${ctx.componentStack}` : ''
    );
  } catch {
    /* noop */
  }

  return entry;
}

export function getClientErrors(): ClientErrorEntry[] {
  return readAll().slice().reverse(); // newest first
}

export function clearClientErrors() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function formatErrorsForCopy(entries: ClientErrorEntry[] = getClientErrors()): string {
  return entries
    .map(
      (e) =>
        `[${e.timestamp}] (${e.kind}) ${e.route}\n${e.message}\n${e.stack ?? ''}${
          e.componentStack ? `\n--- component stack ---${e.componentStack}` : ''
        }`
    )
    .join('\n\n========\n\n');
}
