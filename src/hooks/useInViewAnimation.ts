import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInViewAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  delay?: number;
}

export function useInViewAnimation({
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '0px',
  delay = 0,
}: UseInViewAnimationOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce && hasAnimated) return;
          
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsInView(true);
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  return {
    ref: setRef,
    isInView,
    hasAnimated,
    reset: () => {
      setIsInView(false);
      setHasAnimated(false);
    },
  };
}

// Helper hook for staggered animations
export function useStaggerAnimation(itemCount: number, baseDelay = 0, staggerDelay = 100) {
  return Array.from({ length: itemCount }, (_, i) => baseDelay + i * staggerDelay);
}