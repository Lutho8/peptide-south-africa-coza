// Lightweight client-side analytics for the bloodwork conversion funnel.
// Events are also forwarded to captureLead so they land in the CRM pipeline.

import { captureLead } from '@/lib/crm';

export type BwEvent =
  | 'bw_upload_started'
  | 'bw_analysis_viewed'
  | 'bw_signup'
  | 'bw_stack_built'
  | 'bw_checkout_clicked'
  | 'bw_protocol_activated';

export function trackBwEvent(event: BwEvent, payload: Record<string, unknown> = {}) {
  try {
    // Console breadcrumb for field debugging
    console.info(`[bw:event] ${event}`, payload);
    // Best-effort browser analytics hook (if a global is wired up later)
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...payload });
    }
    // CRM passthrough for funnel reporting
    void captureLead({
      source: event,
      planInterest: 'free',
      activityType: 'calculator_use',
      activityData: payload,
    });
  } catch {
    /* swallow analytics errors */
  }
}
