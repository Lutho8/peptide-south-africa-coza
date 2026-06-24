import { useEffect, useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { getActiveStack, getCycles, type ActiveStackItem, type Cycle } from '@/services/storage';
import { peptides } from '@/data/peptides';
import { findPeptideOrBlend } from '@/data/blendAdapters';
import { Layers, ChevronRight, Plus, Pause, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSyncPhase } from '@/hooks/useCloudSync';
import { useAuth } from '@/contexts/AuthContext';
import { StackSyncBadge, type SyncStatus } from '@/components/sync/StackSyncBadge';
import { StackPreviewSkeleton } from './StackPreviewSkeleton';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { getCycleProgress, cycleStatusLabel } from '@/lib/cycleProgress';

interface ActiveStackPreviewProps {
  onViewStack: () => void;
}

export function ActiveStackPreview({ onViewStack }: ActiveStackPreviewProps) {
  const [userStack, setUserStack] = useState<ActiveStackItem[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const { user } = useAuth();
  const { phase, lastSyncAt } = useSyncPhase();
  const { doses } = useDailyDoses();

  useEffect(() => {
    const refresh = () => {
      setUserStack(getActiveStack());
      setCycles(getCycles());
    };
    refresh();
    window.addEventListener('rtd:cloud-hydrated', refresh);
    window.addEventListener('rtd:stack-changed', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('rtd:cloud-hydrated', refresh);
      window.removeEventListener('rtd:stack-changed', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const isHydrating = !!user && (phase === 'hydrating' || phase === 'idle');
  if (isHydrating && userStack.length === 0) {
    return <StackPreviewSkeleton />;
  }

  const status: SyncStatus = !user
    ? 'offline'
    : phase === 'hydrating' || phase === 'idle'
      ? 'hydrating'
      : phase === 'syncing'
        ? 'syncing'
        : phase === 'error'
          ? 'error'
          : 'ready';

  // Empty state
  if (userStack.length === 0) {
    return (
      <GradientCard hover onClick={onViewStack} className="border-dashed border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Plus size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Build Your Stack</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add your first peptide to start tracking
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-primary" />
        </div>
      </GradientCard>
    );
  }

  // Build per-peptide rows with live cycle progress
  const rows = userStack.map((item) => {
    const peptide = findPeptideOrBlend(item.peptideId) || peptides.find(p => p.id === item.peptideId);
    const cycle = cycles.find(c => c.peptideId === item.peptideId && (c.status === 'active' || c.status === 'break'));
    const info = cycle ? getCycleProgress(cycle, doses) : null;
    return { item, peptide, cycle, info };
  });

  // Top summary
  const activeCount = rows.filter(r => r.cycle?.status === 'active').length;
  const pausedCount = rows.filter(r => r.cycle?.status === 'break').length;
  const noCycleCount = rows.filter(r => !r.cycle).length;
  const dosesBehindToday = rows.reduce((sum, r) => sum + (r.info?.dosesBehind ?? 0), 0);

  const summaryParts: string[] = [];
  if (activeCount) summaryParts.push(`${activeCount} active`);
  if (pausedCount) summaryParts.push(`${pausedCount} paused`);
  if (noCycleCount) summaryParts.push(`${noCycleCount} not started`);
  const summaryLine = summaryParts.join(' · ');

  return (
    <GradientCard hover onClick={onViewStack}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Layers size={20} className="text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">Active Protocol</h3>
            <p className="text-xs text-muted-foreground truncate">
              {summaryLine || `${userStack.length} peptides`}
              {dosesBehindToday > 0 && (
                <span className="text-amber-400"> · {dosesBehindToday} dose{dosesBehindToday === 1 ? '' : 's'} behind</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StackSyncBadge status={status} lastSyncAt={lastSyncAt} compact />
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-1.5">
        {rows.slice(0, 5).map(({ item, peptide, cycle, info }) => {
          if (!peptide) return null;
          const name = peptide.name;

          // Compute week display from calendarDays + plannedDuration
          let weekText: string | null = null;
          if (cycle && info) {
            const weekNow = Math.min(
              Math.ceil(cycle.plannedDuration / 7),
              Math.max(1, Math.floor(info.calendarDays / 7) + 1),
            );
            const weekTotal = Math.max(1, Math.ceil(cycle.plannedDuration / 7));
            weekText = `Week ${weekNow}/${weekTotal} · ${info.dosesLogged}/${info.dosesPlanned} doses`;
          }

          const statusLabel = info ? cycleStatusLabel(info, cycle?.status) : 'Not started';
          const badgeTone =
            cycle?.status === 'break'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : info?.isOverdue
                ? 'bg-destructive/15 text-destructive border-destructive/30'
                : info && info.dosesBehind >= 2
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : info?.isNearing
                    ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                    : info
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'bg-muted text-muted-foreground border-border';

          return (
            <div
              key={item.peptideId}
              className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 px-2.5 py-1.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {cycle?.status === 'break' ? (
                    <span className="inline-flex items-center gap-1">
                      <Pause size={9} /> Paused{cycle.pauseReason === 'out_of_stock' ? ' — out of stock' : cycle.pauseReason === 'missed_doses' ? ' — catching up' : ''}
                    </span>
                  ) : weekText ? (
                    weekText
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <AlertCircle size={9} /> No cycle yet · tap to start
                    </span>
                  )}
                </p>
              </div>
              <Badge variant="outline" className={cn('text-[10px] flex-shrink-0', badgeTone)}>
                {statusLabel}
              </Badge>
            </div>
          );
        })}
        {rows.length > 5 && (
          <p className="text-[11px] text-muted-foreground pl-2.5">+{rows.length - 5} more in My Stack</p>
        )}
      </div>
    </GradientCard>
  );
}
