import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, Loader2, ShieldCheck, WifiOff, RefreshCw, ChevronDown,
  Apple, PlayCircle, AlertCircle, Share2, Plus, MoreVertical, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOfflineReadiness } from '@/hooks/useOfflineReadiness';
import { detectPlatform, isStandalone, chromeIntentUrl, type Platform } from '@/lib/pwaInstall';
import { track } from '@/lib/analytics';
import { markStep } from '@/lib/onboardingProgress';

type CheckState = 'pending' | 'ok' | 'fail' | 'na';
interface Check {
  id: string;
  label: string;
  detail?: string;
  state: CheckState;
}

const initial: Check[] = [
  { id: 'standalone', label: 'Installed to Home Screen', state: 'pending' },
  { id: 'sw', label: 'Service worker active', state: 'pending' },
  { id: 'cache', label: 'Offline assets cached', state: 'pending' },
  { id: 'fallback', label: 'Offline fallback verified', state: 'pending' },
];

function StateIcon({ s }: { s: CheckState }) {
  if (s === 'ok') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (s === 'fail') return <XCircle className="w-4 h-4 text-destructive" />;
  if (s === 'na') return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
}

export function InstallVerification() {
  const { status, cachedAssets } = useOfflineReadiness();
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [checks, setChecks] = useState<Check[]>(initial);
  const [running, setRunning] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const [showTrouble, setShowTrouble] = useState(false);

  useEffect(() => { setPlatform(detectPlatform()); }, []);

  const update = useCallback((id: string, patch: Partial<Check>) => {
    setChecks(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const runChecks = useCallback(async () => {
    setRunning(true);
    setChecks(initial);
    track('install_verification_started', { platform });

    // 1. Standalone
    const standalone = isStandalone();
    update('standalone', {
      state: standalone ? 'ok' : 'fail',
      detail: standalone ? 'Launched from Home Screen' : 'Open the app from your Home Screen icon',
    });

    // 2. Service worker
    let swOk = false;
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        swOk = Boolean(reg && navigator.serviceWorker.controller);
        update('sw', {
          state: swOk ? 'ok' : 'fail',
          detail: swOk ? 'Controller active' : 'Reload once after install to activate',
        });
      } catch {
        update('sw', { state: 'fail', detail: 'Could not query service worker' });
      }
    } else {
      update('sw', { state: 'na', detail: 'Not supported on this browser' });
    }

    // 3. Cache populated
    const cacheOk = status === 'ready' && cachedAssets > 0;
    update('cache', {
      state: status === 'unsupported' ? 'na' : cacheOk ? 'ok' : 'fail',
      detail: cacheOk ? `${cachedAssets} assets cached` : 'Cache not yet populated — keep app open for a few seconds',
    });

    // 4. Offline fallback reachable via cache
    let fallbackOk = false;
    if ('caches' in window) {
      try {
        const match = await caches.match('/offline.html');
        fallbackOk = Boolean(match);
        update('fallback', {
          state: fallbackOk ? 'ok' : 'fail',
          detail: fallbackOk ? '/offline.html available offline' : 'Offline fallback not yet cached',
        });
      } catch {
        update('fallback', { state: 'fail', detail: 'Cache API error' });
      }
    } else {
      update('fallback', { state: 'na', detail: 'Cache API unavailable' });
    }

    const passed = standalone && (swOk || !('serviceWorker' in navigator)) && (cacheOk || status === 'unsupported');
    track(passed ? 'install_verification_passed' : 'install_verification_failed', {
      platform, standalone, swOk, cacheOk, fallbackOk,
    });
    if (passed) markStep('install_completed', { meta: { source: 'verification' } });
    setRunning(false);
    setRanOnce(true);
    if (!passed) setShowTrouble(true);
  }, [platform, status, cachedAssets, update]);

  const clearAndRetry = useCallback(async () => {
    track('install_verification_clear_retry', { platform });
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch {}
    window.location.reload();
  }, [platform]);

  const allOk = useMemo(() => checks.every(c => c.state === 'ok' || c.state === 'na'), [checks]);

  return (
    <section className="py-16 md:py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <ShieldCheck className="w-3.5 h-3.5" /> Final step
            </div>
            <h3 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Verify offline install
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Run a quick check to confirm the app is installed and ready to work without a connection.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {platform.startsWith('ios') ? <Apple className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                <span className="capitalize">{platform.replace('-', ' ')}</span>
              </div>
              <Button onClick={runChecks} disabled={running} className="gap-2">
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {ranOnce ? 'Re-run check' : 'Run install check'}
              </Button>
            </div>

            <ul className="mt-5 space-y-2">
              {checks.map(c => (
                <li key={c.id} className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
                  <StateIcon s={c.state} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.label}</p>
                    {c.detail && <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>

            <AnimatePresence>
              {ranOnce && allOk && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">You're offline-ready.</p>
                    <p className="text-muted-foreground mt-0.5">The app will keep working even without a connection.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => { setShowTrouble(v => !v); track('install_verification_trouble_toggled', { open: !showTrouble }); }}
              className="mt-5 w-full flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-4 py-3 text-sm text-foreground hover:bg-background/60 transition-colors touch-target"
              aria-expanded={showTrouble}
            >
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-400" /> Troubleshooting</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTrouble ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showTrouble && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }} className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3 text-sm">
                    {platform === 'ios-safari' && (
                      <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                        <p className="font-medium text-foreground flex items-center gap-2"><Apple className="w-4 h-4" /> iOS Safari</p>
                        <ol className="mt-2 space-y-1 text-muted-foreground list-decimal pl-5">
                          <li>Tap <Share2 className="inline w-3.5 h-3.5" /> Share in Safari's bottom bar</li>
                          <li>Scroll and tap <span className="text-foreground">Add to Home Screen</span> <Plus className="inline w-3.5 h-3.5" /></li>
                          <li>Tap <span className="text-foreground">Add</span> in the top-right</li>
                          <li>Open the app from your Home Screen and re-run this check</li>
                        </ol>
                      </div>
                    )}
                    {platform === 'ios-non-safari' && (
                      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-muted-foreground">
                        <p className="text-foreground font-medium">Install only works in Safari on iOS.</p>
                        <p className="mt-1">Copy this URL and paste it into Safari, then re-run the check.</p>
                      </div>
                    )}
                    {platform === 'android-chrome' && (
                      <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                        <p className="font-medium text-foreground flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Android Chrome</p>
                        <ol className="mt-2 space-y-1 text-muted-foreground list-decimal pl-5">
                          <li>Tap <MoreVertical className="inline w-3.5 h-3.5" /> menu (top-right)</li>
                          <li>Choose <span className="text-foreground">Install app</span> (or <em>Add to Home screen</em>)</li>
                          <li>Confirm <span className="text-foreground">Install</span></li>
                          <li>Open the app from your Home Screen and re-run this check</li>
                        </ol>
                      </div>
                    )}
                    {platform === 'android-other' && (
                      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-muted-foreground">
                        <p className="text-foreground font-medium">For the smoothest install, use Chrome on Android.</p>
                        <a href={chromeIntentUrl()} className="mt-1 inline-block text-primary hover:underline">Open in Chrome →</a>
                      </div>
                    )}

                    <div className="rounded-xl border border-border/40 bg-background/40 p-3 text-muted-foreground">
                      <p className="font-medium text-foreground flex items-center gap-2"><WifiOff className="w-4 h-4" /> Still not working?</p>
                      <ul className="mt-2 space-y-1 list-disc pl-5">
                        <li>Make sure you're on <span className="text-foreground">HTTPS</span> (this site is).</li>
                        <li>Free up storage — installers need ~10 MB to cache assets.</li>
                        <li>Disable private/incognito mode, then retry.</li>
                        <li>Update your browser to the latest version.</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={clearAndRetry}>
                        <Trash2 className="w-3.5 h-3.5" /> Clear cache & retry
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
