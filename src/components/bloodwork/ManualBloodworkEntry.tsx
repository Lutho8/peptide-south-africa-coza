import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// 32 most common biomarkers (panels grouped). Units kept loose so users can override.
const BIOMARKERS: { key: string; name: string; unit: string; panel: string }[] = [
  { key: 'total_testosterone', name: 'Total Testosterone', unit: 'nmol/L', panel: 'Hormones' },
  { key: 'free_testosterone', name: 'Free Testosterone', unit: 'pmol/L', panel: 'Hormones' },
  { key: 'shbg', name: 'SHBG', unit: 'nmol/L', panel: 'Hormones' },
  { key: 'estradiol', name: 'Estradiol (E2)', unit: 'pmol/L', panel: 'Hormones' },
  { key: 'dhea_s', name: 'DHEA-S', unit: 'µmol/L', panel: 'Hormones' },
  { key: 'cortisol', name: 'Cortisol (AM)', unit: 'nmol/L', panel: 'Hormones' },
  { key: 'prolactin', name: 'Prolactin', unit: 'mIU/L', panel: 'Hormones' },
  { key: 'igf1', name: 'IGF-1', unit: 'ng/mL', panel: 'Growth' },
  { key: 'tsh', name: 'TSH', unit: 'mIU/L', panel: 'Thyroid' },
  { key: 'ft3', name: 'Free T3', unit: 'pmol/L', panel: 'Thyroid' },
  { key: 'ft4', name: 'Free T4', unit: 'pmol/L', panel: 'Thyroid' },
  { key: 'hba1c', name: 'HbA1c', unit: '%', panel: 'Metabolic' },
  { key: 'fasting_glucose', name: 'Fasting Glucose', unit: 'mmol/L', panel: 'Metabolic' },
  { key: 'fasting_insulin', name: 'Fasting Insulin', unit: 'mU/L', panel: 'Metabolic' },
  { key: 'total_cholesterol', name: 'Total Cholesterol', unit: 'mmol/L', panel: 'Lipids' },
  { key: 'ldl', name: 'LDL', unit: 'mmol/L', panel: 'Lipids' },
  { key: 'hdl', name: 'HDL', unit: 'mmol/L', panel: 'Lipids' },
  { key: 'triglycerides', name: 'Triglycerides', unit: 'mmol/L', panel: 'Lipids' },
  { key: 'alt', name: 'ALT', unit: 'U/L', panel: 'Liver' },
  { key: 'ast', name: 'AST', unit: 'U/L', panel: 'Liver' },
  { key: 'ggt', name: 'GGT', unit: 'U/L', panel: 'Liver' },
  { key: 'alp', name: 'ALP', unit: 'U/L', panel: 'Liver' },
  { key: 'creatinine', name: 'Creatinine', unit: 'µmol/L', panel: 'Renal' },
  { key: 'egfr', name: 'eGFR', unit: 'mL/min', panel: 'Renal' },
  { key: 'crp', name: 'CRP', unit: 'mg/L', panel: 'Inflammation' },
  { key: 'homocysteine', name: 'Homocysteine', unit: 'µmol/L', panel: 'Inflammation' },
  { key: 'vitamin_d', name: 'Vitamin D (25-OH)', unit: 'nmol/L', panel: 'Nutrients' },
  { key: 'b12', name: 'Vitamin B12', unit: 'pmol/L', panel: 'Nutrients' },
  { key: 'ferritin', name: 'Ferritin', unit: 'µg/L', panel: 'Nutrients' },
  { key: 'hemoglobin', name: 'Hemoglobin', unit: 'g/dL', panel: 'Hematology' },
  { key: 'wbc', name: 'WBC', unit: '10^9/L', panel: 'Hematology' },
  { key: 'platelets', name: 'Platelets', unit: '10^9/L', panel: 'Hematology' },
];

const PANELS = Array.from(new Set(BIOMARKERS.map((b) => b.panel)));

interface Props {
  labReportId?: string | null;
  onSaved?: () => void;
}

export function ManualBloodworkEntry({ labReportId, onSaved }: Props) {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [labName, setLabName] = useState('');

  const save = async () => {
    if (!user) return;
    const entered = BIOMARKERS
      .filter((b) => values[b.key] && !Number.isNaN(Number(values[b.key])))
      .map((b) => ({
        name: b.name,
        short_name: b.key,
        value: Number(values[b.key]),
        unit: b.unit,
        category: b.panel.toLowerCase(),
        status: 'normal',
      }));
    if (entered.length === 0) {
      toast.error('Enter at least one biomarker value.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        status: 'completed' as const,
        file_name: labName || 'Manual entry',
        file_url: 'manual-entry',
        scan_type: 'baseline' as const,
        extracted_biomarkers: entered,
        ai_summary: 'Manual entry — biomarkers typed in by the user.',
      };
      if (labReportId) {
        const { error } = await supabase.from('lab_reports').update(payload).eq('id', labReportId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lab_reports').insert(payload);
        if (error) throw error;
      }
      toast.success(`${entered.length} biomarkers saved`);
      onSaved?.();
    } catch (e) {
      console.error('[manual-entry] save failed', e);
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4 sm:p-5 space-y-5">
      <div>
        <h3 className="text-base font-bold text-foreground">Enter your biomarkers manually</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Fill what you have from your report — leave the rest blank. We'll save them to your Results.
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lab name (optional)</label>
        <Input
          value={labName}
          onChange={(e) => setLabName(e.target.value)}
          placeholder="e.g. Lancet, Pathcare, Synlab"
          className="mt-1.5"
        />
      </div>
      {PANELS.map((panel) => (
        <div key={panel} className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">{panel}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BIOMARKERS.filter((b) => b.panel === panel).map((b) => (
              <div key={b.key} className="flex items-center gap-2">
                <label htmlFor={`bm-${b.key}`} className="flex-1 text-xs text-foreground min-w-0 truncate">{b.name}</label>
                <Input
                  id={`bm-${b.key}`}
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={values[b.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [b.key]: e.target.value }))}
                  placeholder="—"
                  className="w-24 h-9 text-sm"
                />
                <span className="text-[10px] text-muted-foreground w-16 shrink-0">{b.unit}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? <><Loader2 size={14} className="mr-1.5 animate-spin" /> Saving…</> : <><Save size={14} className="mr-1.5" /> Save biomarkers</>}
      </Button>
    </div>
  );
}
