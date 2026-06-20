import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import markAsset from '@/assets/peptide-sa-mark.jpg.asset.json';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: 'w-7 h-7',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

const textSizeMap = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function AnimatedLogo({ size = 'md', showText = true, onClick, className }: AnimatedLogoProps) {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isSpinning) return;
    controls.start({
      rotate: 360,
      transition: { duration: 8, repeat: Infinity, ease: 'linear' },
    });
  }, [controls, prefersReducedMotion, isSpinning]);

  const handleClick = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    await controls.start({
      rotate: [null, 360],
      scale: [1, 1.15, 1],
      transition: {
        rotate: { duration: 0.5, ease: 'easeInOut' },
        scale: { duration: 0.3, times: [0, 0.5, 1] },
      },
    });
    setIsSpinning(false);
    controls.set({ rotate: 0 });
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg',
        'hover:opacity-90 group min-h-11',
        className
      )}
      aria-label="Peptide South Africa — Home"
    >
      <motion.div
        animate={controls}
        className={cn(
          'relative rounded-full overflow-hidden bg-white shrink-0',
          sizeMap[size],
          isSpinning && 'logo-glow'
        )}
        style={{ willChange: 'transform' }}
      >
        <img
          src={markAsset.url}
          alt="Peptide South Africa logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </motion.div>

      {showText && (
        <span className={cn(
          'font-bold tracking-tight leading-none flex flex-col items-start',
          textSizeMap[size]
        )}>
          <span className="text-foreground">PEPTIDE</span>
          <span className="text-[0.55em] tracking-[0.18em] text-muted-foreground font-semibold">
            SOUTH AFRICA
          </span>
        </span>
      )}
    </button>
  );
}
