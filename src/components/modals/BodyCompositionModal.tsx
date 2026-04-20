import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getBodyCompositionHistory, 
  saveBodyCompositionEntry,
  BodyComposition 
} from '@/services/storage';
import { BodyCompositionCharts } from '@/components/charts/BodyCompositionCharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, TrendingDown, TrendingUp, Minus, Activity, Droplets, Flame, Heart, Save, BarChart3, Grid3X3, AlertCircle, Bluetooth, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Validation schema for body composition entry
const bodyCompositionSchema = z.object({
  weight: z.number({ required_error: "Weight is required" })
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight must be less than 300 kg"),
  bodyFat: z.number().min(2, "Body fat must be at least 2%").max(60, "Body fat must be less than 60%").optional(),
  muscleMass: z.number().min(10, "Muscle mass must be at least 10 kg").max(200, "Muscle mass must be less than 200 kg").optional(),
  visceralFat: z.number().min(1, "Visceral fat must be at least 1").max(60, "Visceral fat must be less than 60").optional(),
  skeletalMuscle: z.number().min(10, "Skeletal muscle must be at least 10%").max(70, "Skeletal muscle must be less than 70%").optional(),
  bodyWater: z.number().min(30, "Body water must be at least 30%").max(80, "Body water must be less than 80%").optional(),
  boneMass: z.number().min(1, "Bone mass must be at least 1 kg").max(10, "Bone mass must be less than 10 kg").optional(),
  protein: z.number().min(5, "Protein must be at least 5%").max(30, "Protein must be less than 30%").optional(),
  bmr: z.number().min(800, "BMR must be at least 800 kcal").max(4000, "BMR must be less than 4000 kcal").optional(),
  metabolicAge: z.number().min(12, "Metabolic age must be at least 12").max(100, "Metabolic age must be less than 100").optional(),
});

type ValidationErrors = Partial<Record<keyof z.infer<typeof bodyCompositionSchema>, string>>;
interface BodyCompositionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getStatusColor(metric: string, value: number): { color: string; label: string } {
  switch (metric) {
    case 'bodyFat':
      if (value < 15) return { color: 'text-green-400', label: 'Excellent' };
      if (value < 20) return { color: 'text-yellow-400', label: 'Healthy' };
      return { color: 'text-orange-400', label: 'Above Target' };
    case 'muscleMass':
      if (value >= 80) return { color: 'text-green-400', label: 'Excellent' };
      if (value >= 70) return { color: 'text-yellow-400', label: 'Good' };
      return { color: 'text-orange-400', label: 'Below Target' };
    case 'visceralFat':
      if (value <= 10) return { color: 'text-green-400', label: 'Healthy' };
      if (value <= 14) return { color: 'text-yellow-400', label: 'Moderate' };
      return { color: 'text-red-400', label: 'High' };
    default:
      return { color: 'text-primary', label: 'On Track' };
  }
}

function getTrend(current: number, previous: number): React.ReactNode {
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return <Minus size={14} className="text-muted-foreground" />;
  if (diff > 0) return <TrendingUp size={14} className="text-green-400" />;
  return <TrendingDown size={14} className="text-red-400" />;
}

export function BodyCompositionModal({ open, onOpenChange }: BodyCompositionModalProps) {
  const { user } = useAuth();
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [viewMode, setViewMode] = useState<'metrics' | 'charts'>('metrics');
  const [history, setHistory] = useState<BodyComposition[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<BodyComposition>>({
    weight: undefined,
    bodyFat: undefined,
    muscleMass: undefined,
    visceralFat: undefined,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      // Fetch from cloud first, fallback to localStorage
      const fetchFromCloud = async () => {
        const { data } = await supabase
          .from('body_composition')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(50);
        
        if (data && data.length > 0) {
          const mapped: BodyComposition[] = data.map(d => ({
            date: d.date,
            weight: Number(d.weight),
            bmi: Number(d.bmi || 0),
            bodyFat: Number(d.body_fat || 0),
            fatFreeWeight: Number(d.fat_free_weight || 0),
            muscleMass: Number(d.muscle_mass || 0),
            skeletalMuscle: Number(d.skeletal_muscle || 0),
            bodyWater: Number(d.body_water || 0),
            subcutaneousFat: Number(d.subcutaneous_fat || 0),
            visceralFat: Number(d.visceral_fat || 0),
            boneMass: Number(d.bone_mass || 0),
            protein: Number(d.protein || 0),
            bmr: Number(d.bmr || 0),
            metabolicAge: Number(d.metabolic_age || 0),
            source: (d.source as string) || 'manual',
          }));
          setHistory(mapped);
        } else {
          setHistory(getBodyCompositionHistory());
        }
      };
      fetchFromCloud();
    } else if (open) {
      setHistory(getBodyCompositionHistory());
    }
  }, [open, user]);

  const latest = history[0];
  const previous = history[1];
  // Any non-manual source is a Bluetooth-sourced entry (renpho, xiaomi, eufy, yunmai, etc.)
  const recentBtEntry = history.find(
    (h) =>
      h.source &&
      h.source !== 'manual' &&
      Date.now() - new Date(h.date).getTime() < 24 * 60 * 60 * 1000
  );
  const recentBrandLabel = recentBtEntry?.source
    ? recentBtEntry.source.charAt(0).toUpperCase() + recentBtEntry.source.slice(1)
    : null;

  const validateField = (field: keyof z.infer<typeof bodyCompositionSchema>, value: number | undefined) => {
    if (value === undefined) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }
    
    const fieldSchema = bodyCompositionSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    
    if (!result.success) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: result.error.errors[0]?.message || 'Invalid value'
      }));
    } else {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFieldChange = (field: keyof z.infer<typeof bodyCompositionSchema>, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setNewEntry(prev => ({ ...prev, [field]: numValue }));
    validateField(field, numValue);
  };

  const handleSaveEntry = async () => {
    // Build validation object
    const toValidate: Record<string, number | undefined> = {
      weight: newEntry.weight,
      bodyFat: newEntry.bodyFat,
      muscleMass: newEntry.muscleMass,
      visceralFat: newEntry.visceralFat,
    };

    const result = bodyCompositionSchema.safeParse(toValidate);
    
    if (!result.success) {
      const errors: ValidationErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof ValidationErrors;
        errors[field] = err.message;
      });
      setValidationErrors(errors);
      
      toast({
        title: "Validation error",
        description: result.error.errors[0]?.message || "Please check your inputs.",
        variant: "destructive"
      });
      return;
    }

    const entry: BodyComposition = {
      date: new Date().toISOString().split('T')[0],
      weight: newEntry.weight || 0,
      bmi: newEntry.weight ? parseFloat((newEntry.weight / Math.pow(1.86, 2)).toFixed(1)) : 0,
      bodyFat: newEntry.bodyFat || latest?.bodyFat || 0,
      fatFreeWeight: newEntry.weight && newEntry.bodyFat 
        ? parseFloat((newEntry.weight * (1 - newEntry.bodyFat / 100)).toFixed(1)) 
        : latest?.fatFreeWeight || 0,
      muscleMass: newEntry.muscleMass || latest?.muscleMass || 0,
      skeletalMuscle: newEntry.skeletalMuscle || latest?.skeletalMuscle || 0,
      bodyWater: newEntry.bodyWater || latest?.bodyWater || 0,
      subcutaneousFat: latest?.subcutaneousFat || 0,
      visceralFat: newEntry.visceralFat || latest?.visceralFat || 0,
      boneMass: newEntry.boneMass || latest?.boneMass || 0,
      protein: newEntry.protein || latest?.protein || 0,
      bmr: newEntry.bmr || latest?.bmr || 0,
      metabolicAge: newEntry.metabolicAge || latest?.metabolicAge || 0,
      source: 'manual',
    };

    saveBodyCompositionEntry(entry);
    setHistory([entry, ...history]);

    // Save to cloud if logged in
    if (user) {
      try {
        await supabase.from('body_composition').upsert({
          user_id: user.id,
          date: entry.date,
          weight: entry.weight,
          body_fat: entry.bodyFat,
          fat_free_weight: entry.fatFreeWeight,
          muscle_mass: entry.muscleMass,
          skeletal_muscle: entry.skeletalMuscle,
          body_water: entry.bodyWater,
          subcutaneous_fat: entry.subcutaneousFat,
          bone_mass: entry.boneMass,
          protein: entry.protein,
          bmi: entry.bmi,
          visceral_fat: entry.visceralFat,
          metabolic_age: entry.metabolicAge,
          bmr: entry.bmr,
          source: 'manual',
        }, { onConflict: 'user_id,date' });
      } catch (err) {
        console.error('Error saving to cloud:', err);
      }
    }

    setNewEntry({});
    setValidationErrors({});
    setShowAddEntry(false);
    
    toast({
      title: "Entry saved",
      description: "Your body composition data has been recorded.",
    });
  };

  if (!latest) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Body Composition</DialogTitle>
          <DialogDescription className="sr-only">Track your body composition metrics</DialogDescription>
        </DialogHeader>
          <p className="text-muted-foreground text-center py-8">No data yet. Add your first entry!</p>
        </DialogContent>
      </Dialog>
    );
  }

  const metrics = [
    { key: 'weight', label: 'Weight', value: latest.weight, unit: 'kg', icon: Activity },
    { key: 'bmi', label: 'BMI', value: latest.bmi, unit: '', icon: Activity },
    { key: 'bodyFat', label: 'Body Fat', value: latest.bodyFat, unit: '%', icon: Flame },
    { key: 'fatFreeWeight', label: 'Fat-Free Weight', value: latest.fatFreeWeight, unit: 'kg', icon: Activity },
    { key: 'muscleMass', label: 'Muscle Mass', value: latest.muscleMass, unit: 'kg', icon: Activity },
    { key: 'skeletalMuscle', label: 'Skeletal Muscle', value: latest.skeletalMuscle, unit: '%', icon: Activity },
    { key: 'bodyWater', label: 'Body Water', value: latest.bodyWater, unit: '%', icon: Droplets },
    { key: 'subcutaneousFat', label: 'Subcutaneous Fat', value: latest.subcutaneousFat, unit: '%', icon: Flame },
    { key: 'visceralFat', label: 'Visceral Fat', value: latest.visceralFat, unit: '', icon: Heart },
    { key: 'boneMass', label: 'Bone Mass', value: latest.boneMass, unit: 'kg', icon: Activity },
    { key: 'protein', label: 'Protein', value: latest.protein, unit: '%', icon: Activity },
    { key: 'bmr', label: 'BMR', value: latest.bmr, unit: 'kcal', icon: Flame },
    { key: 'metabolicAge', label: 'Metabolic Age', value: latest.metabolicAge, unit: 'years', icon: Activity },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-foreground">Body Composition</DialogTitle>
            {recentBtEntry && (
              <span className="inline-flex items-center gap-1 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-full px-2 py-0.5 text-xs font-medium">
                <Bluetooth size={10} />
                Connected to {recentBrandLabel} ✓
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick action row */}
          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              onClick={() => {
                if (!showAddEntry && latest) {
                  // Prefill with latest values for easy editing
                  setNewEntry({
                    weight: latest.weight,
                    bodyFat: latest.bodyFat,
                    muscleMass: latest.muscleMass,
                    visceralFat: latest.visceralFat,
                  });
                }
                setShowAddEntry(!showAddEntry);
              }}
            >
              {latest ? <Pencil size={16} /> : <Plus size={16} />}
              {latest ? "Log / Update Today's Reading" : "Add First Entry"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Connect Bluetooth scale (in Settings)"
              onClick={() => {
                onOpenChange(false);
                window.location.href = '/?screen=settings';
              }}
            >
              <Bluetooth size={16} />
            </Button>
          </div>

          {/* Add Entry Form */}
          {showAddEntry && (
            <GradientCard className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your body composition readings (all values in kg):
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg) *</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    min="20"
                    max="300"
                    placeholder="105.3" 
                    className={cn("bg-muted", validationErrors.weight && "border-destructive")}
                    value={newEntry.weight ?? ''}
                    onChange={(e) => handleFieldChange('weight', e.target.value)}
                  />
                  {validationErrors.weight && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} />
                      {validationErrors.weight}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Body Fat (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    min="2"
                    max="60"
                    placeholder="19.0" 
                    className={cn("bg-muted", validationErrors.bodyFat && "border-destructive")}
                    value={newEntry.bodyFat ?? ''}
                    onChange={(e) => handleFieldChange('bodyFat', e.target.value)}
                  />
                  {validationErrors.bodyFat && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} />
                      {validationErrors.bodyFat}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Muscle Mass (kg)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    min="10"
                    max="200"
                    placeholder="81" 
                    className={cn("bg-muted", validationErrors.muscleMass && "border-destructive")}
                    value={newEntry.muscleMass ?? ''}
                    onChange={(e) => handleFieldChange('muscleMass', e.target.value)}
                  />
                  {validationErrors.muscleMass && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} />
                      {validationErrors.muscleMass}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Visceral Fat</Label>
                  <Input 
                    type="number" 
                    min="1"
                    max="60"
                    placeholder="13" 
                    className={cn("bg-muted", validationErrors.visceralFat && "border-destructive")}
                    value={newEntry.visceralFat ?? ''}
                    onChange={(e) => handleFieldChange('visceralFat', e.target.value)}
                  />
                  {validationErrors.visceralFat && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} />
                      {validationErrors.visceralFat}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                All weight values are in kilograms (kg)
              </p>
              <Button 
                className="w-full gap-2" 
                onClick={handleSaveEntry}
                disabled={Object.keys(validationErrors).length > 0}
              >
                <Save size={16} />
                Save Entry
              </Button>
            </GradientCard>
          )}

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'metrics' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setViewMode('metrics')}
            >
              <Grid3X3 size={14} />
              Metrics
            </Button>
            <Button
              variant={viewMode === 'charts' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setViewMode('charts')}
            >
              <BarChart3 size={14} />
              Trends
            </Button>
          </div>

          {/* Latest Reading Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Latest reading</span>
            <span className="text-sm font-medium text-foreground">{latest.date}</span>
          </div>

          {/* Charts View */}
          {viewMode === 'charts' && (
            <GradientCard>
              <BodyCompositionCharts history={history} />
            </GradientCard>
          )}

          {/* Metrics Grid */}
          {viewMode === 'metrics' && (
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const status = getStatusColor(metric.key, metric.value);
                const prevValue = previous?.[metric.key as keyof BodyComposition] as number;

                return (
                  <GradientCard key={metric.key} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-primary" />
                        <span className="text-xs text-muted-foreground">{metric.label}</span>
                      </div>
                      {previous && getTrend(metric.value, prevValue)}
                    </div>
                    <div className="mt-2">
                      <span className="text-xl font-bold text-foreground">{metric.value}</span>
                      <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                    </div>
                    <span className={cn("text-xs", status.color)}>{status.label}</span>
                  </GradientCard>
                );
              })}
            </div>
          )}

          {/* Goal Progress */}
          {(() => {
            const target = 15;
            const current = latest.bodyFat ?? target;
            const baseline = Math.max(current, target + 0.1);
            const pct = Math.max(0, Math.min(100, ((baseline - current) / (baseline - target)) * 100));
            return (
              <GradientCard variant="primary">
                <h3 className="font-medium text-foreground mb-2">Goal Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Body Fat Target</span>
                    <span className="text-foreground">{target}% (Currently {current}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.max(0, current - target).toFixed(1)}% more to reach your target
                  </p>
                </div>
              </GradientCard>
            );
          })()}

          {/* History */}
          <div>
            <h3 className="font-medium text-foreground mb-2">History</h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((entry, index) => (
                <div 
                  key={entry.date + index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    index === 0 ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{entry.date}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase",
                      entry.source && entry.source !== 'manual'
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-violet-500/20 text-violet-400"
                    )}>
                      {entry.source || 'manual'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{entry.weight}kg</span>
                    <span className="text-muted-foreground">{entry.bodyFat}%</span>
                    <span className="text-muted-foreground">{entry.muscleMass}kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
