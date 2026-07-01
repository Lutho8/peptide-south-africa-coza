import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScanStage } from '@/hooks/useScanProgress';

const ORDER: Exclude<ScanStage, 'idle' | 'done' | 'error'>[] = ['upload', 'extract', 'generate', 'finalize'];

interface Props {
  stage: ScanStage;
  label: string;
  percent: number;
  startedAt?: number | null;
  onCancel?: () => void;
  onRetry?: () => void;
  stalledAfterMs?: number;
}

function fmtElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function ScanProgress({ stage, label, percent, startedAt, onCancel, onRetry, stalledAfterMs = 60_000 }: Props) {
  const activeIndex = ORDER.indexOf(stage as any);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAt || stage === 'done' || stage === 'error') return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [startedAt, stage]);

  const elapsedMs = startedAt ? now - startedAt : 0;
  const showStalled = !!(onRetry && startedAt && elapsedMs > stalledAfterMs && stage !== 'done' && stage !== 'error');

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
          {startedAt ? `Elapsed ${fmtElapsed(elapsedMs)} · usually 30–60s` : 'Usually completes in 30–60 seconds.'}
        </p>
        <span className="text-[11px] font-mono tabular-nums text-primary">{percent}%</span>
      </div>

      {showStalled && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-xs text-amber-600 font-semibold mb-2">
            Taking longer than expected. Larger reports sometimes need a nudge.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={12} /> Retry analysis
          </button>
        </div>
      )}

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
