import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { startCheckout, type Plan } from '@/lib/billing';
import { PricingTrustBar } from './PricingTrustBar';

const AuthModal = lazy(() =>
  import('@/components/auth/AuthModal').then((m) => ({ default: m.AuthModal }))
);

const freeFeatures = [
  '98+ peptide research profiles',
  'Reconstitution & dose calculators',
  'Stack & blend builder',
  'COA verification lookup',
  'Protocol tracking & reminders',
];

const premiumFeatures = [
  'Everything in Free',
  'Exclusive monthly Q&A on Zoom',
  '1:1 expert consultation calls',
  'AI-powered bloodwork insights',
  'Advanced cycle planning & alerts',
  'Priority WhatsApp & email support',
  'Early access to new tools',
];

function formatZAR(amount: number): string {
  return `R${amount.toFixed(2).replace(/\.00$/, '')}`;
}

export function PricingSection() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<Plan>('monthly');
  const [authOpen, setAuthOpen] = useState(false);

  const monthly = 4.99;
  const annual = 49;
  const annualMonthlyEquivalent = annual / 12;

  const handleFreeCta = () => {
    if (user) {
      window.location.reload();
      return;
    }
    setAuthOpen(true);
  };

  const handlePremiumCta = async () => {
    await startCheckout(billing, user?.email ?? null);
  };

  return (
    <section
      id="pricing"
      className="relative py-20 lg:py-28 overflow-hidden"
      aria-labelledby="pricing-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.04] to-background pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simple, honest pricing in ZAR
          </motion.div>
          <h2
            id="pricing-heading"
            className="text-3xl md:text-5xl font-bold mb-4 text-foreground"
          >
            Start free. Go Premium when you're ready.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            All prices in South African Rand. Cancel anytime. No surprise charges.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 rounded-full bg-card border border-border">
            {(['monthly', 'annual'] as Plan[]).map((p) => (
              <button
                key={p}
                onClick={() => setBilling(p)}
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors min-h-[40px] ${
                  billing === p
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {billing === p && (
                  <motion.div
                    layoutId="billing-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">
                  {p}
                  {p === 'annual' && (
                    <span className="ml-2 text-[10px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                      SAVE 17%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-border bg-card p-7 md:p-8 flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-1">Free</h3>
              <p className="text-sm text-muted-foreground">
                Everything most researchers need.
              </p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-foreground">R0</span>
              <span className="text-sm text-muted-foreground">/forever</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleFreeCta}
              variant="outline"
              size="lg"
              className="w-full border-border hover:border-primary hover:text-primary"
            >
              {user ? 'Open Dashboard' : 'Start Free'}
            </Button>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-primary via-accent to-primary"
          >
            {/* Ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[11px] font-bold shadow-lg shadow-primary/30">
                <Zap className="w-3 h-3 fill-current" />
                MOST POPULAR
              </div>
            </div>

            <div className="rounded-[14px] bg-card p-7 md:p-8 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Premium
                </h3>
                <p className="text-sm text-muted-foreground">
                  Personal coaching + advanced tools.
                </p>
              </div>

              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={billing}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {billing === 'monthly' ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-base text-muted-foreground line-through">
                          R9.99
                        </span>
                        <span className="text-5xl font-bold text-foreground">
                          {formatZAR(monthly)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /month
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold text-foreground">
                            {formatZAR(annual)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /year
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Just R{annualMonthlyEquivalent.toFixed(2)}/month — billed annually
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handlePremiumCta}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/25"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {user ? 'Upgrade to Premium' : 'Go Premium'}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-3">
                Secure checkout • Cancel anytime • Prices in ZAR
              </p>
            </div>
          </motion.div>
        </div>

        {/* Trust bar */}
        <PricingTrustBar />

        {/* SA micro-line */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          🇿🇦 Built in South Africa for the global research community.
        </p>
      </div>

      <Suspense fallback={null}>
        {authOpen && <AuthModal open={authOpen} onOpenChange={setAuthOpen} />}
      </Suspense>
    </section>
  );
}
