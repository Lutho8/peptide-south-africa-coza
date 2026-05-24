import { AlertTriangle, RefreshCw, FileUp, MessageCircle } from 'lucide-react';

interface Props {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ScanError({ message, onRetry, onReset }: Props) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center">
          <AlertTriangle size={18} className="text-destructive" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground">We couldn't decode this report</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={12} /> Try again
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary/60 transition-colors"
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
  );
}
