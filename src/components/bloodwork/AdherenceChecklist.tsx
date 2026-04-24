import { Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdherenceSection, adherenceKey } from '@/hooks/useProtocolAdherence';

export interface ChecklistItem {
  title: string;
  body?: string;
  meta?: string;
}

interface Props {
  section: AdherenceSection;
  items: ChecklistItem[];
  isDone: (section: AdherenceSection, key: string) => boolean;
  toggle: (section: AdherenceSection, index: number, label: string) => void;
  resetSection: (section: AdherenceSection) => void;
  progress: { done: number; total: number; pct: number };
}

export function AdherenceChecklist({ section, items, isDone, toggle, resetSection, progress }: Props) {
  if (!items.length) return null;
  return (
    <div>
      {/* progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground tabular-nums shrink-0">
          {progress.done}/{progress.total} done
        </span>
        {progress.done > 0 && (
          <button
            type="button"
            onClick={() => resetSection(section)}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Reset ${section} adherence`}
          >
            <RotateCcw size={10} /> Reset
          </button>
        )}
      </div>

      <ol className="space-y-3">
        {items.map((item, i) => {
          const key = adherenceKey(section, i, item.title);
          const done = isDone(section, key);
          return (
            <li
              key={i}
              className={cn(
                'group flex gap-3 rounded-lg border border-border/40 bg-card/30 p-3 transition-all',
                done && 'border-primary/30 bg-primary/5'
              )}
            >
              <button
                type="button"
                onClick={() => toggle(section, i, item.title)}
                aria-pressed={done}
                aria-label={done ? `Mark "${item.title}" not done` : `Mark "${item.title}" done`}
                className={cn(
                  'mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  done
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                )}
              >
                {done && <Check size={12} strokeWidth={3} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4
                    className={cn(
                      'text-sm font-semibold transition-all',
                      done ? 'line-through text-muted-foreground' : 'text-foreground'
                    )}
                  >
                    {item.title}
                  </h4>
                  {item.meta && (
                    <span className="text-xs text-muted-foreground">— {item.meta}</span>
                  )}
                </div>
                {item.body && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
