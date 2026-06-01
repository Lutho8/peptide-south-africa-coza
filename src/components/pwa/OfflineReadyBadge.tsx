import { CloudCheck, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useOfflineReadiness } from '@/hooks/useOfflineReadiness';

interface Props { className?: string; compact?: boolean }

export function OfflineReadyBadge({ className = '', compact = false }: Props) {
  const { status, cachedAssets } = useOfflineReadiness();

  const map = {
    ready: { Icon: CloudCheck, label: 'Offline ready', tone: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
    caching: { Icon: Loader2, label: 'Caching for offline…', tone: 'text-primary border-primary/30 bg-primary/10', spin: true },
    unknown: { Icon: Cloud, label: 'Checking offline cache…', tone: 'text-muted-foreground border-border/50 bg-card/40' },
    unsupported: { Icon: CloudOff, label: 'Offline unavailable here', tone: 'text-muted-foreground border-border/50 bg-card/40' },
  } as const;

  const cfg = map[status];
  const Icon = cfg.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur ${cfg.tone} ${className}`}
      title={cachedAssets ? `${cachedAssets} assets cached locally` : undefined}
      aria-live="polite"
    >
      <Icon className={`w-3.5 h-3.5 ${'spin' in cfg && cfg.spin ? 'animate-spin' : ''}`} />
      {!compact && <span>{cfg.label}</span>}
      {!compact && status === 'ready' && cachedAssets > 0 && (
        <span className="text-[10px] opacity-70">· {cachedAssets}</span>
      )}
    </span>
  );
}
