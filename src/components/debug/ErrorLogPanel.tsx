import { useEffect, useState, useCallback } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ClientErrorEntry,
  getClientErrors,
  clearClientErrors,
  formatErrorsForCopy,
} from '@/lib/errorLog';
import { Bug, Copy, Trash2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const kindColor: Record<ClientErrorEntry['kind'], string> = {
  render: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  global: 'bg-red-500/15 text-red-700 dark:text-red-300',
  promise: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  import: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
};

export function ErrorLogPanel() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<ClientErrorEntry[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => setEntries(getClientErrors()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatErrorsForCopy(entries));
      toast({ title: 'Copied', description: `${entries.length} error(s) copied to clipboard` });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    clearClientErrors();
    refresh();
    toast({ title: 'Error log cleared' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Bug size={16} className="text-primary" />
          <h3 className="font-medium text-foreground text-sm">Recent errors</h3>
          {entries.length > 0 ? (
            <Badge variant="secondary" className="text-[10px]">
              {entries.length}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={refresh} className="h-9 px-2">
            <RefreshCw size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={entries.length === 0}
            className="h-9 gap-1"
          >
            <Copy size={14} />
            Copy
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            disabled={entries.length === 0}
            className="h-9 gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 size={14} />
            Clear
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <GradientCard className="text-center py-6">
          <p className="text-xs text-muted-foreground">No errors logged. Nice. 👌</p>
        </GradientCard>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => {
            const isOpen = !!expanded[e.id];
            return (
              <GradientCard key={e.id} className="p-3">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                  className="w-full text-left flex items-start gap-2 min-h-11"
                >
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${kindColor[e.kind]}`}
                  >
                    {e.kind}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground break-words">
                      {e.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 break-all">
                      {new Date(e.timestamp).toLocaleString()} · {e.route}
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                </button>

                {isOpen ? (
                  <div className="mt-2 space-y-2">
                    {e.stack ? (
                      <pre className="text-[11px] font-mono leading-snug bg-muted/50 rounded-md p-2 max-h-60 overflow-auto whitespace-pre-wrap break-words">
                        {e.stack}
                      </pre>
                    ) : null}
                    {e.componentStack ? (
                      <pre className="text-[11px] font-mono leading-snug bg-muted/40 rounded-md p-2 max-h-40 overflow-auto whitespace-pre-wrap break-words">
                        {e.componentStack}
                      </pre>
                    ) : null}
                    {e.context ? (
                      <pre className="text-[11px] font-mono leading-snug bg-muted/30 rounded-md p-2 max-h-32 overflow-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(e.context, null, 2)}
                      </pre>
                    ) : null}
                    <p className="text-[10px] text-muted-foreground break-all">
                      UA: {e.userAgent}
                    </p>
                  </div>
                ) : null}
              </GradientCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
