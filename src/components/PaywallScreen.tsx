import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { useTeaserMode } from '@/hooks/useTeaserMode';
import { purchaseSubscription, restorePurchases, isNativeBilling } from '@/services/playBilling';

/**
 * Hard paywall — first screen shown to any unauthenticated visitor on every
 * cold start (web, PWA, native). Browse Free drops the user into a limited
 * preview of the landing page. Continue routes through Play Billing on
 * Android, or Tagadapay checkout on web.
 */
export function PaywallScreen() {
  const { enableTeaser } = useTeaserMode();
  const [busy, setBusy] = useState<'continue' | 'restore' | null>(null);
  const native = isNativeBilling();

  const handleContinue = async () => {
    setBusy('continue');
    try {
      await purchaseSubscription();
    } catch {
      /* error toasted in service */
    } finally {
      setBusy(null);
    }
  };

  const handleRestore = async () => {
    setBusy('restore');
    try {
      await restorePurchases();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-br from-[hsl(222_47%_11%)] via-[hsl(222_47%_8%)] to-[hsl(217_33%_17%)]"
      style={{
        paddingTop: 'max(2.5rem, env(safe-area-inset-top, 2.5rem))',
        paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 2.5rem))',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm flex flex-col items-center text-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <AnimatedLogo size="lg" showText={false} />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Unlock Premium
        </h1>
        <p className="text-sm text-white/60 mb-10">
          Full access to Ride The Tide
        </p>

        {/* Price hero */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full rounded-2xl border border-primary/30 bg-primary/5 px-6 py-8 mb-8 backdrop-blur-sm"
          style={{ boxShadow: '0 10px 40px -10px hsl(217 91% 60% / 0.35)' }}
        >
          <div className="text-5xl font-extrabold text-primary tracking-tight">
            R4.99
            <span className="text-lg font-medium text-white/70 ml-1">/ month</span>
          </div>
          <div className="mt-3 text-sm text-white/80 font-medium">3 days free</div>
          <div className="mt-1 text-xs text-white/50">Cancel anytime</div>
        </motion.div>

        {/* Continue */}
        <Button
          onClick={handleContinue}
          disabled={busy !== null}
          className="w-full h-14 text-base font-semibold rounded-xl shadow-lg touch-target"
        >
          {busy === 'continue' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Continue'
          )}
        </Button>

        {/* Restore (native only) */}
        {native && (
          <button
            onClick={handleRestore}
            disabled={busy !== null}
            className="mt-4 text-sm text-white/70 hover:text-white underline-offset-4 hover:underline transition-colors disabled:opacity-50 touch-target"
          >
            {busy === 'restore' ? 'Restoring…' : 'Restore Purchase'}
          </button>
        )}

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] uppercase tracking-wider text-white/40">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Browse Free */}
        <Button
          variant="ghost"
          onClick={enableTeaser}
          className="w-full h-12 text-white/80 hover:text-white hover:bg-white/5 touch-target"
        >
          Browse Free
        </Button>

        {/* Disclosure */}
        <p className="mt-8 text-[11px] leading-relaxed text-white/40 max-w-xs">
          3-day free trial, then R4.99 billed monthly. Cancel anytime in your
          {native ? ' Google Play subscriptions' : ' account settings'} to avoid charges.
        </p>
      </motion.div>
    </div>
  );
}

export default PaywallScreen;
