import { GradientCard } from '@/components/ui/GradientCard';
import { getBodyCompositionHistory } from '@/services/storage';
import { TrendingDown, Target, Activity, Droplets } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BodyCompositionCardProps {
  onViewDetails: () => void;
}

export function BodyCompositionCard({ onViewDetails }: BodyCompositionCardProps) {
  const history = getBodyCompositionHistory();
  const latest = history[0];
  if (!latest) {
    return (
      <GradientCard variant="primary" hover onClick={onViewDetails} className="relative overflow-hidden">
        <div className="flex items-center gap-3 py-4">
          <Activity size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Body Composition</h3>
            <p className="text-sm text-muted-foreground">Tap to add your first entry</p>
          </div>
        </div>
      </GradientCard>
    );
  }

  const targetBodyFat = 15;
  const progressToGoal = ((19 - latest.bodyFat) / (19 - targetBodyFat)) * 100;

  return (
    <GradientCard 
      variant="primary" 
      hover 
      onClick={onViewDetails}
      className="relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Body Composition</h3>
          <p className="text-xs text-muted-foreground">Last updated: {latest.date}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Activity size={20} className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Weight</p>
          <p className="text-2xl font-bold text-foreground">{latest.weight}<span className="text-sm font-normal text-muted-foreground"> kg</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Body Fat</p>
          <p className="text-2xl font-bold text-foreground">{latest.bodyFat}<span className="text-sm font-normal text-muted-foreground">%</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Muscle Mass</p>
          <p className="text-xl font-semibold text-foreground">{latest.muscleMass}<span className="text-sm font-normal text-muted-foreground"> kg</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Skeletal Muscle</p>
          <p className="text-xl font-semibold text-foreground">{latest.skeletalMuscle}<span className="text-sm font-normal text-muted-foreground">%</span></p>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">Goal: {targetBodyFat}% body fat</span>
          </div>
          <span className="text-xs font-medium text-primary">{(latest.bodyFat - targetBodyFat).toFixed(1)}% to go</span>
        </div>
        <Progress value={Math.max(0, progressToGoal)} className="h-2" />
      </div>
    </GradientCard>
  );
}
