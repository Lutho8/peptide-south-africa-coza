import { useMemo } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Cycle } from '@/services/storage';
import { peptides } from '@/data/peptides';
import { Play, Pause, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleHistoryTimelineProps {
  cycles: Cycle[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysElapsed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getEndDate(startDate: string, days: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getRestartDate(startDate: string, cycleDays: number, breakDays: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + cycleDays + breakDays);
  return d.toISOString().split('T')[0];
}

export function CycleHistoryTimeline({ cycles }: CycleHistoryTimelineProps) {
  const timelineItems = useMemo(() => {
    return cycles
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .map(cycle => {
        const peptide = peptides.find(p => p.id === cycle.peptideId);
        const protocol = peptide?.cycleProtocol;
        const daysElapsed = getDaysElapsed(cycle.startDate);
        const endDate = getEndDate(cycle.startDate, cycle.plannedDuration);
        const restartDate = protocol
          ? getRestartDate(cycle.startDate, cycle.plannedDuration, protocol.breakDays)
          : getEndDate(cycle.startDate, cycle.plannedDuration + cycle.breakDuration);
        const progress = Math.min((daysElapsed / cycle.plannedDuration) * 100, 100);

        return {
          cycle,
          peptide,
          protocol,
          daysElapsed,
          endDate,
          restartDate,
          progress,
        };
      });
  }, [cycles]);

  if (timelineItems.length === 0) {
    return (
      <GradientCard className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No cycle history yet. Start a cycle to see your timeline.</p>
      </GradientCard>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-4">
        {timelineItems.map(({ cycle, protocol, daysElapsed, endDate, restartDate, progress }) => {
          const statusIcon =
            cycle.status === 'active' ? <Play size={14} /> :
            cycle.status === 'break' ? <Pause size={14} /> :
            <CheckCircle2 size={14} />;

          const statusColor =
            cycle.status === 'active' ? 'bg-green-500' :
            cycle.status === 'break' ? 'bg-blue-500' :
            'bg-muted-foreground';

          const statusLabel =
            cycle.status === 'active' ? 'Active' :
            cycle.status === 'break' ? 'On Break' :
            'Completed';

          return (
            <div key={cycle.id} className="relative pl-10">
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-2.5 top-4 w-3 h-3 rounded-full ring-2 ring-background",
                statusColor
              )} />

              <GradientCard className="p-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full",
                      cycle.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      cycle.status === 'break' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {statusIcon}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{cycle.peptideName}</h4>
                      <p className="text-xs text-muted-foreground">{cycle.dose} • {cycle.frequency}</p>
                    </div>
                  </div>
                  <Badge variant={cycle.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {statusLabel}
                  </Badge>
                </div>

                {/* Progress bar (active cycles only) */}
                {cycle.status === 'active' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Day {daysElapsed}</span>
                      <span>{cycle.plannedDuration} days</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          progress >= 100 ? "bg-destructive" : progress >= 80 ? "bg-yellow-500" : "bg-primary"
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Timeline phases */}
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {/* Start */}
                  <div className="rounded-lg bg-green-500/10 p-2 text-center">
                    <Calendar size={12} className="mx-auto mb-1 text-green-400" />
                    <p className="font-medium text-foreground">Start</p>
                    <p className="text-muted-foreground">{formatDate(cycle.startDate)}</p>
                  </div>

                  {/* End / Break start */}
                  <div className="rounded-lg bg-yellow-500/10 p-2 text-center">
                    <Pause size={12} className="mx-auto mb-1 text-yellow-400" />
                    <p className="font-medium text-foreground">Break</p>
                    <p className="text-muted-foreground">{formatDate(endDate)}</p>
                    <p className="text-muted-foreground/70 mt-0.5">
                      {protocol?.breakDays ?? cycle.breakDuration}d off
                    </p>
                  </div>

                  {/* Restart */}
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-center">
                    <ArrowRight size={12} className="mx-auto mb-1 text-emerald-400" />
                    <p className="font-medium text-foreground">Restart</p>
                    <p className="text-muted-foreground">{formatDate(restartDate)}</p>
                  </div>
                </div>

                {/* Break advice preview for break status */}
                {cycle.status === 'break' && protocol?.breakAdvice && (
                  <div className="mt-3 pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-foreground mb-1">🧘 During your break:</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {protocol.breakAdvice[0]}
                    </p>
                  </div>
                )}

                {cycle.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic border-t border-border/50 pt-2">
                    {cycle.notes}
                  </p>
                )}
              </GradientCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
