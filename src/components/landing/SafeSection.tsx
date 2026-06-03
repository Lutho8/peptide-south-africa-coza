import { Suspense, ReactNode, ComponentType } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface Props {
  name: string;
  enabled?: boolean;
  minH?: number;
  children?: ReactNode;
  /** Optional lazy component reference; if it resolves to undefined, nothing renders. */
  component?: ComponentType<Record<string, unknown>> | undefined | null;
}

const Placeholder = ({ minH = 300 }: { minH?: number }) => (
  <div style={{ minHeight: minH }} aria-hidden="true" />
);

/**
 * Wraps a landing section in an ErrorBoundary + Suspense, with a feature flag.
 * If the section throws or the referenced component is missing, the rest of
 * the landing page keeps rendering instead of going blank.
 */
export function SafeSection({ name, enabled = true, minH = 300, children, component: Component }: Props) {
  if (!enabled) return null;

  if (Component === undefined || Component === null) {
    if (children == null) {
      if (import.meta.env.DEV) {
        console.warn(`[SafeSection:${name}] no component or children — skipping.`);
      }
      return null;
    }
  }

  return (
    <ErrorBoundary fallbackTitle={`Couldn't load "${name}"`}>
      <Suspense fallback={<Placeholder minH={minH} />}>
        {Component ? <Component /> : children}
      </Suspense>
    </ErrorBoundary>
  );
}
