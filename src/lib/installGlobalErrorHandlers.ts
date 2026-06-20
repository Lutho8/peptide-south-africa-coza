import { logClientError, isImportFailure } from './errorLog';

let installed = false;

export function installGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (event) => {
    const err = event.error ?? new Error(event.message || 'window.onerror');
    logClientError(err, {
      kind: isImportFailure(err) ? 'import' : 'global',
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    logClientError(reason ?? new Error('unhandledrejection'), {
      kind: isImportFailure(reason) ? 'import' : 'promise',
    });
  });
}
