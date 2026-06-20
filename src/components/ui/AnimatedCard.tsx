import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'primary' | 'luxury';
  delay?: number;
  hover?: boolean;
}

const variantClasses = {
  default: 'bg-card border border-border',
  glass: 'glass-card backdrop-blur-xl',
  primary: 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30',
  luxury: 'premium-border bg-gradient-to-br from-card via-card/95 to-card/90 shadow-xl shadow-accent/5',
};

export function AnimatedCard({ 
  children, 
  className, 
  variant = 'default',
  delay = 0,
  hover = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 20px 40px -12px hsl(var(--accent) / 0.15)'
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={cn(
        "rounded-xl p-4 transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
