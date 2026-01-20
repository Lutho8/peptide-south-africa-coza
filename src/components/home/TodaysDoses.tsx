import { GradientCard } from '@/components/ui/GradientCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { todaysDoses, activeCycles } from '@/data/userData';
import { Syringe, ChevronRight } from 'lucide-react';

interface TodaysDosesProps {
  onViewTracker: () => void;
}

export function TodaysDoses({ onViewTracker }: TodaysDosesProps) {
  const takenCount = todaysDoses.filter(d => d.status === 'taken').length;
  const totalCount = todaysDoses.length;
  const activeCycleCount = activeCycles.filter(c => c.status === 'active').length;

  return (
    <GradientCard hover onClick={onViewTracker}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Syringe size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Today's Doses</h3>
            <p className="text-sm text-muted-foreground">
              {takenCount}/{totalCount} completed • {activeCycleCount} active cycles
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {todaysDoses.map((dose) => (
          <div 
            key={dose.id}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-muted/50 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-foreground">{dose.peptideName}</span>
              <StatusBadge status={dose.status} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground">{dose.time} • {dose.dose}</p>
          </div>
        ))}
      </div>
    </GradientCard>
  );
}
