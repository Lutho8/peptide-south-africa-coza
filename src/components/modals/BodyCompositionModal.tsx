import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { bodyCompositionHistory } from '@/data/userData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, TrendingDown, TrendingUp, Minus, Activity, Droplets, Flame, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showAddEntry, setShowAddEntry] = useState(false);
  const latest = bodyCompositionHistory[0];
  const previous = bodyCompositionHistory[1];

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
          <DialogTitle className="text-foreground">Body Composition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Entry Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAddEntry(!showAddEntry)}
          >
            <Plus size={16} />
            Add New Entry
          </Button>

          {/* Add Entry Form (simplified) */}
          {showAddEntry && (
            <GradientCard className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your latest Renpho scale readings:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input type="number" placeholder="105.3" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Body Fat (%)</Label>
                  <Input type="number" placeholder="19.0" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Muscle Mass (kg)</Label>
                  <Input type="number" placeholder="81" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Visceral Fat</Label>
                  <Input type="number" placeholder="13" className="bg-muted" />
                </div>
              </div>
              <Button className="w-full">Save Entry</Button>
            </GradientCard>
          )}

          {/* Latest Reading Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Latest reading</span>
            <span className="text-sm font-medium text-foreground">{latest.date}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const status = getStatusColor(metric.key, metric.value);
              const prevValue = previous[metric.key as keyof typeof previous] as number;

              return (
                <GradientCard key={metric.key} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-primary" />
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                    </div>
                    {getTrend(metric.value, prevValue)}
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

          {/* Goal Progress */}
          <GradientCard variant="primary">
            <h3 className="font-medium text-foreground mb-2">Goal Progress</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Body Fat Target</span>
                <span className="text-foreground">15% (Currently {latest.bodyFat}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((19 - latest.bodyFat) / (19 - 15)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {(latest.bodyFat - 15).toFixed(1)}% more to reach your target
              </p>
            </div>
          </GradientCard>

          {/* History */}
          <div>
            <h3 className="font-medium text-foreground mb-2">History</h3>
            <div className="space-y-2">
              {bodyCompositionHistory.map((entry, index) => (
                <div 
                  key={entry.date}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    index === 0 ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                  )}
                >
                  <span className="text-sm text-foreground">{entry.date}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{entry.weight}kg</span>
                    <span className="text-muted-foreground">{entry.bodyFat}% BF</span>
                    <span className="text-muted-foreground">{entry.muscleMass}kg MM</span>
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
