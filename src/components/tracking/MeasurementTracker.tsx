import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Ruler, TrendingDown, TrendingUp, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Measurement {
  id: string;
  date: string;
  waist_cm: number | null;
  hips_cm: number | null;
  chest_cm: number | null;
  left_arm_cm: number | null;
  right_arm_cm: number | null;
  left_thigh_cm: number | null;
  right_thigh_cm: number | null;
  notes: string | null;
}

const FIELDS = [
  { key: 'waist_cm', label: 'Waist', unit: 'cm' },
  { key: 'hips_cm', label: 'Hips', unit: 'cm' },
  { key: 'chest_cm', label: 'Chest', unit: 'cm' },
  { key: 'left_arm_cm', label: 'Left Arm', unit: 'cm' },
  { key: 'right_arm_cm', label: 'Right Arm', unit: 'cm' },
  { key: 'left_thigh_cm', label: 'Left Thigh', unit: 'cm' },
  { key: 'right_thigh_cm', label: 'Right Thigh', unit: 'cm' },
] as const;

function Trend({ current, previous }: { current: number | null; previous: number | null }) {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return <Minus size={14} className="text-muted-foreground" />;
  if (diff < 0) return <TrendingDown size={14} className="text-green-400" />;
  return <TrendingUp size={14} className="text-orange-400" />;
}

export function MeasurementTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [history, setHistory] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30);
    setHistory((data as Measurement[]) || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    const hasValue = FIELDS.some(f => form[f.key]);
    if (!hasValue) {
      toast({ title: 'Enter at least one measurement', variant: 'destructive' });
      return;
    }

    const entry: Record<string, unknown> = {
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      notes: form.notes || null,
    };
    FIELDS.forEach(f => {
      entry[f.key] = form[f.key] ? parseFloat(form[f.key]) : null;
    });

    const { error } = await supabase.from('measurements').insert(entry as any);
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Measurements saved!' });
    setForm({});
    setShowForm(false);
    fetchHistory();
  };

  const latest = history[0];
  const previous = history[1];

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Add Entry */}
      <Button variant="outline" className="w-full gap-2" onClick={() => setShowForm(!showForm)}>
        <Plus size={16} />
        Log Measurements
      </Button>

      {showForm && (
        <GradientCard className="space-y-3">
          <p className="text-sm text-muted-foreground">Enter today's measurements (cm):</p>
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map(f => (
              <div key={f.key} className="space-y-1">
                <Label className="text-xs">{f.label} (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="bg-muted"
                  value={form[f.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Input
              placeholder="Optional notes..."
              className="bg-muted"
              value={form.notes || ''}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <Button className="w-full gap-2" onClick={handleSave}>
            <Save size={16} /> Save
          </Button>
        </GradientCard>
      )}

      {/* Latest Metrics */}
      {latest ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Latest reading</span>
            <span className="text-sm font-medium text-foreground">{latest.date}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map(f => {
              const val = latest[f.key as keyof Measurement] as number | null;
              const prev = previous?.[f.key as keyof Measurement] as number | null;
              if (val == null) return null;
              return (
                <GradientCard key={f.key} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler size={14} className="text-primary" />
                      <span className="text-xs text-muted-foreground">{f.label}</span>
                    </div>
                    <Trend current={val} previous={prev} />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-foreground">{val}</span>
                    <span className="text-sm text-muted-foreground ml-1">cm</span>
                  </div>
                  {prev != null && (
                    <span className={cn("text-xs", val < prev ? "text-green-400" : val > prev ? "text-orange-400" : "text-muted-foreground")}>
                      {val < prev ? `${(prev - val).toFixed(1)} cm lost` : val > prev ? `+${(val - prev).toFixed(1)} cm` : 'No change'}
                    </span>
                  )}
                </GradientCard>
              );
            })}
          </div>

          {/* History */}
          <Button
            variant="ghost"
            className="w-full gap-2 text-sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showHistory ? 'Hide' : 'Show'} History ({history.length} entries)
          </Button>

          {showHistory && (
            <div className="space-y-2">
              {history.slice(0, 10).map((entry, i) => (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg text-sm",
                    i === 0 ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                  )}
                >
                  <span className="text-foreground">{entry.date}</span>
                  <div className="flex gap-3 text-muted-foreground text-xs">
                    {entry.waist_cm && <span>W:{entry.waist_cm}</span>}
                    {entry.chest_cm && <span>C:{entry.chest_cm}</span>}
                    {entry.hips_cm && <span>H:{entry.hips_cm}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground py-8">No measurements yet. Log your first entry!</p>
      )}
    </div>
  );
}
