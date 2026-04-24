import { useEffect } from 'react';
import { Lock, Sparkles, Activity, FileBarChart2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { captureLead } from '@/lib/crm';

interface Props {
  onSignIn: () => void;
}

const FEATURES = [
  { icon: FileBarChart2, label: 'AI-decoded biomarkers across 8 panels' },
  { icon: Sparkles, label: 'Personalised peptide stack tied to your goals' },
  { icon: Activity, label: '12-month optimisation protocol with retest milestones' },
];

export function PremiumGate({ onSignIn }: Props) {
  const { user } = useAuth();
  const signedIn = !!user;

  useEffect(() => {
    void captureLead({
      email: user?.email,
      source: 'bloodwork_gate',
      planInterest: 'premium',
      activityType: 'pricing_view',
      activityData: { signedIn },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  const goPricing = () => {
    void captureLead({
      email: user?.email,
      source: 'bloodwork_gate',
      planInterest: 'premium',
      activityType: 'premium_click',
    });
    window.location.assign('/#pricing');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/60 to-card/40 p-8 backdrop-blur">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={14} className="text-primary" />
          <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Premium feature</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Decode your bloodwork into a <span className="text-primary">complete protocol</span>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Bloodwork analysis is exclusive to Ride The Tide Premium members. Upload your labs and receive a personalised
          peptide stack, supplement plan, nutrition, training, and follow-up schedule.
        </p>

        <ul className="mt-6 space-y-3">
          {FEATURES.map((f) => (
            <li key={f.label} className="flex items-start gap-3 text-sm text-foreground">
              <f.icon size={16} className="text-primary mt-0.5 shrink-0" />
              <span>{f.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          {signedIn ? (
            <Button onClick={goPricing} size="lg" className="flex-1 gap-2">
              Unlock Premium — R4.99/mo <ArrowRight size={16} />
            </Button>
          ) : (
            <>
              <Button onClick={onSignIn} size="lg" variant="outline" className="flex-1">
                Sign in
              </Button>
              <Button onClick={goPricing} size="lg" className="flex-1 gap-2">
                Go Premium <ArrowRight size={16} />
              </Button>
            </>
          )}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          R4.99/mo · cancel anytime · includes consultation booking, dose tracking, blends & stacks, and Premium monthly Q&A.
        </p>
      </div>
    </div>
  );
}
