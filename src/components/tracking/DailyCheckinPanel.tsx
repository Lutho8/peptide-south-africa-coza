import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { Activity, Download, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { blankCheckin, checkinMetricsSchema, csvCell, type CheckinMetrics, type DailyCheckin } from '@/lib/dailyCheckin';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';
import type { Json } from '@/integrations/supabase/types';

interface Props { date: string; doses: DailyDoseEntry[] }
const numericFields = [
  { key: 'sleepHours', label: 'Sleep (hours)', max: 24, step: 0.25 },
  { key: 'weightKg', label: 'Weight (kg)', max: 700, step: 0.1 },
  { key: 'painScore', label: 'Pain (0–10)', max: 10, step: 1 },
  { key: 'energyScore', label: 'Energy (0–10)', max: 10, step: 1 },
] as const;

export function DailyCheckinPanel({ date, doses }: Props) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<CheckinMetrics>(blankCheckin);
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [records, setRecords] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [customName, setCustomName] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const userId = user?.id;
  const since = format(subDays(new Date(`${date}T12:00:00`), 29), 'yyyy-MM-dd');

  useEffect(() => {
    let cancelled = false;
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    Promise.resolve(supabase.from('daily_checkins').select('*').eq('user_id', userId).gte('date', since).lte('date', date).order('date', { ascending: false })).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError('Your check-ins could not be loaded. Reload to retry; nothing has been overwritten.');
      else {
        const parsed = (data || []).map(record => ({ ...record, metrics: checkinMetricsSchema.parse(record.metrics) }));
        setRecords(parsed);
        const current = parsed.find(record => record.date === date);
        if (current) { setMetrics(current.metrics); setTime(format(new Date(current.observed_at), 'HH:mm')); setSavedAt(current.observed_at); }
      }
    }).catch(() => { if (!cancelled) setError('Your check-ins could not be read. Reload to retry.'); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [date, since, userId]);

  const setField = <K extends keyof CheckinMetrics>(key: K, value: CheckinMetrics[K]) => { setMetrics(current => ({ ...current, [key]: value })); setSavedAt(''); };
  const addCustom = () => {
    const item = { name: customName.trim(), value: Number(customValue), unit: customUnit.trim() };
    const next = { ...metrics, custom: [...metrics.custom, item] };
    if (customValue.trim() === '' || !checkinMetricsSchema.safeParse(next).success) { toast.error('Enter a metric name, finite numeric value and unit. Maximum 20 metrics.'); return; }
    setMetrics(next); setSavedAt(''); setCustomName(''); setCustomValue(''); setCustomUnit('');
  };
  const save = async () => {
    if (!userId || error || loading || saving) return;
    if (customName || customValue || customUnit) { toast.error('Add your custom metric or clear its fields before saving.'); return; }
    const parsed = checkinMetricsSchema.safeParse(metrics);
    if (!parsed.success || !/^\d{2}:\d{2}$/.test(time)) { toast.error('Check the time and metric ranges. Leave unmeasured values blank.'); return; }
    if (!numericFields.some(field => metrics[field.key] !== null) && !metrics.sideEffects.trim() && !metrics.notes.trim() && !metrics.custom.length) { toast.error('Add at least one observation.'); return; }
    const observedAt = new Date(`${date}T${time}:00`).toISOString();
    setSaving(true);
    try {
      const { data, error } = await supabase.from('daily_checkins').upsert({ user_id: userId, date, observed_at: observedAt, updated_at: new Date().toISOString(), metrics: parsed.data as Json }, { onConflict: 'user_id,date' }).select('*').single();
      if (error) throw error;
      const record: DailyCheckin = { ...data, metrics: parsed.data };
      setRecords(current => [record, ...current.filter(row => row.date !== date)].sort((a, b) => b.date.localeCompare(a.date)));
      setSavedAt(observedAt); toast.success('Daily check-in saved to your account.');
    } catch { toast.error('Check-in was not saved. Your entries are still here; retry when connected.'); }
    finally { setSaving(false); }
  };
  const exportCsv = () => {
    const rows: unknown[][] = [['Type', 'Date', 'Time', 'Compound', 'Metric', 'Value', 'Unit', 'Notes']];
    doses.filter(dose => dose.date >= since && dose.date <= date).forEach(dose => rows.push(['Dose', dose.date, dose.time, dose.peptide_name, 'Recorded dose', dose.dose, dose.unit, dose.notes || '']));
    records.forEach(record => {
      const m = record.metrics, time = format(new Date(record.observed_at), 'HH:mm');
      for (const [name, value, unit] of [['Sleep', m.sleepHours, 'hours'], ['Weight', m.weightKg, 'kg'], ['Pain', m.painScore, '/10'], ['Energy', m.energyScore, '/10']] as const) {
        if (value !== null) rows.push(['Check-in', record.date, time, '', name, value, unit, '']);
      }
      if (m.sideEffects) rows.push(['Check-in', record.date, time, '', 'Side effects', '', '', m.sideEffects]);
      if (m.notes) rows.push(['Check-in', record.date, time, '', 'Notes', '', '', m.notes]);
      m.custom.forEach(item => rows.push(['Custom metric', record.date, time, '', item.name, item.value, item.unit, '']));
    });
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `psa-tracking-${since}-to-${date}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <Card className="space-y-4 border-primary/20 p-4 sm:p-5">
    <div className="flex flex-wrap justify-between gap-3"><div><h2 className="flex items-center gap-2 text-xl font-semibold"><Activity className="h-5 w-5 text-primary" />Track everything</h2><p className="mt-1 text-sm text-muted-foreground">Check-in for {date}. Record what you measured; blank means unrecorded.</p></div><Link className="text-sm font-medium text-primary underline" to="/bloodwork">Bloodwork reports & results</Link></div>
    {!userId ? <p className="text-sm">Sign in to save your private check-ins.</p> : loading ? <p role="status">Loading check-ins…</p> : error ? <p role="alert" className="text-sm text-destructive">{error}</p> : <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div><Label htmlFor="checkin-time">Time observed (local)</Label><Input id="checkin-time" type="time" value={time} onChange={event => { setTime(event.target.value); setSavedAt(''); }} /></div>
        {numericFields.map(field => <div key={field.key}><Label htmlFor={`checkin-${field.key}`}>{field.label}</Label><Input id={`checkin-${field.key}`} type="number" inputMode="decimal" min={field.key === 'weightKg' ? 0.1 : 0} max={field.max} step={field.step} placeholder="Not recorded" value={metrics[field.key] ?? ''} onChange={event => setField(field.key, event.target.value === '' ? null : Number(event.target.value))} /></div>)}
      </div>
      <div><Label htmlFor="checkin-effects">Side effects or symptoms</Label><Textarea id="checkin-effects" maxLength={2000} value={metrics.sideEffects} onChange={event => setField('sideEffects', event.target.value)} placeholder="What happened, when it began, how severe, and how long? Write ‘none noticed’ only if you checked." /></div>
      <details className="rounded-xl border p-3"><summary className="cursor-pointer font-medium">Add any other metric</summary><p className="my-2 text-sm text-muted-foreground">For example resting heart rate in bpm, waist in cm, or a blood-test result with its exact lab unit. Record the lab reference range in notes.</p>
        <div className="grid gap-2 sm:grid-cols-3"><Input aria-label="Custom metric name" maxLength={80} placeholder="Metric name" value={customName} onChange={event => setCustomName(event.target.value)} /><Input aria-label="Custom metric value" type="number" step="any" placeholder="Value" value={customValue} onChange={event => setCustomValue(event.target.value)} /><Input aria-label="Custom metric unit" maxLength={40} placeholder="Unit" value={customUnit} onChange={event => setCustomUnit(event.target.value)} /></div><Button className="mt-2" variant="outline" onClick={addCustom}><Plus className="mr-2 h-4 w-4" />Add metric</Button>
      </details>
      {metrics.custom.map((item, index) => <div key={index} className="flex items-center justify-between rounded-lg bg-muted/40 p-2 text-sm"><span>{item.name}: {item.value} {item.unit}</span><Button size="icon" variant="ghost" aria-label={`Remove ${item.name}`} onClick={() => setField('custom', metrics.custom.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button></div>)}
      <div><Label htmlFor="checkin-notes">Context and notes</Label><Textarea id="checkin-notes" maxLength={3000} value={metrics.notes} onChange={event => setField('notes', event.target.value)} placeholder="Training, illness, food, medication changes, lab ranges or questions for your clinician." /></div>
      <div className="flex flex-wrap items-center gap-3"><Button disabled={saving} onClick={() => void save()}>{saving ? 'Saving…' : 'Save daily check-in'}</Button><span aria-live="polite" className="text-sm text-muted-foreground">{savedAt ? 'Saved to your account' : 'Unsaved changes'}</span></div>
      <details className="border-t pt-4"><summary className="cursor-pointer font-semibold">Review the last 30 days</summary><p className="my-2 text-sm text-muted-foreground">{since} to {date}. These are your observations; a change does not establish what caused it.</p>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Export doses & check-ins (CSV)</Button>
        <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Date', 'Weight (kg)', 'Sleep (h)', 'Pain /10', 'Side effects'].map(label => <th className="whitespace-nowrap p-2" key={label}>{label}</th>)}</tr></thead><tbody>{records.map(record => <tr key={record.id} className="border-t"><td className="whitespace-nowrap p-2">{record.date}</td><td className="p-2">{record.metrics.weightKg ?? '—'}</td><td className="p-2">{record.metrics.sleepHours ?? '—'}</td><td className="p-2">{record.metrics.painScore ?? '—'}</td><td className="min-w-48 p-2">{record.metrics.sideEffects || 'Not recorded'}</td></tr>)}</tbody></table></div>{records.length === 0 && <p className="mt-3 text-sm">No check-ins in this period yet.</p>}
      </details>
    </>}
  </Card>;
}
