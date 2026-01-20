import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'primary' | 'immune' | 'longevity' | 'cognitive' | 'metabolic' | 'healing' | 'gh';
  onClick?: () => void;
  hover?: boolean;
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
  hover = false
}: GradientCardProps) {
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
