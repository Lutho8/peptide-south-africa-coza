import { useMemo } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, Syringe, Repeat } from 'lucide-react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';

interface Props {
  doses: DailyDoseEntry[];
  /** Optional peptide ids to constrain (e.g. active stack). */
  peptideIds?: string[];
  /** Prefill Add-Dose modal with the last entry for a peptide. */
  onRepeat?: (dose: DailyDoseEntry) => void;
  className?: string;
}

/**
 * Compact "last dose" recall shown at the top of the Daily Log so the user
 * instantly sees when they most recently dosed each peptide in their stack.
 */
export function LastDoseRecall({ doses, peptideIds, onRepeat, className }: Props) {
  const lastPerPeptide = useMemo(() => {
    const map = new Map<string, DailyDoseEntry>();
    for (const d of doses) {
      if (peptideIds && peptideIds.length && !peptideIds.includes(d.peptide_id)) continue;
      const existing = map.get(d.peptide_id);
      const key = `${d.date}T${d.time}`;
      if (!existing || key > `${existing.date}T${existing.time}`) {
        map.set(d.peptide_id, d);
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`),
    );
  }, [doses, peptideIds]);

  if (lastPerPeptide.length === 0) return null;

  return (
    <GradientCard className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Clock size={15} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Last dose recall</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {lastPerPeptide.length} peptide{lastPerPeptide.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
        {lastPerPeptide.map((d) => {
          let ago = '';
          try {
            ago = formatDistanceToNow(parseISO(`${d.date}T${d.time}`), { addSuffix: true });
          } catch {
            ago = `${d.date} ${d.time}`;
          }
          return (
            <div
              key={d.peptide_id}
              className="flex-shrink-0 min-w-[190px] max-w-[240px] rounded-lg border border-border/60 bg-background/60 p-2.5"
            >
              <div className="flex items-center gap-1.5">
                <Syringe size={12} className="text-primary flex-shrink-0" />
                <p className="text-xs font-medium text-foreground truncate">{d.peptide_name}</p>
              </div>
              <p className="text-sm font-semibold text-foreground mt-1">
                {d.dose} {d.unit}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {ago} · {d.time}
              </p>
              {onRepeat && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRepeat(d)}
                  className="mt-1.5 h-7 w-full text-[11px] gap-1"
                >
                  <Repeat size={11} />
                  Log same again
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </GradientCard>
  );
}
