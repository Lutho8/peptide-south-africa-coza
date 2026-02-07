import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle size={24} className="text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This screen failed to load. Try refreshing.
            </p>
          </div>
          <Button variant="outline" onClick={this.handleRetry} className="gap-2">
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
