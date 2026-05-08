import { useEffect, useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { getActiveStack, type ActiveStackItem } from '@/services/storage';
import { peptides, getCategoryGradient } from '@/data/peptides';
import { Layers, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveStackPreviewProps {
  onViewStack: () => void;
}

export function ActiveStackPreview({ onViewStack }: ActiveStackPreviewProps) {
  const [userStack, setUserStack] = useState<ActiveStackItem[]>([]);

  useEffect(() => {
    const refresh = () => setUserStack(getActiveStack());
    refresh();
    // Stay in sync with cloud hydration after login and with edits made
    // elsewhere (e.g. MyStackScreen save).
    window.addEventListener('rtd:cloud-hydrated', refresh);
    window.addEventListener('rtd:stack-changed', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('rtd:cloud-hydrated', refresh);
      window.removeEventListener('rtd:stack-changed', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const stackPeptides = userStack
    .map((item) => peptides.find((p) => p.id === item.peptideId))
    .filter(Boolean);

  // Empty state — guide new members to build their stack
  if (userStack.length === 0) {
    return (
      <GradientCard hover onClick={onViewStack} className="border-dashed border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Plus size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Build Your Stack</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add your first peptide to start tracking
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-primary" />
        </div>
      </GradientCard>
    );
  }

  return (
    <GradientCard hover onClick={onViewStack}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Layers size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Active Protocol</h3>
            <p className="text-sm text-muted-foreground">{userStack.length} peptides</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>

      <div className="flex flex-wrap gap-2">
        {stackPeptides.slice(0, 6).map((peptide) => (
          <div
            key={peptide!.id}
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold',
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
