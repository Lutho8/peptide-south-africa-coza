import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

/**
 * Solid bold-orange CTA button with a continuous sparkle shimmer.
 * Used for "Buy Peptides" CTAs across the app.
 */
export const SparkleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('btn-sparkle group', className)}
        {...props}
      >
        <Sparkles
          className="w-3.5 h-3.5 mr-1.5 text-white drop-shadow animate-pulse"
          aria-hidden="true"
        />
        {children}
        <Sparkles
          className="w-3 h-3 ml-1.5 text-white/90 drop-shadow animate-pulse [animation-delay:0.4s]"
          aria-hidden="true"
        />
      </Button>
    );
  }
);
SparkleButton.displayName = 'SparkleButton';
