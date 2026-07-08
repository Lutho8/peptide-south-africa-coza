import { supabase } from '@/integrations/supabase/client';

export type AuditAction =
  | 'dose.create'
  | 'dose.update'
  | 'dose.delete'
  | 'dose.cycle.create'
  | 'dose.cycle.update'
  | 'dose.cycle.delete'
  | 'dose.cycle.status_change'
  | 'dose.cycle.recalculate'
  | 'dose.stack.update'
  | 'admin.dashboard.open'
  | 'admin.role_check_failed'
  | 'admin.role_check_fallback'
  | 'admin.coa_upload'
  | 'admin.label_generate'
  | 'admin.view_audit_log'
  | 'admin.audit_log.filter';

export interface AuditPayload {
  action: AuditAction | string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget audit log insert. Never throws — audit failures must never
 * break a user flow. Silently no-ops when the user is signed out.
 */
export async function logAudit(payload: AuditPayload): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return;
    await supabase.from('audit_logs').insert({
      user_id: uid,
      action: payload.action,
      entity_type: payload.entityType ?? null,
      entity_id: payload.entityId ?? null,
      metadata: (payload.metadata ?? {}) as never,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[audit] insert failed', err);
  }
}
