import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Apple, PlayCircle, Share2, Plus, MoreVertical, Download, Sparkles, X, Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type Platform = 'ios' | 'android';

const PENDING_KEY = 'rtd-install-prompt-pending';

export function markInstallPromptPending() {
  try { localStorage.setItem(PENDING_KEY, '1'); } catch {}
}
export function isInstallPromptPending(): boolean {
  try { return localStorage.getItem(PENDING_KEY) === '1'; } catch { return false; }
}
export function clearInstallPromptPending() {
  try { localStorage.removeItem(PENDING_KEY); } catch {}
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'ios';
  return /android/i.test(navigator.userAgent || '') ? 'android' : 'ios';
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InstallAppStep({ open, onClose }: Props) {
  const [platform, setPlatform] = useState<Platform>('ios');
  const { isInstallable, install } = usePWAInstall();

  useEffect(() => { setPlatform(detectPlatform()); }, []);

  const steps = useMemo(() => (
    platform === 'ios'
      ? [
          <>Open this site in <span className="font-medium">Safari</span></>,
          <>Tap the <span className="font-medium">Share icon</span> <Share2 className="inline w-4 h-4 -mt-0.5" /></>,
          <>Tap <span className="font-medium">"Add to Home Screen"</span> <Plus className="inline w-4 h-4 -mt-0.5" /></>,
          <>Tap <span className="font-medium">"Add"</span> to confirm</>,
        ]
      : [
          <>Open this site in <span className="font-medium">Chrome</span></>,
          <>Tap the <MoreVertical className="inline w-4 h-4 -mt-0.5" /> <span className="font-medium">menu</span></>,
          <>Tap <span className="font-medium">"Install app"</span></>,
          <>Tap <span className="font-medium">"Install"</span> to confirm</>,
        ]
  ), [platform]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg rounded-2xl border border-border/60 bg-card/80 backdrop-blur p-6 md:p-8 my-auto"
          >
            <button
              onClick={() => { clearInstallPromptPending(); onClose(); }}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted touch-target"
              aria-label="Close"
            >
              <X size={18} className="text-muted-foreground" />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Smartphone className="w-3.5 h-3.5" />
              One more step
            </div>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
              Install Ride The Tide on your phone
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We're not in the App Store — by design. Pin the app to your home screen for offline access and a full-screen experience.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {(['ios', 'android'] as Platform[]).map((p) => {
                const active = platform === p;
                const Icon = p === 'ios' ? Apple : PlayCircle;
                return (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors touch-target ${
                      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="install-step-tab"
                        className="absolute inset-0 rounded-full bg-background border border-primary/40"
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{p === 'ios' ? 'iOS' : 'Android'}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.ol
                key={platform}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-5 space-y-3"
              >
                {steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-sm text-foreground/90">{s}</p>
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
              {isInstallable ? (
                <Button
                  onClick={async () => { await install(); clearInstallPromptPending(); onClose(); }}
                  className="btn-sparkle w-full sm:w-auto gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Install Now
                </Button>
              ) : null}
              <Button
                variant="ghost"
                onClick={() => { clearInstallPromptPending(); onClose(); }}
                className="w-full sm:w-auto text-muted-foreground"
              >
                {isInstallable ? 'Skip for now' : 'Continue to dashboard'}
                <Download className="w-3.5 h-3.5 ml-1.5 opacity-0 sm:opacity-100" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
