import { Check, Loader2, CloudOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'hydrating' | 'syncing' | 'ready' | 'error' | 'offline';

interface StackSyncBadgeProps {
  status: SyncStatus;
  lastSyncAt?: Date | null;
  className?: string;
  compact?: boolean;
}

function relativeTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleDateString();
}

export function StackSyncBadge({ status, lastSyncAt, className, compact }: StackSyncBadgeProps) {
  const isBusy = status === 'syncing' || status === 'hydrating';

  let icon = <Check size={12} className="text-emerald-400" />;
  let label = 'Up to date';
  let tone = 'text-muted-foreground';

  if (isBusy) {
    icon = <Loader2 size={12} className="animate-spin text-primary" />;
    label = status === 'hydrating' ? 'Loading…' : 'Syncing…';
    tone = 'text-primary';
  } else if (status === 'error') {
    icon = <AlertCircle size={12} className="text-destructive" />;
    label = 'Sync error';
    tone = 'text-destructive';
  } else if (status === 'offline') {
    icon = <CloudOff size={12} className="text-muted-foreground" />;
    label = 'Local only';
  } else if (status === 'ready' && lastSyncAt) {
    label = compact ? 'Synced' : `Up to date · ${relativeTime(lastSyncAt)}`;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] font-medium',
        tone,
        className
      )}
      aria-live="polite"
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
