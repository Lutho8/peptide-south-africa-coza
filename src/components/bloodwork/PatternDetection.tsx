import { motion } from 'framer-motion';
import { AlertOctagon, Eye, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Pattern } from '@/lib/bloodwork/patterns';
import { useStackCart, slugify } from './StackCartContext';

interface Props {
  patterns: Pattern[];
}

const SEVERITY = {
  info: 'border-primary/30 bg-primary/5 text-primary',
  watch: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-600',
  action: 'border-red-500/40 bg-red-500/10 text-red-500',
};

export function PatternDetection({ patterns }: Props) {
  const { addMany, has } = useStackCart();

  if (patterns.length === 0) return null;

  return (
    <section data-bloodwork-patterns>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">02 —</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Pattern detection</h2>
      </div>
      <div className="space-y-3">
        {patterns.map((p, i) => {
          const tone = SEVERITY[p.severity];
          const allInCart = p.suggestedPeptides.every((n) => has(slugify(n)));
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-xl border border-border/60 bg-card/40 p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md border shrink-0', tone)}>
                    {p.severity === 'action' ? <AlertOctagon size={13} /> : <Eye size={13} />}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.explanation}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.contributingMarkers.map((m) => (
                  <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-foreground border border-border/60">
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Suggested: {p.suggestedPeptides.join(' · ')}
                </p>
                <button
                  type="button"
                  onClick={() => addMany(p.suggestedPeptides.map((n) => ({ name: n, slug: slugify(n) })))}
                  className={cn(
                    'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors shrink-0',
                    allInCart
                      ? 'border-green-500/40 bg-green-500/10 text-green-500'
                      : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20'
                  )}
                >
                  {allInCart ? <><Check size={12} /> In stack</> : <><Plus size={12} /> Add to stack</>}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
