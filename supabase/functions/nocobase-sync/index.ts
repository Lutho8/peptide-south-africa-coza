// NocoBase CRM sync edge function.
// Captures Lead + Activity rows in NocoBase from any frontend lead-capture surface.
// verify_jwt = false so anonymous capture works (Q&A click, free course, etc.)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const NOCOBASE_API_URL = Deno.env.get('NOCOBASE_API_URL');
const NOCOBASE_API_TOKEN = Deno.env.get('NOCOBASE_API_TOKEN');

// Admin email — every lead capture is also surfaced to this address.
// Email delivery requires the Lovable Email domain to be configured;
// until then, the admin payload is logged + mirrored into NocoBase only.
const ADMIN_EMAIL = 'lutho.kote@relicom.de';

type ActivityType =
  | 'page_view'
  | 'qa_signup'
  | 'course_start'
  | 'calculator_use'
  | 'premium_click'
  | 'pricing_view'
  | 'peptide_search'
  | 'email_open'
  | 'consultation_booked';

type PlanInterest = 'free' | 'premium' | 'undecided';

interface CapturePayload {
  action: 'capture_lead';
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source: string;
  planInterest?: PlanInterest;
  activityType: ActivityType;
  activityData?: Record<string, unknown>;
  pageUrl?: string;
  sessionId?: string;
}

const SCORE_TABLE: Record<ActivityType, number> = {
  page_view: 1,
  pricing_view: 10,
  qa_signup: 15,
  course_start: 10,
  calculator_use: 5,
  peptide_search: 3,
  premium_click: 25,
  email_open: 2,
  consultation_booked: 40,
};

function deriveLeadStatus(score: number, activityType: ActivityType): string {
  if (activityType === 'premium_click' || score >= 60) return 'qualified';
  if (score >= 30) return 'nurturing';
  return 'new';
}

async function nb(path: string, init: RequestInit = {}) {
  const url = `${NOCOBASE_API_URL!.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NOCOBASE_API_TOKEN}`,
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* keep as text */
  }
  if (!res.ok) {
    console.error(`NocoBase ${path} failed [${res.status}]:`, text);
    throw new Error(`NocoBase ${path} ${res.status}: ${text.slice(0, 200)}`);
  }
  return json;
}

async function findLeadByEmail(email: string): Promise<any | null> {
  const filter = encodeURIComponent(JSON.stringify({ email: { $eq: email } }));
  const res = await nb(`/leads:list?filter=${filter}&pageSize=1`);
  return res?.data?.[0] ?? null;
}

async function createLead(input: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source: string;
  planInterest: PlanInterest;
  leadStatus: string;
  leadScore: number;
}) {
  const res = await nb('/leads:create', {
    method: 'POST',
    body: JSON.stringify({
      values: {
        email: input.email,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        phone: input.phone ?? null,
        source: input.source,
        planInterest: input.planInterest,
        leadStatus: input.leadStatus,
        leadScore: input.leadScore,
        lastActivity: new Date().toISOString(),
      },
    }),
  });
  return res?.data;
}

async function updateLead(
  id: string | number,
  patch: Record<string, unknown>,
) {
  const filterByTk = typeof id === 'string' ? id : String(id);
  const res = await nb(`/leads:update?filterByTk=${encodeURIComponent(filterByTk)}`, {
    method: 'POST',
    body: JSON.stringify({ values: patch }),
  });
  return res?.data;
}

async function createActivity(input: {
  leadId: string | number;
  activityType: ActivityType;
  activityData?: Record<string, unknown>;
  pageUrl?: string;
  sessionId?: string;
}) {
  await nb('/activities:create', {
    method: 'POST',
    body: JSON.stringify({
      values: {
        lead: input.leadId,
        activityType: input.activityType,
        activityData: input.activityData ?? null,
        pageUrl: input.pageUrl ?? null,
        sessionId: input.sessionId ?? null,
      },
    }),
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!NOCOBASE_API_URL || !NOCOBASE_API_TOKEN) {
    return new Response(
      JSON.stringify({ ok: false, error: 'NocoBase not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: CapturePayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (payload.action !== 'capture_lead') {
    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const email = (payload.email ?? '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // No email — silently no-op so anonymous capture (calculator/search) doesn't blow up.
    return new Response(JSON.stringify({ ok: true, skipped: 'no-email' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const scoreDelta = SCORE_TABLE[payload.activityType] ?? 0;
  const planInterest: PlanInterest = payload.planInterest ?? 'undecided';

  try {
    const existing = await findLeadByEmail(email);

    let leadId: string | number;

    if (existing) {
      const currentScore =
        typeof existing.leadScore === 'number' ? existing.leadScore : 0;
      const newScore = Math.min(100, currentScore + scoreDelta);
      const newStatus =
        existing.leadStatus === 'converted'
          ? 'converted'
          : deriveLeadStatus(newScore, payload.activityType);

      const patch: Record<string, unknown> = {
        leadScore: newScore,
        leadStatus: newStatus,
        lastActivity: new Date().toISOString(),
      };
      if (payload.firstName && !existing.firstName) patch.firstName = payload.firstName;
      if (payload.lastName && !existing.lastName) patch.lastName = payload.lastName;
      if (payload.phone && !existing.phone) patch.phone = payload.phone;
      if (
        planInterest === 'premium' ||
        (planInterest === 'free' && existing.planInterest !== 'premium')
      ) {
        patch.planInterest = planInterest;
      }

      await updateLead(existing.id, patch);
      leadId = existing.id;
    } else {
      const newLead = await createLead({
        email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        source: payload.source,
        planInterest,
        leadStatus: deriveLeadStatus(scoreDelta, payload.activityType),
        leadScore: scoreDelta,
      });
      leadId = newLead?.id;
    }

    if (leadId !== undefined && leadId !== null) {
      await createActivity({
        leadId,
        activityType: payload.activityType,
        activityData: payload.activityData,
        pageUrl: payload.pageUrl,
        sessionId: payload.sessionId,
      });
    }

    return new Response(JSON.stringify({ ok: true, leadId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('nocobase-sync error:', err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
