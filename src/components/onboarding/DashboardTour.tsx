import { useEffect, useLayoutEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getDoseLogs, getActiveStack, getUserProfile } from '@/services/storage';
import { getGoalLabels } from '@/data/goalMap';

const GLOBAL_KEY = 'rtd-dashboard-tour-done';
const userKey = (uid?: string | null) => `rtd-dashboard-tour-done:${uid || 'anon'}`;

export const dashboardTourStorageKey = GLOBAL_KEY;

export function resetDashboardTour(userId?: string | null) {
  try {
    localStorage.removeItem(GLOBAL_KEY);
    if (userId !== undefined) localStorage.removeItem(userKey(userId));
    // also clear any stale per-user keys
    Object.keys(localStorage)
      .filter((k) => k.startsWith('rtd-dashboard-tour-done:'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}

interface TourStep {
  target?: string;
  title: string;
  body: string;
  benefit: string;
}

/**
 * Build tour steps personalised to the user's profile (goals + experience).
 * We inject a "For your <goal> goal…" sentence + tailor the benefit line
 * so each dashboard feature is framed against what the user is trying to achieve.
 */
function buildSteps(profile: ReturnType<typeof getUserProfile> | null): TourStep[] {
  const goals = profile?.goals ?? [];
  const goalLabels = getGoalLabels(goals);
  const primaryGoal = goalLabels[0];
  const experience = profile?.experience ?? 'beginner';
  const expLabel =
    experience === 'advanced' ? 'advanced' : experience === 'intermediate' ? 'intermediate' : 'beginner';

  const goalLine = primaryGoal
    ? `Tailored for your ${primaryGoal.toLowerCase()} goal at ${expLabel} level.`
    : `Set your goals in Profile to personalise this further.`;

  // Goal-specific benefit copy for the Active Stack step
  const stackBenefitByGoal: Record<string, string> = {
    'fat-loss': 'Helps you: sequence GLP-1s + metabolic peptides safely across your cut.',
    'muscle-gain': 'Helps you: time GH-secretagogues with training days for lean gains.',
    'recovery': 'Helps you: layer BPC-157/TB-500 healing cycles without overlap.',
    'longevity': 'Helps you: run long-arc epithalon/MOTS-c cycles with proper breaks.',
    'cognitive': 'Helps you: rotate nootropic peptides on structured on/off weeks.',
    'energy': 'Helps you: stack metabolic + GH peptides for daily performance.',
    'sleep': 'Helps you: dose evening peptides (CJC/Ipamorelin) at the right window.',
    'metabolic': 'Helps you: track metabolic peptide cycles and bloodwork response.',
  };
  const stackBenefit =
    (goals[0] && stackBenefitByGoal[goals[0]]) ||
    'Helps you: run safe, structured cycles without losing track of where you are.';

  // Beginner vs advanced framing on the reminders/quick-actions copy
  const remindersBody =
    experience === 'beginner'
      ? 'Push alerts for each dose, snoozeable and per-peptide. Perfect while you build the habit.'
      : 'Push alerts per-peptide with lead-time and split-dose support — configurable at the peptide level.';

  return [
    {
      target: 'welcome-header',
      title: primaryGoal ? `Your ${primaryGoal} Dashboard` : 'Welcome to your Dashboard',
      body: `This is your home base — every peptide tool, log, reminder, and result lives here. ${goalLine}`,
      benefit: 'Helps you: stay organised across every protocol from a single screen.',
    },
    {
      target: 'todays-doses',
      title: "Today's Doses",
      body: 'See what you need to inject or dose today, in mg/IU/units. Tap a dose to log it in seconds.',
      benefit:
        experience === 'beginner'
          ? 'Helps you: build the daily habit that drives 90% of peptide results.'
          : 'Helps you: hit >95% adherence — the #1 driver of measurable results.',
    },
    {
      target: 'active-stack',
      title: 'Your Active Stack',
      body: 'A live view of your current protocol — peptides, doses, timing, and cycle progress at a glance.',
      benefit: stackBenefit,
    },
    {
      target: 'reminders',
      title: 'Smart Reminders',
      body: remindersBody,
      benefit: 'Helps you: never miss a dose, even on split-dose or twice-weekly protocols.',
    },
    {
      target: 'quick-actions',
      title: 'Quick Actions',
      body: 'Jump into Dose Tracker, Body Stats, Cycles, Peptides, Bloodwork, and Inventory in one tap.',
      benefit: primaryGoal
        ? `Helps you: reach the tools that matter for ${primaryGoal.toLowerCase()} in ≤2 taps.`
        : 'Helps you: reach any tool in ≤2 taps, from anywhere on the dashboard.',
    },
    {
      target: 'bottom-nav',
      title: 'Bottom Navigation',
      body: 'Home, Peptides, Log, Stack, and More — always one tap away at the bottom of your screen.',
      benefit: 'Helps you: move between core features without scrolling or menus.',
    },
    {
      target: 'profile-avatar',
      title: 'Profile & Settings',
      body: 'Your account, notification preferences, data export, and sign-out all live in the top-right avatar.',
      benefit: 'Helps you: personalise reminders and keep your research data yours.',
    },
  ];
}

interface Rect { top: number; left: number; width: number; height: number; }

interface DashboardTourProps {
  force?: boolean;
  onClose?: () => void;
}

export function DashboardTour({ force = false, onClose }: DashboardTourProps) {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : true
  );

  useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  // Mount decision — one-time, with backfill for existing users
  useEffect(() => {
    if (force) { setActive(true); setStepIdx(0); return; }
    try {
      if (localStorage.getItem(GLOBAL_KEY) || localStorage.getItem(userKey(uid))) return;

      // Backfill: existing users who've already used the app shouldn't see it
      const hasHistory =
        (getDoseLogs()?.length ?? 0) > 0 ||
        (getActiveStack()?.length ?? 0) > 0;
      if (hasHistory) {
        localStorage.setItem(GLOBAL_KEY, 'true');
        localStorage.setItem(userKey(uid), 'true');
        return;
      }

      const t = setTimeout(() => setActive(true), 700);
      return () => clearTimeout(t);
    } catch {}
  }, [force, uid]);

  const STEPS = useMemo(() => {
    try { return buildSteps(getUserProfile()); } catch { return buildSteps(null); }
  }, [uid, active]);
  const step = STEPS[stepIdx];
  const pct = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  const measure = useCallback(() => {
    if (!step?.target) { setRect(null); return; }
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) { setRect(null); return; }
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch {}
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
    const interval = setInterval(measure, 500);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
      clearInterval(interval);
    };
  }, [active, stepIdx, measure]);

  const close = useCallback(() => {
    setActive(false);
    try {
      localStorage.setItem(GLOBAL_KEY, 'true');
      localStorage.setItem(userKey(uid), 'true');
    } catch {}
    onClose?.();
  }, [onClose, uid]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMobile) close();
      if (e.key === 'ArrowRight') setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setStepIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, isMobile, close]);

  const next = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
    else close();
  };
  const prev = () => { if (stepIdx > 0) setStepIdx(stepIdx - 1); };

  const highlight = useMemo(() => {
    if (!rect) return null;
    const pad = 8;
    return {
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    };
  }, [rect]);

  if (!active) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
        aria-live="polite"
        role="dialog"
        aria-modal="true"
        aria-label={`Dashboard tour, step ${stepIdx + 1} of ${STEPS.length}`}
      >
        {/* Dim overlay with SVG cutout — blocks pointer events */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto" aria-hidden="true">
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
          <rect width="100%" height="100%" fill="rgba(2,6,23,0.78)" mask="url(#rtd-tour-mask)" />
        </svg>

        {/* Glow ring around highlight */}
        {highlight && (
          <motion.div
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

        {/* Card — bottom sheet on mobile, centered on desktop */}
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: isMobile ? 40 : 20, scale: isMobile ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className={
            isMobile
              ? 'absolute left-0 right-0 bottom-0 pointer-events-auto rounded-t-3xl border-t border-orange-400/40 bg-card/98 backdrop-blur-xl shadow-2xl'
              : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto rounded-2xl border border-orange-400/40 bg-card/98 backdrop-blur-xl shadow-2xl w-[min(440px,calc(100%-32px))]'
          }
          style={
            isMobile
              ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }
              : undefined
          }
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-500">
                    Dashboard Tour
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    Step {stepIdx + 1} of {STEPS.length}
                    <span className="text-orange-500 font-semibold">· {pct}%</span>
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-1 mx-3 max-w-[140px] items-center">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close tour"
                className="p-2 -m-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1.5 leading-tight">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {step.body}
            </p>

            <div className="flex items-start gap-2 rounded-xl bg-orange-500/10 border border-orange-400/30 px-3 py-2.5 mb-4">
              <Target size={14} className="text-orange-500 mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/90 leading-relaxed">
                {step.benefit}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStepIdx(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIdx
                      ? 'w-8 bg-orange-500'
                      : i < stepIdx
                      ? 'w-3 bg-orange-300'
                      : 'w-3 bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {stepIdx > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prev}
                  className="h-11 min-w-[44px] gap-1"
                  aria-label="Previous step"
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={close}
                  className="h-11 text-muted-foreground"
                >
                  Skip
                </Button>
              )}
              <Button
                size="sm"
                onClick={next}
                className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white gap-1.5 font-semibold"
              >
                {stepIdx === STEPS.length - 1 ? "Got it — let's go" : 'Next'}
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
