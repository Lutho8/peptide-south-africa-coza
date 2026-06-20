// Paywall removed — pass-through wrapper.
import { ReactNode } from 'react';
interface Props { children: ReactNode; [k: string]: unknown }
export function PremiumGate({ children }: Props) {
  return <>{children}</>;
}
