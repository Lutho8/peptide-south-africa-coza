import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ScanStage } from '@/hooks/useScanProgress';

const ORDER: Exclude<ScanStage, 'idle' | 'done' | 'error'>[] = ['upload', 'extract', 'generate', 'finalize'];

interface Props {
  stage: ScanStage;
  label: string;
  percent: number;
  onCancel?: () => void;
}

export function ScanProgress({ stage, label, percent, onCancel }: Props) {
  const activeIndex = ORDER.indexOf(stage as any);

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-card/40 p-5">
      <div className="flex items-center gap-3 mb-3">
        {ORDER.map((s, i) => {
          const isComplete = activeIndex > i || stage === 'done';
          const isActive = activeIndex === i;
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  isComplete && 'bg-primary',
                  isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary animate-pulse',
                  !isComplete && !isActive && 'bg-muted'
                )}
              />
              {i < ORDER.length - 1 && (
                <div
                  className={cn(
                    'w-6 h-px transition-colors',
                    isComplete ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="min-h-[24px] mb-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-semibold text-foreground"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-2">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          Usually completes in 30–60 seconds. Larger lab reports may take longer.
        </p>
        <span className="text-[11px] font-mono tabular-nums text-primary">{percent}%</span>
      </div>

      {onCancel && stage !== 'done' && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
        >
          Cancel scan
        </button>
      )}
    </div>
  );
}
