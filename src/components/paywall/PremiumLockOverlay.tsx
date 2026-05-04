import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTeaserMode } from '@/hooks/useTeaserMode';

interface PremiumLockOverlayProps {
  title?: string;
  description?: string;
}

export function PremiumLockOverlay({
  title = 'Premium feature',
  description = 'Unlock full access to continue.',
}: PremiumLockOverlayProps) {
  const { exitTeaser } = useTeaserMode();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md rounded-xl p-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
        <Lock className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>
      <Button onClick={exitTeaser} className="touch-target">
        Unlock Premium
      </Button>
    </motion.div>
  );
}
