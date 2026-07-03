import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/storage';
import { getGoalLabels } from '@/data/goalMap';
import { cn } from '@/lib/utils';

interface WidgetHintProps {
  /** Stable id — used as the localStorage dismissal key. */
  id: string;
  title: string;
  /** Short explanation shown under the title. */
  body: string;
  /** Optional 2-4 bullet "what to do next" list. */
  steps?: string[];
  /** If provided, prepends a "Because you chose <goal>…" sentence when the user has that goal. */
  goalHooks?: Record<string, string>;
  className?: string;
}

const KEY_PREFIX = 'rtd-widget-hint:';

/**
 * Contextual empty-state tooltip / short explainer that sits at the top of
 * a dashboard widget. Dismissible per user, persists via localStorage.
 * Personalises the intro line using the user's profile goals when relevant.
 */
export function WidgetHint({ id, title, body, steps, goalHooks, className }: WidgetHintProps) {
  const { user } = useAuth();
  const uid = user?.id ?? 'anon';
  const storageKey = `${KEY_PREFIX}${uid}:${id}`;
  const [visible, setVisible] = useState(false);
  const [personalIntro, setPersonalIntro] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) return;
      setVisible(true);
    } catch {
      setVisible(true);
    }

    if (goalHooks) {
      try {
        const profile = getUserProfile();
        const labels = getGoalLabels(profile.goals);
        for (const goalId of profile.goals ?? []) {
          if (goalHooks[goalId]) {
            const label = labels.find((_, i) => (profile.goals ?? [])[i] === goalId) ?? goalId;
            setPersonalIntro(`Because you chose ${label}: ${goalHooks[goalId]}`);
            break;
          }
        }
      } catch {}
    }
  }, [storageKey, goalHooks]);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(storageKey, String(Date.now())); } catch {}
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.22 }}
          className={cn(
            'relative rounded-xl border border-primary/25 bg-primary/5 backdrop-blur-sm px-3.5 py-3 sm:px-4 sm:py-3.5',
            className,
          )}
          role="note"
          aria-label={`Tip: ${title}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={15} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
              {personalIntro && (
                <p className="mt-1 text-[11px] text-primary/90 leading-snug">{personalIntro}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
              {steps && steps.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {steps.map((s, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground/90 flex items-start gap-1.5">
                      <span className="mt-0.5 inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-primary/15 text-[9px] font-semibold text-primary flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss tip"
              className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
