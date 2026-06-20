import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const KEY = 'rtd_bloodwork_onboarded_v1';

const STEPS = [
  { title: 'Your system view', body: 'Six body systems summarised from your biomarkers. Tap any card to filter the panel.' },
  { title: 'Patterns we detected', body: 'Combinations of markers that often appear together. Each pattern suggests peptides to research.' },
  { title: 'Build & buy your stack', body: 'Add peptides from patterns or the protocol section. Your cart sits at the bottom — buy in one tap.' },
];

export function BloodworkOnboarding() {
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setStep(0);
    } catch {
      /* noop */
    }
  }, []);

  const close = () => {
    setStep(null);
    try { localStorage.setItem(KEY, '1'); } catch { /* noop */ }
  };

  const next = () => {
    if (step === null) return;
    if (step >= STEPS.length - 1) return close();
    setStep(step + 1);
  };

  return (
    <AnimatePresence>
      {step !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-primary/30 bg-card p-6 shadow-2xl"
          >
            <button onClick={close} aria-label="Skip" className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
            <p className="font-mono text-[10px] tracking-widest text-primary uppercase mb-2">
              Tour · {step + 1}/{STEPS.length}
            </p>
            <h3 className="text-lg font-bold text-foreground">{STEPS[step].title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{STEPS[step].body}</p>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <span key={i} className={`h-1.5 w-6 rounded-full ${i === step ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                {step === STEPS.length - 1 ? 'Got it' : 'Next'} <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
