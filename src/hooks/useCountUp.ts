import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  enableScrollTrigger?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  suffix = '',
  prefix = '',
  enableScrollTrigger = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number>();

  const animate = useCallback(() => {
    if (hasStarted) return;
    
    setHasStarted(true);
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime - delay;

      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(updateCount);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeProgress;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(updateCount);
      } else {
        setIsComplete(true);
      }
    };

    frameRef.current = requestAnimationFrame(updateCount);
  }, [start, end, duration, delay, decimals, hasStarted]);

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    if (!enableScrollTrigger) {
      setTimeout(animate, delay);
      return;
    }

    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          animate();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [animate, enableScrollTrigger, delay, hasStarted]);

  const formattedValue = `${prefix}${count}${suffix}`;

  return {
    count,
    formattedValue,
    isComplete,
    ref: setRef,
    reset: () => {
      setCount(start);
      setIsComplete(false);
      setHasStarted(false);
    },
  };
}