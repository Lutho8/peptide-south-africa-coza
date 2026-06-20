import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logClientError, isImportFailure } from '@/lib/errorLog';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  /** Optional label used in the logged error context (e.g. "DailyLogScreen"). */
  boundaryName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isImportError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isImportError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isImportError: isImportFailure(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logClientError(error, {
      kind: isImportFailure(error) ? 'import' : 'render',
      componentStack: errorInfo.componentStack ?? undefined,
      context: {
        boundary: this.props.boundaryName ?? this.props.fallbackTitle ?? 'ErrorBoundary',
      },
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, isImportError: false });
  };

  handleReload = () => {
    try {
      window.location.reload();
    } catch {
      /* noop */
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { isImportError, error } = this.state;
    const title = isImportError
      ? "Couldn't load this section"
      : this.props.fallbackTitle || 'Something went wrong';
    const body = isImportError
      ? 'A part of the app failed to download. Check your connection, then retry or reload.'
      : 'This screen failed to load. Try refreshing, or open Settings → Diagnostics for details.';

    return (
      <div
        className="flex flex-col items-center justify-center px-4 py-10 text-center"
        style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle size={22} className="text-destructive" aria-hidden />
          </div>
          <h3 className="font-semibold text-foreground text-lg leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>

          {error?.message ? (
            <p className="text-xs text-muted-foreground/80 font-mono break-words max-w-full px-2">
              {error.message}
            </p>
          ) : null}

          <div className="mt-2 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={this.handleRetry}
              className="gap-2 h-11 w-full sm:w-auto"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
            {isImportError ? (
              <Button
                onClick={this.handleReload}
                className="gap-2 h-11 w-full sm:w-auto"
              >
                <RotateCw size={16} />
                Reload app
              </Button>
            ) : null}
          </div>

          <p className="text-[11px] text-muted-foreground/70 mt-3 inline-flex items-center gap-1">
            <Download size={12} aria-hidden />
            Details saved to Settings → Diagnostics
          </p>
        </div>
      </div>
    );
  }
}
