import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';

interface PremiumGateProps {
  title?: string;
  description?: string;
  featureName?: string;
  children: React.ReactNode;
  /** When true, free authenticated users still see the children (used for soft hint surfaces). */
  preview?: boolean;
}

/**
 * Authenticated Premium gate. Free signed-in users still get free features —
 * this only hides Premium-exclusive content (Live Q&A, AI bloodwork, 1:1 calls).
 */
export function PremiumGate({
  title = 'Premium feature',
  description = 'Upgrade to Premium to unlock this.',
  featureName,
  children,
  preview = false,
}: PremiumGateProps) {
  const { user } = useAuth();
  const { hasPremium, isLoading } = useMembership();

  if (isLoading) {
    return <div className="h-32 rounded-xl bg-muted/40 animate-pulse" />;
  }

  if (hasPremium) return <>{children}</>;
  if (preview) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card to-accent/[0.04] p-8 text-center"
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
        {description}
        {featureName && (
          <> {featureName} is exclusive to Premium members.</>
        )}
      </p>
      <Link to="/#pricing" className="inline-block">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/25"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {user ? 'Upgrade to Premium' : 'Sign up & unlock Premium'}
        </Button>
      </Link>
      <p className="text-xs text-muted-foreground mt-4">
        From R4.99/month · Cancel anytime · 🇿🇦 Built in South Africa
      </p>
    </motion.div>
  );
}
