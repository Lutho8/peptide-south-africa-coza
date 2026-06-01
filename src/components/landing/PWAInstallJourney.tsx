import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Apple,
  PlayCircle,
  WifiOff,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Share2,
  Plus,
  MoreVertical,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type Platform = 'ios' | 'android';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'ios';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  return 'ios';
}

const benefits = [
  { icon: WifiOff, title: 'Works offline', body: 'Core dose tracking & references without internet.' },
  { icon: Monitor, title: 'Full-screen', body: 'No browser bar — feels like a native app.' },
  { icon: RefreshCw, title: 'Auto-updates', body: 'Always the latest version, no store waits.' },
  { icon: Smartphone, title: 'Same experience', body: 'Identical on iPhone and Android.' },
];

const iosSteps = [
  { text: <>Open <span className="text-primary font-medium">ridethetide.info</span> in Safari</> },
  { text: <>Tap the <span className="font-medium">Share icon</span> <Share2 className="inline w-4 h-4 -mt-0.5" /> (box with arrow)</> },
  { text: <>Scroll and tap <span className="font-medium">"Add to Home Screen"</span> <Plus className="inline w-4 h-4 -mt-0.5" /></> },
  { text: <>Tap <span className="font-medium">"Add"</span> to confirm</> },
];

const androidSteps = [
  { text: <>Open <span className="text-primary font-medium">ridethetide.info</span> in Chrome</> },
  { text: <>Tap the <MoreVertical className="inline w-4 h-4 -mt-0.5" /> <span className="font-medium">menu</span> (top-right)</> },
  { text: <>Tap <span className="font-medium">"Install app"</span> or "Add to Home Screen"</> },
  { text: <>Tap <span className="font-medium">"Install"</span> to confirm</> },
];

export function PWAInstallJourney() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const { isInstallable, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const steps = useMemo(() => (platform === 'ios' ? iosSteps : androidSteps), [platform]);

  const scrollToSteps = () => {
    document.getElementById('pwa-install-steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              Progressive Web App
            </div>
            <h2 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Get Ride The Tide on{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Phone
              </span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Install directly to your home screen. No app store needed.
            </p>

            {/* Disabled store buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="relative w-full sm:w-56 rounded-xl border border-border/50 bg-card/30 backdrop-blur px-4 py-3 flex items-center gap-3 opacity-60 select-none">
                <Apple className="w-7 h-7 text-muted-foreground shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Not on the</p>
                  <p className="text-sm font-semibold text-muted-foreground">App Store</p>
                </div>
                <span className="absolute top-1.5 right-2 text-[9px] uppercase tracking-wider text-muted-foreground/70">Unavailable</span>
              </div>
              <div className="relative w-full sm:w-56 rounded-xl border border-border/50 bg-card/30 backdrop-blur px-4 py-3 flex items-center gap-3 opacity-60 select-none">
                <PlayCircle className="w-7 h-7 text-muted-foreground shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Not on</p>
                  <p className="text-sm font-semibold text-muted-foreground">Google Play</p>
                </div>
                <span className="absolute top-1.5 right-2 text-[9px] uppercase tracking-wider text-muted-foreground/70">Unavailable</span>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground/80">
              Not available in app stores — and <span className="text-primary">that's by design.</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isInstalled ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  Installed on this device
                </div>
              ) : isInstallable ? (
                <Button
                  size="lg"
                  onClick={install}
                  className="btn-sparkle gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Install Now
                </Button>
              ) : (
                <Button size="lg" onClick={scrollToSteps} className="gap-2">
                  Install in 30 seconds
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* By design */}
      <div className="py-16 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Not on the App Store. By design.
              </h3>
              <div className="mt-5 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  We built a fully native app first. Apple and Google asked us to remove the safety
                  engine, peptide interaction warnings, and dosing logic to pass review. Every removal
                  made the app safer for them and less useful for you.
                </p>
                <p>
                  The peptide apps that made it through review did so by stripping themselves of what
                  matters. That's not what this community needs.
                </p>
                <p>
                  A PWA lets us ship the real product — the depth this research space deserves —
                  without permission from a review board that doesn't understand it yet.
                </p>
                <p className="text-primary font-semibold">Small initial friction. Exponential gains.</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-4"
                >
                  <b.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.body}</p>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="sm:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur p-4"
              >
                <ShieldCheck className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-semibold text-foreground">No gatekeeping</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Safety engine, interaction warnings, and dosing logic live free and fully here.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Install steps */}
      <div id="pwa-install-steps" className="py-16 md:py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Install in 30 seconds
            </h3>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              Choose your device to see the steps.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {(['ios', 'android'] as Platform[]).map((p) => {
              const active = platform === p;
              const Icon = p === 'ios' ? Apple : PlayCircle;
              const label = p === 'ios' ? 'iOS (Safari)' : 'Android (Chrome)';
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors touch-target ${
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pwa-tab-bg"
                      className="absolute inset-0 rounded-full bg-card border border-primary/40"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Steps card */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6 md:p-8">
              <div className="flex items-center gap-2 text-foreground">
                {platform === 'ios' ? <Apple className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                <span className="font-semibold">
                  {platform === 'ios' ? 'iOS — Safari only' : 'Android — Chrome'}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.ol
                  key={platform}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 space-y-4"
                >
                  {steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-4"
                    >
                      <span className="flex-shrink-0 w-9 h-9 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="pt-1.5 text-sm md:text-base text-foreground/90">{s.text}</p>
                    </motion.li>
                  ))}
                </motion.ol>
              </AnimatePresence>

              {platform === 'android' && isInstallable && (
                <div className="mt-6 pt-6 border-t border-border/50 flex justify-center">
                  <Button onClick={install} size="lg" className="btn-sparkle gap-2">
                    <Download className="w-4 h-4" />
                    Install Now
                  </Button>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Already installed? <a href="/" className="text-primary hover:underline">Open the app →</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
