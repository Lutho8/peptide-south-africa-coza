import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

/**
 * Solid bold-orange CTA button with a continuous sparkle shimmer.
 * Used for "Buy Peptides" CTAs across the app.
 */
export const SparkleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const inner = (
      <>
        <Sparkles
          className="w-3.5 h-3.5 mr-1.5 text-white drop-shadow animate-pulse"
          aria-hidden="true"
        />
        {children}
        <Sparkles
          className="w-3 h-3 ml-1.5 text-white/90 drop-shadow animate-pulse [animation-delay:0.4s]"
          aria-hidden="true"
        />
      </>
    );

    if (asChild) {
      // When asChild, Button uses Radix Slot which requires a single child element.
      // The consumer passes a single element (e.g. <a>); we inject our sparkle wrapper inside it.
      const child = children as React.ReactElement<{ children?: React.ReactNode }>;
      return (
        <Button
          ref={ref}
          asChild
          className={cn('btn-sparkle group', className)}
          {...props}
        >
          {{
            ...child,
            props: {
              ...child.props,
              children: (
                <>
                  <Sparkles
                    className="w-3.5 h-3.5 mr-1.5 text-white drop-shadow animate-pulse"
                    aria-hidden="true"
                  />
                  {child.props.children}
                  <Sparkles
                    className="w-3 h-3 ml-1.5 text-white/90 drop-shadow animate-pulse [animation-delay:0.4s]"
                    aria-hidden="true"
                  />
                </>
              ),
            },
          } as React.ReactElement}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        className={cn('btn-sparkle group', className)}
        {...props}
      >
        {inner}
      </Button>
    );
  }
);
SparkleButton.displayName = 'SparkleButton';
