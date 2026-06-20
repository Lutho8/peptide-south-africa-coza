import { motion } from 'framer-motion';
import { Sparkles, Flame, HeartPulse, Droplet, Filter, Shield, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SystemSummary } from '@/lib/bloodwork/systems';

const ICONS: Record<string, LucideIcon> = { Sparkles, Flame, HeartPulse, Droplet, Filter, Shield };

const STATUS_STYLES = {
  optimal: 'border-green-500/30 bg-green-500/5 text-green-500',
  watch: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-600',
  action: 'border-red-500/40 bg-red-500/10 text-red-500',
};

const STATUS_LABEL = { optimal: 'Optimal', watch: 'Watch', action: 'Action' };

interface Props {
  systems: SystemSummary[];
  onSelect?: (categories: string[]) => void;
}

export function SystemDashboard({ systems, onSelect }: Props) {
  return (
    <section data-bloodwork-systems>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">01 —</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">System overview</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {systems.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          const tone = STATUS_STYLES[s.status];
          const disabled = s.total === 0;
          return (
            <motion.button
              key={s.key}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={!disabled ? { scale: 1.02, y: -2 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
              onClick={() => !disabled && onSelect?.(s.categories)}
              disabled={disabled}
              className={cn(
                'group relative text-left rounded-xl border bg-card/40 p-4 transition-all',
                'border-border/60 hover:border-primary/40',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg border', tone)}>
                  <Icon size={16} />
                </div>
                <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', tone)}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{s.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                {disabled ? 'No markers' : `${s.flagged}/${s.total} flagged${s.critical ? ` · ${s.critical} critical` : ''}`}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
