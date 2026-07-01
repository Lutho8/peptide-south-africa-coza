import { useState } from 'react';
import { AlertTriangle, RefreshCw, FileUp, MessageCircle, Pencil } from 'lucide-react';
import { ManualBloodworkEntry } from './ManualBloodworkEntry';

interface Props {
  message: string;
  code?: string | null;
  onRetry: () => void;
  onReset: () => void;
  labReportId?: string | null;
  onManualSaved?: () => void;
}

const CODE_HINTS: Record<string, string> = {
  UNSUPPORTED_CONTENT: 'The file did not look like a valid PDF or image. Re-export from your lab portal and try again.',
  ENCRYPTED_PDF: 'This PDF is password-protected. Re-export it without encryption first.',
  STORAGE_DOWNLOAD_FAILED: 'We couldn\'t load your file from storage. Check your connection and retry.',
  TIMEOUT: 'The AI ran out of time on this report. A single retry usually works.',
  AI_NETWORK_ERROR: 'The AI service was unreachable. Check your connection and retry.',
  AI_GATEWAY_ERROR: 'The AI service returned an error. Please retry in a moment.',
  RATE_LIMITED: 'Too many scans right now. Wait ~30 seconds and retry.',
  CREDITS_EXHAUSTED: 'Scan credits are exhausted. Enter values manually below to unblock yourself.',
  BAD_REQUEST: 'Some required upload info was missing. Try uploading the file again.',
  REPORT_NOT_FOUND: 'Your uploaded report couldn\'t be found. Try uploading again.',
  EMPTY_RESPONSE: 'The AI returned an empty response. A retry usually works.',
  INTERNAL_ERROR: 'Something unexpected went wrong on our side. Retry, or enter values manually.',
  TRANSPORT: 'Network error reaching the AI service. Retry once your connection is stable.',
};

export function ScanError({ message, code, onRetry, onReset, labReportId, onManualSaved }: Props) {
  const [manualOpen, setManualOpen] = useState(false);
  const hint = code ? CODE_HINTS[code] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center">
            <AlertTriangle size={18} className="text-destructive" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground">Scan interrupted</h3>
              {code && (
                <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">
                  {code}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{message}</p>
            {hint && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{hint}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Your upload is saved — retry the AI scan (no re-upload needed) or enter values manually below.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity active:scale-[0.97]"
          >
            <RefreshCw size={12} /> Retry now
          </button>
          <button
            type="button"
            onClick={() => setManualOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/15 transition-colors active:scale-[0.97]"
          >
            <Pencil size={12} /> Enter manually
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary/60 transition-colors active:scale-[0.97]"
          >
            <FileUp size={12} /> Upload different file
          </button>
          <a
            href="https://wa.me/491624747159?text=I%20need%20help%20with%20my%20bloodwork%20scan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
          >
            <MessageCircle size={12} /> Contact support
          </a>
        </div>
      </div>

      {manualOpen && (
        <ManualBloodworkEntry labReportId={labReportId} onSaved={onManualSaved} />
      )}
    </div>
  );
}
