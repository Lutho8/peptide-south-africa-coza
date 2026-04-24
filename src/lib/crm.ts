// CRM client helper — fire-and-forget lead capture into NocoBase.
// Never blocks UX. Failures are logged to the console only.

import { supabase } from '@/integrations/supabase/client';

export type ActivityType =
  | 'page_view'
  | 'qa_signup'
  | 'course_start'
  | 'calculator_use'
  | 'premium_click'
  | 'pricing_view'
  | 'peptide_search'
  | 'email_open'
  | 'consultation_booked';

export type PlanInterest = 'free' | 'premium' | 'undecided';

export interface CaptureLeadInput {
  email?: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source: string;
  planInterest?: PlanInterest;
  activityType: ActivityType;
  activityData?: Record<string, unknown>;
}

const SESSION_KEY = 'rtd-session-id';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        crypto.randomUUID?.() ??
        `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s-${Date.now()}`;
  }
}

export async function captureLead(input: CaptureLeadInput): Promise<void> {
  const email = (input.email ?? '').trim().toLowerCase();
  // Skip silently if no email (anonymous calculator/search calls).
  if (!email) return;

  try {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    const sessionId = getSessionId();

    await supabase.functions.invoke('nocobase-sync', {
      body: {
        action: 'capture_lead',
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        source: input.source,
        planInterest: input.planInterest ?? 'undecided',
        activityType: input.activityType,
        activityData: input.activityData,
        pageUrl,
        sessionId,
      },
    });
  } catch (err) {
    // Never block UX on CRM failures.
    console.warn('[crm] captureLead failed:', err);
  }
}
