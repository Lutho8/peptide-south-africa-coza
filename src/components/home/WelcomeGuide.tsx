import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X, ArrowRight, Syringe, BarChart3, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetDashboardTour } from '@/components/onboarding/DashboardTour';

interface WelcomeGuideProps {
  onDoseTracker: () => void;
  onBodyStats: () => void;
  onCycles: () => void;
  onResearch?: () => void;
}

const STORAGE_KEY = 'rtd-welcome-dismissed';

export function WelcomeGuide({ onDoseTracker, onBodyStats, onCycles, onResearch }: WelcomeGuideProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY);
    if (!wasDismissed) setDismissed(false);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const steps = [
    {
      icon: Syringe,
      title: 'Log Your First Dose',
      description: 'Track peptide doses with reminders',
      action: onDoseTracker,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      icon: BarChart3,
      title: 'Record Body Stats',
      description: 'Monitor weight & body composition',
      action: onBodyStats,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Calendar,
      title: 'Set Up a Cycle',
      description: 'Plan your peptide protocol',
      action: onCycles,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      icon: BookOpen,
      title: 'Explore Research',
      description: 'Browse 98+ peptide profiles',
      action: onResearch || (() => {}),
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4 relative w-full max-w-md mx-auto">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors touch-target flex items-center justify-center"
              aria-label="Dismiss welcome guide"
            >
              <X size={16} className="text-muted-foreground" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Rocket size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Quick Start Guide</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              New here? Get started in 4 easy steps:
            </p>

            <Button
              size="sm"
              onClick={() => {
                resetDashboardTour();
                window.dispatchEvent(new CustomEvent('rtd-start-tour'));
              }}
              className="btn-sparkle w-full mb-3 gap-1.5"
            >
              <Sparkles size={14} />
              Take the 60-second guided tour
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => { step.action(); handleDismiss(); }}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-all text-left touch-target"
                >
                  <div className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center shrink-0`}>
                    <step.icon size={16} className={step.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground leading-tight">{step.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{step.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              I know my way around
              <ArrowRight size={12} className="ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
