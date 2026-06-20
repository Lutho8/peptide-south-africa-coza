import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';

interface AnimatedButtonProps extends ButtonProps {
  shimmer?: boolean;
  glow?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, shimmer = false, glow = false, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent to-primary opacity-50 blur-xl"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden",
            shimmer && "luxury-shimmer",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
