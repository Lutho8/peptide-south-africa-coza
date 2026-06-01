import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'rtd-dashboard-tour-done';

export const dashboardTourStorageKey = STORAGE_KEY;

export function resetDashboardTour() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

interface TourStep {
  target: string;       // data-tour attribute value
  title: string;
  body: string;
  placement?: 'top' | 'bottom' | 'center';
}

const STEPS: TourStep[] = [
  {
    target: 'welcome-header',
    title: 'Welcome to your Dashboard',
    body: 'This is your home base. Every tool, log, and reminder lives here.',
    placement: 'bottom',
  },
  {
    target: 'todays-doses',
    title: 'Log today\'s peptide dose',
    body: 'Tap here to log doses in seconds — units, IU, or mg.',
    placement: 'top',
  },
  {
    target: 'quick-actions',
    title: 'Quick Actions',
    body: 'Jump straight into Cycles, Body Stats, Bloodwork, and Inventory.',
    placement: 'top',
  },
  {
    target: 'bottom-nav',
    title: 'Tap Home anytime',
    body: 'The Home tab brings you back to your Dashboard from anywhere in the app.',
    placement: 'top',
  },
  {
    target: 'profile-avatar',
    title: 'Profile & Sign Out',
    body: 'Your account, settings, and sign-out live here in the top-right.',
    placement: 'bottom',
  },
];

interface Rect { top: number; left: number; width: number; height: number; }

interface DashboardTourProps {
  /** When true, force-shows the tour ignoring localStorage */
  force?: boolean;
  onClose?: () => void;
}

export function DashboardTour({ force = false, onClose }: DashboardTourProps) {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  // Mount decision
  useEffect(() => {
    if (force) { setActive(true); return; }
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) {
        const t = setTimeout(() => setActive(true), 600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, [force]);

  const step = STEPS[stepIdx];

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Wait for scroll to settle before measuring
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    });
  }, [step]);

  useLayoutEffect(() => {
    if (!active) return;
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    const interval = setInterval(measure, 400);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
      clearInterval(interval);
    };
  }, [active, stepIdx, measure]);

  const close = useCallback(() => {
    setActive(false);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    onClose?.();
  }, [onClose]);

  const next = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
    else close();
  };

  if (!active) return null;

  const pad = 8;
  const highlight = rect ? {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  } : null;

  // Tooltip position
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const showBelow = highlight ? (highlight.top + highlight.height + 180 < viewportH) : true;
  const tooltipTop = highlight
    ? (showBelow ? highlight.top + highlight.height + 12 : Math.max(16, highlight.top - 180))
    : viewportH / 2 - 90;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="tour-spotlight"
        aria-live="polite"
      >
        {/* Dim overlay with SVG cutout */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <mask id="rtd-tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {highlight && (
                <rect
                  x={highlight.left}
                  y={highlight.top}
                  width={highlight.width}
                  height={highlight.height}
                  rx="14"
                  ry="14"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(2,6,23,0.72)" mask="url(#rtd-tour-mask)" />
        </svg>

        {/* Glow ring around highlight */}
        {highlight && (
          <motion.div
            layout
            initial={false}
            animate={{
              top: highlight.top,
              left: highlight.left,
              width: highlight.width,
              height: highlight.height,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="absolute rounded-2xl ring-2 ring-orange-400 shadow-[0_0_0_4px_hsl(24_95%_53%/0.25),0_0_42px_hsl(24_95%_53%/0.55)] pointer-events-none"
          />
        )}

        {/* Tooltip */}
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            top: tooltipTop,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 360,
            width: 'calc(100% - 24px)',
          }}
          className="absolute pointer-events-auto rounded-2xl border border-orange-400/40 bg-card/95 backdrop-blur-xl shadow-2xl p-5"
        >
          <button
            onClick={close}
            aria-label="Skip tour"
            className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-500">
              Step {stepIdx + 1} of {STEPS.length}
            </p>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.body}</p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIdx ? 'w-6 bg-orange-500' : i < stepIdx ? 'w-3 bg-orange-300' : 'w-3 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={close} className="text-muted-foreground">
              Skip tour
            </Button>
            <Button size="sm" onClick={next} className="bg-orange-500 hover:bg-orange-600 text-white gap-1">
              {stepIdx === STEPS.length - 1 ? 'Got it' : 'Next'}
              <ArrowRight size={14} />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
