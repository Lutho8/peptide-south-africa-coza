import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { ONBOARDING_STEPS, getProgress, subscribe } from '@/lib/onboardingProgress';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  variant?: 'card' | 'inline';
  onItemClick?: (id: string) => void;
  hideWhenComplete?: boolean;
}

export function OnboardingChecklist({ variant = 'card', onItemClick, hideWhenComplete = true }: Props) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [, force] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => subscribe(() => force(n => n + 1)), []);

  const progress = getProgress(userId);
  const total = ONBOARDING_STEPS.length;
  const completed = ONBOARDING_STEPS.filter(s => progress[s.id]).length;
  const pct = Math.round((completed / total) * 100);
  const allDone = completed === total;

  if (hideWhenComplete && allDone) return null;

  const wrapper = variant === 'card'
    ? 'rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-4 md:p-5'
    : '';

  return (
    <div className={wrapper}>
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between gap-3 text-left"
        aria-expanded={!collapsed}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Get started</p>
          <p className="text-xs text-muted-foreground">{completed} of {total} complete</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {collapsed ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronUp size={16} className="text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-3 space-y-1.5"
          >
            {ONBOARDING_STEPS.map((s) => {
              const done = Boolean(progress[s.id]);
              return (
                <li key={s.id}>
                  <button
                    onClick={() => onItemClick?.(s.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left text-sm transition-colors ${
                      done ? 'text-muted-foreground' : 'text-foreground hover:bg-muted/40'
                    }`}
                  >
                    {done ? (
                      <Check size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={14} className="text-muted-foreground shrink-0" />
                    )}
                    <span className={done ? 'line-through' : ''}>{s.label}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
