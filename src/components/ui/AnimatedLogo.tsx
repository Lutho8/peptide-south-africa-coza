import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import logoAnimated from '/logo-animated.png';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const textSizeMap = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function AnimatedLogo({ size = 'md', showText = true, onClick, className }: AnimatedLogoProps) {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Continuous slow rotation
  useEffect(() => {
    if (prefersReducedMotion || isSpinning) return;
    
    controls.start({
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      },
    });
  }, [controls, prefersReducedMotion, isSpinning]);

  const handleClick = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Fast spin with glow effect
    await controls.start({
      rotate: [null, 360],
      scale: [1, 1.15, 1],
      transition: {
        rotate: { duration: 0.5, ease: 'easeInOut' },
        scale: { duration: 0.3, times: [0, 0.5, 1] },
      },
    });
    
    // Reset to continuous rotation
    setIsSpinning(false);
    controls.set({ rotate: 0 });
    
    // Trigger navigation after animation
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'hover:opacity-90 group',
        className
      )}
      aria-label="Go to Home"
    >
      <motion.div
        animate={controls}
        className={cn(
          'relative rounded-xl overflow-hidden logo-container',
          sizeMap[size],
          isSpinning && 'logo-glow'
        )}
        style={{ willChange: 'transform' }}
        whileHover={{ 
          boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
        }}
      >
        <img
          src={logoAnimated}
          alt="Peptide South Africa"
          className="w-full h-full object-cover"
        />
        {/* Glow overlay on hover/click */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/0 to-primary/20 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      
      {showText && (
        <span className={cn(
          'font-bold text-foreground transition-all duration-300',
          'group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-accent group-hover:to-primary',
          'group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-[length:200%_auto] group-hover:animate-gradient-flow',
          textSizeMap[size]
        )}>
          Peptide South Africa
        </span>
      )}
    </button>
  );
}