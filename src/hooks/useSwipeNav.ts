import { useRef, useCallback } from 'react';

interface Options {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // px
  maxAngleDeg?: number;
}

/**
 * Lightweight horizontal-swipe hook. Returns `bind` props to spread on a div.
 * Ignores swipes when the original touch target is inside an interactive element
 * (input/textarea/select/contenteditable/.no-swipe) so calendar buttons & forms work.
 */
export function useSwipeNav({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
  maxAngleDeg = 30,
}: Options) {
  const startX = useRef(0);
  const startY = useRef(0);
  const active = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'input, textarea, select, button, a, [contenteditable="true"], .no-swipe'
      )
    ) {
      active.current = false;
      return;
    }
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    active.current = true;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!active.current) return;
      active.current = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      if (Math.abs(dx) < threshold) return;
      const angle = (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI;
      if (angle > maxAngleDeg) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
    [onSwipeLeft, onSwipeRight, threshold, maxAngleDeg]
  );

  return { onTouchStart, onTouchEnd };
}
