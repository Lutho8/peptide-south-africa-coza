import { useRef, useCallback } from 'react';

type Direction = 'left' | 'right' | 'none';

const tabOrder = ['home', 'stack', 'daily-log', 'dosage', 'research'] as const;

export function useScreenTransition() {
  const prevTabRef = useRef<string>('home');

  const getDirection = useCallback((newTab: string): Direction => {
    const prevIdx = tabOrder.indexOf(prevTabRef.current as any);
    const newIdx = tabOrder.indexOf(newTab as any);
    if (prevIdx === -1 || newIdx === -1) return 'none';
    prevTabRef.current = newTab;
    return newIdx > prevIdx ? 'left' : newIdx < prevIdx ? 'right' : 'none';
  }, []);

  const getTransitionVariants = useCallback((direction: Direction) => ({
    initial: {
      opacity: 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
    exit: {
      opacity: 0,
      x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
      transition: { duration: 0.15 },
    },
  }), []);

  return { getDirection, getTransitionVariants, prevTabRef };
}
