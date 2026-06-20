import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { captureLead } from '@/lib/crm';

export type AdherenceSection = 'supplements' | 'nutrition' | 'exercise' | 'stress';

function slug(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export function adherenceKey(section: AdherenceSection, index: number, label: string): string {
  return `${section}:${index}:${slug(label)}`;
}

interface AdherenceState {
  loading: boolean;
  completed: Set<string>;
}

export function useProtocolAdherence(labReportId: string | null | undefined) {
  const { user } = useAuth();
  const [state, setState] = useState<AdherenceState>({ loading: true, completed: new Set() });
  const lastCrmAtRef = useRef<Record<string, number>>({});

  // Load existing adherence rows
  useEffect(() => {
    if (!user || !labReportId) {
      setState({ loading: false, completed: new Set() });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('protocol_adherence')
        .select('section, item_key')
        .eq('user_id', user.id)
        .eq('lab_report_id', labReportId);
      if (cancelled) return;
      if (error) {
        console.warn('[adherence] load failed', error);
        setState({ loading: false, completed: new Set() });
        return;
      }
      const set = new Set<string>();
      for (const row of data ?? []) {
        set.add(`${row.section}:${row.item_key}`);
      }
      setState({ loading: false, completed: set });
    })();
    return () => {
      cancelled = true;
    };
  }, [user, labReportId]);

  const isDone = useCallback(
    (section: AdherenceSection, key: string) => state.completed.has(`${section}:${key}`),
    [state.completed]
  );

  const toggle = useCallback(
    async (section: AdherenceSection, index: number, label: string) => {
      if (!user || !labReportId) return;
      const key = adherenceKey(section, index, label);
      const composite = `${section}:${key}`;
      const currentlyDone = state.completed.has(composite);

      // Optimistic update
      setState((prev) => {
        const next = new Set(prev.completed);
        if (currentlyDone) next.delete(composite);
        else next.add(composite);
        return { ...prev, completed: next };
      });

      if (currentlyDone) {
        const { error } = await supabase
          .from('protocol_adherence')
          .delete()
          .eq('user_id', user.id)
          .eq('lab_report_id', labReportId)
          .eq('section', section)
          .eq('item_key', key);
        if (error) {
          console.warn('[adherence] delete failed', error);
          // Revert
          setState((prev) => {
            const next = new Set(prev.completed);
            next.add(composite);
            return { ...prev, completed: next };
          });
        }
      } else {
        const { error } = await supabase.from('protocol_adherence').insert({
          user_id: user.id,
          lab_report_id: labReportId,
          section,
          item_key: key,
          item_label: label,
        });
        if (error) {
          console.warn('[adherence] insert failed', error);
          setState((prev) => {
            const next = new Set(prev.completed);
            next.delete(composite);
            return { ...prev, completed: next };
          });
          return;
        }
        // Debounced CRM event (1/sec per section)
        const now = Date.now();
        const last = lastCrmAtRef.current[section] ?? 0;
        if (now - last > 1000) {
          lastCrmAtRef.current[section] = now;
          void captureLead({
            email: user.email,
            source: 'bloodwork_adherence',
            planInterest: 'premium',
            activityType: 'calculator_use',
            activityData: { section, item: label },
          });
        }
      }
    },
    [user, labReportId, state.completed]
  );

  const resetSection = useCallback(
    async (section: AdherenceSection) => {
      if (!user || !labReportId) return;
      const prefix = `${section}:`;
      // Optimistic
      setState((prev) => {
        const next = new Set<string>();
        for (const k of prev.completed) if (!k.startsWith(prefix)) next.add(k);
        return { ...prev, completed: next };
      });
      const { error } = await supabase
        .from('protocol_adherence')
        .delete()
        .eq('user_id', user.id)
        .eq('lab_report_id', labReportId)
        .eq('section', section);
      if (error) console.warn('[adherence] reset failed', error);
    },
    [user, labReportId]
  );

  const sectionProgress = useCallback(
    (section: AdherenceSection, total: number) => {
      if (total <= 0) return { done: 0, total: 0, pct: 0 };
      const prefix = `${section}:`;
      let done = 0;
      for (const k of state.completed) if (k.startsWith(prefix)) done += 1;
      return { done, total, pct: Math.round((done / total) * 100) };
    },
    [state.completed]
  );

  const completedKeysForPdf = useMemo(() => state.completed, [state.completed]);

  return {
    loading: state.loading,
    isDone,
    toggle,
    resetSection,
    sectionProgress,
    completedKeysForPdf,
  };
}
