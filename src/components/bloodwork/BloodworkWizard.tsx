import { useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileCheck, X, ArrowLeft, ArrowRight, Sparkles, Layers, Loader2,
  ShieldCheck, User, Target, ClipboardCheck, FileText, Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BloodworkStepper, StepDef } from './BloodworkStepper';
import { ScanProgress } from './ScanProgress';
import { ScanError } from './ScanError';
import type { ScanFormState, Goal, Sex } from './ScanForm';
import { GOALS } from './ScanForm';
import type { ScanStage } from '@/hooks/useScanProgress';

const STEPS: StepDef[] = [
  { id: 1, title: 'Upload' },
  { id: 2, title: 'About you' },
  { id: 3, title: 'Goals' },
  { id: 4, title: 'Review & scan' },
];

const MAX_GOALS = 3;

interface Props {
  state: ScanFormState;
  onChange: (next: ScanFormState) => void;
  running: 'baseline' | 'deep' | null;
  error: string | null;
  progress: { stage: ScanStage; label: string; percent: number };
  onRun: (tier: 'baseline' | 'deep') => void;
  onCancel: () => void;
  onRetry: () => void;
  onResetUpload: () => void;
}

export function BloodworkWizard({
  state, onChange, running, error, progress, onRun, onCancel, onRetry, onResetUpload,
}: Props) {
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);

  const stepValid = useMemo(() => {
    if (step === 1) return !!state.file;
    if (step === 2) return true; // optional
    if (step === 3) return state.goals.length > 0 && state.peptideHistoryUsed !== null;
    return true;
  }, [step, state]);

  const goNext = useCallback(() => {
    if (!stepValid) return;
    const next = Math.min(step + 1, STEPS.length);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  }, [step, stepValid]);

  const goBack = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);

  // While scan is running or error, show progress overlay over the wizard body
  const isScanning = running !== null;

  return (
    <>
      <BloodworkStepper steps={STEPS} current={step} maxReached={maxReached} onJump={setStep} />

      <main className="max-w-3xl mx-auto px-4 pt-8 pb-32 md:pb-12">
        <AnimatePresence mode="wait">
          {isScanning || error ? (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {error ? (
                <ScanError message={error} onRetry={onRetry} onReset={() => { onResetUpload(); setStep(1); }} />
              ) : (
                <ScanProgress {...progress} onCancel={onCancel} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && <StepUpload state={state} onChange={onChange} />}
              {step === 2 && <StepAbout state={state} onChange={onChange} />}
              {step === 3 && <StepGoals state={state} onChange={onChange} />}
              {step === 4 && <StepReview state={state} running={running} onRun={onRun} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer nav — hidden on scan-running / step 4 (tier cards have their own CTA) */}
      {!isScanning && !error && step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 md:static md:mt-4 z-20 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t border-border/50 md:border-0">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 1}
              className="gap-1"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <div className="flex-1 text-center text-[11px] text-muted-foreground">
              {!stepValid && step === 1 && 'Upload a file to continue'}
              {!stepValid && step === 3 && 'Pick at least one goal and answer peptide history'}
            </div>
            <Button onClick={goNext} disabled={!stepValid} className="gap-1">
              Continue <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && !isScanning && !error && (
        <div className="md:hidden h-4" />
      )}
    </>
  );
}

/* =========================================================
   STEP 1 — UPLOAD
========================================================= */
function StepUpload({ state, onChange }: { state: ScanFormState; onChange: (s: ScanFormState) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const setFile = (file: File | null) => onChange({ ...state, file });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const isPdf = state.file?.type === 'application/pdf';

  return (
    <div>
      <StepHeader
        icon={Upload}
        eyebrow="Step 1 of 4"
        title="Upload your bloodwork"
        subtitle="A PDF or photo of your lab report. English or German."
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => !state.file && fileRef.current?.click()}
        className={cn(
          'mt-8 rounded-2xl border-2 transition-all',
          state.file ? 'border-primary/40 bg-primary/5 p-5' : 'border-dashed cursor-pointer p-10 text-center',
          !state.file && (drag
            ? 'border-primary bg-primary/10'
            : 'border-border/60 hover:border-primary/60 hover:bg-primary/5')
        )}
        role={state.file ? undefined : 'button'}
        tabIndex={state.file ? -1 : 0}
      >
        {state.file ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              {isPdf ? <FileText size={22} className="text-primary" /> : <ImageIcon size={22} className="text-primary" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <FileCheck size={14} className="text-primary shrink-0" />
                <p className="text-sm font-semibold text-foreground truncate">{state.file.name}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(state.file.size / 1024 / 1024).toFixed(2)} MB · ready to scan
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload size={24} className="text-primary" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Drag & drop your file here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or <span className="text-primary underline">browse from your device</span>
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
              {['PDF', 'JPG', 'PNG', 'HEIC'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {t}
                </span>
              ))}
              <span className="text-[11px] text-muted-foreground">· up to 10MB</span>
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />
      </div>

      <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck size={14} className="text-primary mt-0.5 shrink-0" />
        <p>
          Your file is encrypted in transit and at rest. Used only to generate your protocol — never shared.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 2 — ABOUT YOU
========================================================= */
function StepAbout({ state, onChange }: { state: ScanFormState; onChange: (s: ScanFormState) => void }) {
  return (
    <div>
      <StepHeader
        icon={User}
        eyebrow="Step 2 of 4"
        title="Tell us about you"
        subtitle="Helps us tune biomarker ranges. Optional — skip to use general ranges."
      />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="bw-age">Age</Label>
          <Input
            id="bw-age"
            type="number"
            min={1}
            max={120}
            placeholder="e.g. 34"
            value={state.age}
            onChange={(e) => onChange({ ...state, age: e.target.value })}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label>Sex at birth</Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { v: 'male', l: 'Male' },
                { v: 'female', l: 'Female' },
                { v: 'na', l: 'Skip' },
              ] as { v: Sex; l: string }[]
            ).map((opt) => {
              const active = state.sex === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => onChange({ ...state, sex: opt.v })}
                  className={cn(
                    'h-11 rounded-lg text-sm font-medium border transition-all',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card/40 border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground'
                  )}
                >
                  {opt.l}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 3 — GOALS + PEPTIDE HISTORY
========================================================= */
function StepGoals({ state, onChange }: { state: ScanFormState; onChange: (s: ScanFormState) => void }) {
  const toggleGoal = (g: Goal) => {
    if (state.goals.includes(g)) {
      onChange({ ...state, goals: state.goals.filter((x) => x !== g) });
    } else if (state.goals.length < MAX_GOALS) {
      onChange({ ...state, goals: [...state.goals, g] });
    }
  };

  const remaining = MAX_GOALS - state.goals.length;

  return (
    <div>
      <StepHeader
        icon={Target}
        eyebrow="Step 3 of 4"
        title="What are you optimizing for?"
        subtitle={`Pick up to ${MAX_GOALS} goals. Your protocol focuses on these.`}
      />

      <div className="mt-2 mb-5 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Goals · {state.goals.length}/{MAX_GOALS} selected
        </span>
        {remaining === 0 && (
          <span className="text-[11px] text-primary font-semibold">Max reached</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {GOALS.map((g) => {
          const active = state.goals.includes(g);
          const disabled = !active && state.goals.length >= MAX_GOALS;
          return (
            <button
              key={g}
              type="button"
              disabled={disabled}
              onClick={() => toggleGoal(g)}
              className={cn(
                'px-3 py-3 rounded-xl text-sm font-medium border transition-all text-left',
                active
                  ? 'bg-primary/10 text-foreground border-primary shadow-sm'
                  : disabled
                    ? 'bg-card/30 text-muted-foreground/50 border-border/40 cursor-not-allowed'
                    : 'bg-card/40 text-muted-foreground border-border/60 hover:border-primary/60 hover:text-foreground'
              )}
            >
              {g}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <h4 className="text-sm font-semibold text-foreground mb-1">Have you used peptides before?</h4>
        <p className="text-xs text-muted-foreground mb-3">Helps us avoid suggesting compounds you've already cycled.</p>
        <div className="flex gap-2">
          {(['Yes', 'No'] as const).map((opt) => {
            const v = opt === 'Yes';
            const active = state.peptideHistoryUsed === v;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ ...state, peptideHistoryUsed: v })}
                className={cn(
                  'flex-1 max-w-[140px] py-3 rounded-lg text-sm font-semibold border transition-all',
                  active
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card/40 border-border/60 text-muted-foreground hover:border-primary/60'
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {state.peptideHistoryUsed === true && (
          <Textarea
            value={state.peptideHistoryNotes}
            onChange={(e) => onChange({ ...state, peptideHistoryNotes: e.target.value })}
            placeholder="Which peptides, doses, and how long? e.g. Retatrutide 4mg/wk for 2 months, BPC-157 250mcg/day for 6 weeks."
            className="mt-3 min-h-[100px] bg-card/40"
            maxLength={1000}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STEP 4 — REVIEW & TIER PICK
========================================================= */
function StepReview({
  state, running, onRun,
}: {
  state: ScanFormState;
  running: 'baseline' | 'deep' | null;
  onRun: (t: 'baseline' | 'deep') => void;
}) {
  return (
    <div>
      <StepHeader
        icon={ClipboardCheck}
        eyebrow="Step 4 of 4"
        title="Review & run your scan"
        subtitle="Confirm your details and pick a scan depth."
      />

      {/* Summary card */}
      <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-5">
        <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-4">Your details</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <SummaryRow label="File" value={state.file?.name ?? '—'} />
          <SummaryRow label="Age" value={state.age || 'Not provided'} />
          <SummaryRow
            label="Sex"
            value={state.sex === 'male' ? 'Male' : state.sex === 'female' ? 'Female' : 'Not provided'}
          />
          <SummaryRow label="Peptide history" value={state.peptideHistoryUsed === null ? '—' : state.peptideHistoryUsed ? 'Yes' : 'No'} />
        </dl>
        <div className="mt-3 pt-3 border-t border-border/40">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Goals</p>
          <div className="flex flex-wrap gap-1.5">
            {state.goals.length === 0 ? (
              <span className="text-xs text-muted-foreground">None selected</span>
            ) : state.goals.map((g) => (
              <span key={g} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/30">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TierCard
          title="Baseline Scan"
          icon={Sparkles}
          duration="< 60 seconds"
          biomarkers="Key biomarkers"
          followups="No follow-ups"
          description="Instant biomarker extraction with personalised health insights and a curated peptide stack."
          cta="Run Baseline"
          running={running === 'baseline'}
          disabled={running !== null}
          onClick={() => onRun('baseline')}
          accent="muted"
        />
        <TierCard
          title="Deep Decode"
          icon={Layers}
          duration="2–3 minutes"
          biomarkers="32 biomarkers · 8 panels"
          followups="4 follow-ups · 12 months"
          description="Full health report scored by category with a personalised optimisation protocol."
          cta="Run Deep Decode"
          running={running === 'deep'}
          disabled={running !== null}
          onClick={() => onRun('deep')}
          accent="primary"
          recommended
        />
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground italic text-center">
        For informational purposes only — not medical advice.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 min-w-0">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold w-24 shrink-0">{label}</dt>
      <dd className="text-sm text-foreground truncate">{value}</dd>
    </div>
  );
}

function TierCard({
  title, icon: Icon, duration, biomarkers, followups, description, cta,
  running, disabled, onClick, accent, recommended,
}: {
  title: string;
  icon: React.ElementType;
  duration: string;
  biomarkers: string;
  followups: string;
  description: string;
  cta: string;
  running: boolean;
  disabled: boolean;
  onClick: () => void;
  accent: 'primary' | 'muted';
  recommended?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border p-5 flex flex-col transition-all',
        accent === 'primary'
          ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-card/40 shadow-lg shadow-primary/5'
          : 'border-border/60 bg-card/50'
      )}
    >
      {recommended && (
        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-md">
          Recommended
        </span>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-primary" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      <ul className="mt-4 space-y-1.5 text-xs">
        <SpecRow label="Duration" value={duration} />
        <SpecRow label="Coverage" value={biomarkers} />
        <SpecRow label="Follow-ups" value={followups} />
      </ul>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'mt-5 w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold uppercase tracking-wider transition-all',
          disabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : accent === 'primary'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
              : 'bg-foreground text-background hover:opacity-90'
        )}
      >
        {running ? (
          <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
        ) : (
          <>{cta} <ArrowRight size={14} /></>
        )}
      </button>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2 text-muted-foreground">
      <span className="uppercase tracking-wider text-[10px] font-semibold">{label}</span>
      <span className="text-foreground font-medium text-xs">{value}</span>
    </li>
  );
}

/* =========================================================
   Shared header
========================================================= */
function StepHeader({
  icon: Icon, eyebrow, title, subtitle,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
        <Icon size={12} className="text-primary" />
        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{eyebrow}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">{subtitle}</p>
    </div>
  );
}
