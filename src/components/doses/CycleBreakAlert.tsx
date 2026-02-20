import { useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { peptides } from '@/data/peptides';
import { Cycle } from '@/services/storage';
import { AlertTriangle, Calendar, Coffee, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleBreakAlertProps {
  cycles: Cycle[];
  onStartBreak?: (cycle: Cycle) => void;
}

function getDaysElapsed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getRestartDate(startDate: string, cycleDays: number, breakDays: number): Date {
  const start = new Date(startDate);
  start.setDate(start.getDate() + cycleDays + breakDays);
  return start;
}

export function CycleBreakAlert({ cycles, onStartBreak }: CycleBreakAlertProps) {
  const [expandedCycleId, setExpandedCycleId] = useState<string | null>(null);

  const cycleAlerts = cycles
    .filter(c => c.status === 'active')
    .map(cycle => {
      const peptide = peptides.find(p => p.id === cycle.peptideId);
      const protocol = peptide?.cycleProtocol;
      if (!protocol) return null;

      const daysElapsed = getDaysElapsed(cycle.startDate);
      const progress = Math.min((daysElapsed / protocol.maxDays) * 100, 100);
      const isOverdue = daysElapsed >= protocol.maxDays;
      const isNearing = daysElapsed >= protocol.minDays && !isOverdue;
      const daysRemaining = protocol.maxDays - daysElapsed;
      const restartDate = getRestartDate(cycle.startDate, protocol.maxDays, protocol.breakDays);

      if (!isNearing && !isOverdue) return null;

      return {
        cycle,
        peptide,
        protocol,
        daysElapsed,
        progress,
        isOverdue,
        isNearing,
        daysRemaining,
        restartDate,
      };
    })
    .filter(Boolean);

  if (cycleAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {cycleAlerts.map((alert) => {
        if (!alert) return null;
        const { cycle, peptide, protocol, daysElapsed, progress, isOverdue, daysRemaining, restartDate } = alert;
        const isExpanded = expandedCycleId === cycle.id;

        return (
          <GradientCard
            key={cycle.id}
            className={cn(
              "border-l-4",
              isOverdue ? "border-l-destructive" : "border-l-yellow-500"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={18}
                  className={isOverdue ? "text-destructive" : "text-yellow-500"}
                />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {cycle.peptideName}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isOverdue
                      ? `Cycle exceeded by ${Math.abs(daysRemaining)} days — take a break now`
                      : `${daysRemaining} days remaining before recommended break`}
                  </p>
                </div>
              </div>
              <Badge
                variant={isOverdue ? "destructive" : "secondary"}
                className="text-xs"
              >
                Day {daysElapsed}/{protocol.maxDays}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-muted mb-3">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isOverdue ? "bg-destructive" : progress > 80 ? "bg-yellow-500" : "bg-primary"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Expand/Collapse */}
            <button
              onClick={() => setExpandedCycleId(isExpanded ? null : cycle.id)}
              className="flex items-center gap-1 text-xs text-primary hover:underline mb-2"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {isExpanded ? 'Hide' : 'View'} break protocol
            </button>

            {isExpanded && (
              <div className="space-y-3 pt-2 border-t border-border/50">
                {/* Break Duration */}
                <div className="flex items-center gap-2">
                  <Coffee size={16} className="text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Recommended Break</p>
                    <p className="text-xs text-muted-foreground">{protocol.breakDays} days off</p>
                  </div>
                </div>

                {/* Restart Date */}
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Restart Date</p>
                    <p className="text-xs text-muted-foreground">
                      {restartDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Restart Advice */}
                <div className="flex items-center gap-2">
                  <Play size={16} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">When to Restart</p>
                    <p className="text-xs text-muted-foreground">{protocol.restartAdvice}</p>
                  </div>
                </div>

                {/* Break Advice */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    🧘 What to do during your break:
                  </p>
                  <ul className="space-y-1.5">
                    {protocol.breakAdvice.map((advice, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                {onStartBreak && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                    onClick={() => onStartBreak(cycle)}
                  >
                    <Coffee size={14} />
                    Start Break Now
                  </Button>
                )}
              </div>
            )}
          </GradientCard>
        );
      })}
    </div>
  );
}
