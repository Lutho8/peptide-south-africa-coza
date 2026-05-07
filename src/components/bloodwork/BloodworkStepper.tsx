import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepDef {
  id: number;
  title: string;
}

interface Props {
  steps: StepDef[];
  current: number;
  maxReached: number;
  onJump: (id: number) => void;
}

export function BloodworkStepper({ steps, current, maxReached, onJump }: Props) {
  return (
    <div className="sticky top-[57px] z-30 bg-background/85 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Mobile: compact label */}
        <div className="md:hidden flex items-center justify-between mb-2">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Step {current} of {steps.length}
          </p>
          <p className="text-xs font-semibold text-foreground">{steps[current - 1]?.title}</p>
        </div>
        <div className="md:hidden h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>

        {/* Desktop: full stepper */}
        <ol className="hidden md:flex items-center gap-2">
          {steps.map((s, i) => {
            const isActive = s.id === current;
            const isDone = s.id < current || s.id <= maxReached - 1;
            const reachable = s.id <= maxReached;
            return (
              <li key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && onJump(s.id)}
                  className={cn(
                    'flex items-center gap-2 group',
                    reachable ? 'cursor-pointer' : 'cursor-not-allowed'
                  )}
                >
                  <span
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all',
                      isActive && 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30',
                      !isActive && isDone && 'bg-primary/15 text-primary border-primary/40',
                      !isActive && !isDone && 'bg-card text-muted-foreground border-border'
                    )}
                  >
                    {isDone && !isActive ? <Check size={14} /> : s.id}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {s.title}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      'flex-1 h-px transition-colors',
                      s.id < current ? 'bg-primary/50' : 'bg-border'
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
