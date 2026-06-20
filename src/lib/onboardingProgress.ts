import { track } from './analytics';

export type OnboardingStepId =
  | 'account_created'
  | 'install_viewed'
  | 'install_attempted'
  | 'install_completed'
  | 'profile_setup'
  | 'first_dose_logged'
  | 'dashboard_tour';

export const ONBOARDING_STEPS: { id: OnboardingStepId; label: string }[] = [
  { id: 'account_created', label: 'Create your account' },
  { id: 'install_viewed', label: 'View install guide' },
  { id: 'install_attempted', label: 'Add to Home Screen' },
  { id: 'install_completed', label: 'Open from your Home Screen' },
  { id: 'profile_setup', label: 'Complete your profile' },
  { id: 'first_dose_logged', label: 'Log your first dose' },
  { id: 'dashboard_tour', label: 'Take the dashboard tour' },
];

type Progress = Record<OnboardingStepId, { completedAt: number; meta?: unknown } | undefined>;

const STORAGE_PREFIX = 'rtd-onboarding-progress:';
const EVENT = 'rtd-onboarding-progress';

function key(userId?: string | null) {
  return STORAGE_PREFIX + (userId || 'anon');
}

export function getProgress(userId?: string | null): Progress {
  try {
    const raw = localStorage.getItem(key(userId));
    if (!raw) return {} as Progress;
    return JSON.parse(raw) as Progress;
  } catch {
    return {} as Progress;
  }
}

export function isComplete(id: OnboardingStepId, userId?: string | null): boolean {
  return Boolean(getProgress(userId)[id]);
}

export function markStep(id: OnboardingStepId, opts?: { userId?: string | null; meta?: unknown }) {
  const userId = opts?.userId ?? null;
  const progress = getProgress(userId);
  if (progress[id]) return; // dedupe
  progress[id] = { completedAt: Date.now(), meta: opts?.meta };
  try { localStorage.setItem(key(userId), JSON.stringify(progress)); } catch {}
  const total = ONBOARDING_STEPS.length;
  const completed = Object.keys(progress).length;
  track('onboarding_step_completed', { step: id, completed, total });
  if (completed === total) track('onboarding_completed', { total });
  try { window.dispatchEvent(new CustomEvent(EVENT, { detail: { id, userId } })); } catch {}
}

export function subscribe(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function resetProgress(userId?: string | null) {
  try { localStorage.removeItem(key(userId)); } catch {}
  try { window.dispatchEvent(new CustomEvent(EVENT, { detail: { reset: true, userId } })); } catch {}
}
