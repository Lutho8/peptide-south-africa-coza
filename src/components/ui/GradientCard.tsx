import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GradientCardProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'onClick'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'primary' | 'immune' | 'longevity' | 'cognitive' | 'metabolic' | 'healing' | 'gh';
  onClick?: () => void;
  hover?: boolean;
  animated?: boolean;
  delay?: number;
}

const variantClasses = {
  default: 'gradient-card',
  glass: 'glass-card',
  primary: 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30',
  immune: 'category-immune',
  longevity: 'category-longevity',
  cognitive: 'category-cognitive',
  metabolic: 'category-metabolic',
  healing: 'category-healing',
  gh: 'category-gh',
};

export function GradientCard({ 
  children, 
  className, 
  variant = 'default',
  onClick,
  hover = false,
  animated = true,
  delay = 0,
  ...props
}: GradientCardProps) {
  if (!animated) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "rounded-xl p-4",
          variantClasses[variant],
          hover && "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-pointer transition-all duration-200",
          onClick && "cursor-pointer",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "rounded-xl p-4",
        variantClasses[variant],
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
