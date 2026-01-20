import { GradientCard } from '@/components/ui/GradientCard';
import { activeStack } from '@/data/userData';
import { peptides, getCategoryGradient } from '@/data/peptides';
import { Layers, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveStackPreviewProps {
  onViewStack: () => void;
}

export function ActiveStackPreview({ onViewStack }: ActiveStackPreviewProps) {
  const stackPeptides = activeStack.map(item => {
    const peptide = peptides.find(p => p.id === item.peptideId);
    return peptide;
  }).filter(Boolean);

  return (
    <GradientCard hover onClick={onViewStack}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Layers size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Active Protocol</h3>
            <p className="text-sm text-muted-foreground">{activeStack.length} peptides</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>

      <div className="flex flex-wrap gap-2">
        {stackPeptides.slice(0, 6).map((peptide) => (
          <div
            key={peptide!.id}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold",
              getCategoryGradient(peptide!.category)
            )}
            title={peptide!.name}
          >
            {peptide!.shortName.slice(0, 3)}
          </div>
        ))}
        {stackPeptides.length > 6 && (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
            +{stackPeptides.length - 6}
          </div>
        )}
      </div>
    </GradientCard>
  );
}
