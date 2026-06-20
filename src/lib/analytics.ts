// Vendor-neutral analytics wrapper. Swap providers in one place.
type Props = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    posthog?: { capture: (event: string, props?: Props) => void };
  }
}

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return;
  const detail = { event, props, ts: Date.now() };
  try { (window.dataLayer = window.dataLayer || []).push({ event, ...props }); } catch {}
  try { window.posthog?.capture(event, props); } catch {}
  try { window.dispatchEvent(new CustomEvent('rtd-analytics', { detail })); } catch {}
  if (import.meta.env.DEV) console.debug('[analytics]', event, props ?? {});
}
