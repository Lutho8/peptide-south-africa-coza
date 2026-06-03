import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Apple, PlayCircle, WifiOff, Monitor, RefreshCw, ShieldCheck,
  Share2, Plus, MoreVertical, Download, CheckCircle2, Sparkles, ArrowRight,
  AlertCircle, Copy, QrCode, Wifi,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { detectPlatform, isStandalone, getInstallCtaState, chromeIntentUrl, type Platform } from '@/lib/pwaInstall';
import { track } from '@/lib/analytics';
import { markStep } from '@/lib/onboardingProgress';
import { OfflineReadyBadge } from '@/components/pwa/OfflineReadyBadge';
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist';
import { useAuth } from '@/contexts/AuthContext';
import iosShot from '@/assets/install-ios.png';
import androidShot from '@/assets/install-android.png';

type TabKey = 'ios' | 'android';

const benefits = [
  { icon: WifiOff, title: 'Works offline', body: 'Core dose tracking & peptide references without internet.' },
  { icon: Monitor, title: 'Full-screen', body: 'No browser bar — feels like a native app.' },
  { icon: RefreshCw, title: 'Auto-updates', body: 'Always the latest version, no store waits.' },
  { icon: Smartphone, title: 'Same experience', body: 'Identical on iPhone and Android.' },
];

const offlineWorks = ['Dose tracker & history', 'Peptide profiles & references', 'Reminders & cycle status', 'Bloodwork drafts'];
const offlineNeedsNet = ['Cloud sync across devices', 'AI peptide agent', 'COA uploads & verification'];

function tabFromPlatform(p: Platform): TabKey {
  return p.startsWith('android') ? 'android' : 'ios';
}

export function PWAInstallJourney() {
  const { user } = useAuth();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [tab, setTab] = useState<TabKey>('ios');
  const [iosConfirmed, setIosConfirmed] = useState(false);
  const viewedOnce = useRef(false);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    setTab(tabFromPlatform(p));
    track('install_platform_detected', { platform: p, isInstallable, isStandalone: isStandalone() });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ctaState = useMemo(
    () => getInstallCtaState({ isInstallable, isInstalled, platform }),
    [isInstallable, isInstalled, platform]
  );

  const onJourneyInView = () => {
    if (viewedOnce.current) return;
    viewedOnce.current = true;
    track('install_journey_viewed', { platform, userId: user?.id ?? null });
    markStep('install_viewed', { userId: user?.id });
  };

  const switchTab = (next: TabKey) => {
    if (next === tab) return;
    track('install_tab_switched', { from: tab, to: next });
    setTab(next);
  };

  const scrollToSteps = () => {
    document.getElementById('pwa-install-steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ridethetide.info');
      track('install_link_copied', { platform });
    } catch {}
  };

  const selfReportInstall = () => {
    setIosConfirmed(true);
    track('install_self_reported', { platform });
    markStep('install_attempted', { meta: { self: true } });
  };

  return (
    <motion.section
      className="relative overflow-hidden"
      onViewportEnter={onJourneyInView}
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* HERO */}
      <div className="relative py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground">
                <Smartphone className="w-3.5 h-3.5 text-primary" />
                Progressive Web App
              </span>
              <OfflineReadyBadge />
            </div>

            <h2 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Get Ride The Tide on{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Phone</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Install directly to your home screen. No app store needed.
            </p>

            {/* Disabled store cards */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              {[
                { Icon: Apple, name: 'App Store' },
                { Icon: PlayCircle, name: 'Google Play' },
              ].map(({ Icon, name }) => (
                <div key={name} className="relative w-full sm:w-56 rounded-xl border border-border/50 bg-card/30 backdrop-blur px-4 py-3 flex items-center gap-3 opacity-60 select-none">
                  <Icon className="w-7 h-7 text-muted-foreground shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Not on</p>
                    <p className="text-sm font-semibold text-muted-foreground">{name}</p>
                  </div>
                  <span className="absolute top-1.5 right-2 text-[9px] uppercase tracking-wider text-muted-foreground/70">Unavailable</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground/80">
              Not available in app stores — and <span className="text-primary">that's by design.</span>
            </p>

            {/* Primary CTA driven by state machine */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {ctaState.kind === 'installed' && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Installed on this device
                </div>
              )}
              {ctaState.kind === 'native-prompt' && (
                <Button size="lg" onClick={() => install('hero')} className="btn-sparkle gap-2">
                  <Sparkles className="w-4 h-4" />
                  Install Now
                </Button>
              )}
              {ctaState.kind === 'manual' && (
                <Button size="lg" onClick={scrollToSteps} className="gap-2">
                  Install in 30 seconds
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* BY DESIGN + benefits + offline panel */}
      <div className="py-16 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Not on the App Store. By design.
              </h3>
              <div className="mt-5 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>We built a fully native app first. Apple and Google asked us to remove the safety engine, peptide interaction warnings, and dosing logic to pass review. Every removal made the app safer for them and less useful for you.</p>
                <p>The peptide apps that made it through review did so by stripping themselves of what matters. That's not what this community needs.</p>
                <p>A PWA lets us ship the real product — the depth this research space deserves — without permission from a review board that doesn't understand it yet.</p>
                <p className="text-primary font-semibold">Small initial friction. Exponential gains.</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <motion.div key={b.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-4">
                  <b.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.body}</p>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.25 }}
                className="sm:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur p-4">
                <ShieldCheck className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-semibold text-foreground">No gatekeeping</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Safety engine, interaction warnings, and dosing logic live free and fully here.</p>
              </motion.div>
            </div>
          </div>

          {/* Offline panel */}
          <div className="max-w-5xl mx-auto mt-10 rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                <h4 className="text-base md:text-lg font-semibold text-foreground">What works offline</h4>
              </div>
              <OfflineReadyBadge />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="space-y-1.5 text-sm text-foreground/90">
                {offlineWorks.map(w => (
                  <li key={w} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{w}</li>
                ))}
              </ul>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {offlineNeedsNet.map(w => (
                  <li key={w} className="flex items-start gap-2"><WifiOff className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* INSTALL STEPS */}
      <div id="pwa-install-steps" className="py-16 md:py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Install in 30 seconds</h3>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">Choose your device to see the steps.</p>
          </motion.div>

          {/* Platform warning chips */}
          {platform === 'ios-non-safari' && (
            <div className="mt-6 max-w-3xl mx-auto rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium">Add to Home Screen only works in Safari on iOS.</p>
                <p className="text-muted-foreground mt-0.5">Copy the link and open it in Safari to install.</p>
                <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={copyLink}>
                  <Copy className="w-3.5 h-3.5" /> Copy link
                </Button>
              </div>
            </div>
          )}
          {platform === 'android-other' && (
            <div className="mt-6 max-w-3xl mx-auto rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium">For the smoothest install, open in Chrome.</p>
                <p className="text-muted-foreground mt-0.5">Other Android browsers use "Add to Home screen" with fewer features.</p>
                <a href={chromeIntentUrl()} className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary hover:underline">
                  Open in Chrome <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
          {platform === 'desktop' && (
            <div className="mt-6 max-w-3xl mx-auto rounded-xl border border-border/50 bg-card/40 p-4 flex items-start gap-3">
              <QrCode className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium">Open this page on your phone to install.</p>
                <p className="text-muted-foreground mt-0.5">Visit <span className="text-primary">ridethetide.info</span> from Safari (iOS) or Chrome (Android).</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {(['ios', 'android'] as TabKey[]).map((p) => {
              const active = tab === p;
              const Icon = p === 'ios' ? Apple : PlayCircle;
              const label = p === 'ios' ? 'iOS (Safari)' : 'Android (Chrome)';
              return (
                <button key={p} onClick={() => switchTab(p)}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors touch-target ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {active && (
                    <motion.span layoutId="pwa-tab-bg"
                      className="absolute inset-0 rounded-full bg-card border border-primary/40"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }} />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-start">
            {/* Steps card */}
            <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6 md:p-8">
              <div className="flex items-center gap-2 text-foreground">
                {tab === 'ios' ? <Apple className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                <span className="font-semibold">{tab === 'ios' ? 'iOS — Safari only' : 'Android — Chrome'}</span>
              </div>

              <AnimatePresence mode="wait">
                {tab === 'ios' ? (
                  <IosSteps key="ios" onStepView={(step) => track('install_step_viewed', { platform: 'ios', step })} />
                ) : (
                  <AndroidSteps key="android" onStepView={(step) => track('install_step_viewed', { platform: 'android', step })} />
                )}
              </AnimatePresence>

              {/* CTAs at bottom */}
              {tab === 'android' && isInstallable && (
                <div className="mt-6 pt-6 border-t border-border/50 flex justify-center">
                  <Button onClick={() => install('steps')} size="lg" className="btn-sparkle gap-2">
                    <Download className="w-4 h-4" />
                    Install Now
                  </Button>
                </div>
              )}
              {tab === 'ios' && (
                <div className="mt-6 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-center items-center gap-3">
                  {iosConfirmed || isInstalled ? (
                    <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" /> Marked as added — open it from your Home Screen.
                    </div>
                  ) : (
                    <Button onClick={selfReportInstall} variant="outline" size="lg" className="gap-2">
                      <CheckCircle2 className="w-4 h-4" /> I've added it to my Home Screen
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Illustration */}
            <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-3 md:p-4 flex items-center justify-center">
              <img
                src={tab === 'ios' ? iosShot : androidShot}
                alt={tab === 'ios' ? 'iOS Safari Add to Home Screen flow' : 'Android Chrome Install app flow'}
                loading="lazy" width={1024} height={1024}
                className="w-full h-auto max-w-[360px] rounded-xl"
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already installed? <a href="/" className="text-primary hover:underline">Open the app →</a>
          </p>

          {user && (
            <div className="mt-10 max-w-2xl mx-auto">
              <OnboardingChecklist />
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/* ---- Step lists ---- */

function StepRow({ index, onView, children }: { index: number; onView: (n: number) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el || fired.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !fired.current) { fired.current = true; onView(index); obs.disconnect(); }
      });
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onView]);
  return (
    <motion.li ref={ref} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }} className="flex items-start gap-4">
      <span className="flex-shrink-0 w-9 h-9 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
        {index}
      </span>
      <p className="pt-1.5 text-sm md:text-base text-foreground/90">{children}</p>
    </motion.li>
  );
}

function IosSteps({ onStepView }: { onStepView: (n: number) => void }) {
  return (
    <motion.ol initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-6 space-y-4">
      <StepRow index={1} onView={onStepView}>
        Open <span className="text-primary font-medium">ridethetide.info</span> in <span className="font-medium">Safari</span> (not Chrome or any in-app browser).
      </StepRow>
      <StepRow index={2} onView={onStepView}>
        Tap the <span className="font-medium">Share</span> button <Share2 className="inline w-4 h-4 -mt-0.5" /> (square with up arrow) in the bottom bar — top-right on iPad.
      </StepRow>
      <StepRow index={3} onView={onStepView}>
        Scroll and tap <span className="font-medium">"Add to Home Screen"</span> <Plus className="inline w-4 h-4 -mt-0.5" />.
      </StepRow>
      <StepRow index={4} onView={onStepView}>
        Edit the name if you'd like, then tap <span className="font-medium">"Add"</span> in the top-right.
      </StepRow>
    </motion.ol>
  );
}

function AndroidSteps({ onStepView }: { onStepView: (n: number) => void }) {
  return (
    <motion.ol initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-6 space-y-4">
      <StepRow index={1} onView={onStepView}>
        Open <span className="text-primary font-medium">ridethetide.info</span> in <span className="font-medium">Chrome</span>.
      </StepRow>
      <StepRow index={2} onView={onStepView}>
        Tap the <MoreVertical className="inline w-4 h-4 -mt-0.5" /> <span className="font-medium">menu</span> (top-right).
      </StepRow>
      <StepRow index={3} onView={onStepView}>
        Tap <span className="font-medium">"Install app"</span>. If you see <span className="font-medium">"Add to Home screen"</span> instead, that's the same thing — tap it.
      </StepRow>
      <StepRow index={4} onView={onStepView}>
        Tap <span className="font-medium">"Install"</span> to confirm. The app opens full-screen from your home screen.
      </StepRow>
    </motion.ol>
  );
}
