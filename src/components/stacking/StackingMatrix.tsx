import { useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { peptides } from '@/data/peptides';
import { 
  getCompatibility, 
  getCompatibilityColor, 
  getCompatibilityBgColor,
  getCompatibilityLabel,
  StackingInteraction,
  CompatibilityLevel
} from '@/data/stackingMatrix';
import { cn } from '@/lib/utils';
import { Info, Zap, Check, AlertTriangle, X, Clock } from 'lucide-react';

interface StackingMatrixProps {
  onSelectInteraction?: (interaction: StackingInteraction) => void;
}

export function StackingMatrix({ onSelectInteraction }: StackingMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{ p1: string; p2: string } | null>(null);
  const [selectedInteraction, setSelectedInteraction] = useState<StackingInteraction | null>(null);

  const handleCellClick = (p1Id: string, p2Id: string) => {
    if (p1Id === p2Id) return;
    
    const interaction = getCompatibility(p1Id, p2Id);
    setSelectedCell({ p1: p1Id, p2: p2Id });
    setSelectedInteraction(interaction);
    
    if (interaction && onSelectInteraction) {
      onSelectInteraction(interaction);
    }
  };

  const getCompatibilityIcon = (level: CompatibilityLevel) => {
    switch (level) {
      case 'synergistic':
        return <Zap size={10} className="text-green-400" />;
      case 'compatible':
        return <Check size={10} className="text-blue-400" />;
      case 'caution':
        return <AlertTriangle size={10} className="text-yellow-400" />;
      case 'avoid':
        return <X size={10} className="text-red-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-muted-foreground">Synergistic</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-muted-foreground">Compatible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-muted-foreground">Caution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-muted-foreground">Avoid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted" />
          <span className="text-muted-foreground">No Data</span>
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-1 text-left text-xs text-muted-foreground font-medium w-16"></th>
                {peptides.map(p => (
                  <th 
                    key={p.id} 
                    className="p-1 text-center text-[10px] text-muted-foreground font-medium"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', height: '60px' }}
                  >
                    {p.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peptides.map(p1 => (
                <tr key={p1.id}>
                  <td className="p-1 text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {p1.shortName}
                  </td>
                  {peptides.map(p2 => {
                    if (p1.id === p2.id) {
                      return (
                        <td key={p2.id} className="p-0.5">
                          <div className="w-6 h-6 bg-card rounded-sm" />
                        </td>
                      );
                    }
                    
                    const interaction = getCompatibility(p1.id, p2.id);
                    const isSelected = selectedCell?.p1 === p1.id && selectedCell?.p2 === p2.id;
                    
                    return (
                      <td key={p2.id} className="p-0.5">
                        <button
                          onClick={() => handleCellClick(p1.id, p2.id)}
                          className={cn(
                            "w-6 h-6 rounded-sm flex items-center justify-center transition-all hover:scale-110",
                            interaction ? getCompatibilityColor(interaction.compatibility) : 'bg-muted/30',
                            isSelected && "ring-2 ring-white"
                          )}
                          title={interaction ? getCompatibilityLabel(interaction.compatibility) : 'No interaction data'}
                        >
                          {interaction && getCompatibilityIcon(interaction.compatibility)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Interaction Details */}
      {selectedInteraction && (
        <GradientCard className={cn("fade-in", getCompatibilityBgColor(selectedInteraction.compatibility))}>
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              getCompatibilityColor(selectedInteraction.compatibility)
            )}>
              {getCompatibilityIcon(selectedInteraction.compatibility)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">
                  {peptides.find(p => p.id === selectedInteraction.peptideId1)?.shortName}
                </span>
                <span className="text-muted-foreground">+</span>
                <span className="font-medium text-foreground">
                  {peptides.find(p => p.id === selectedInteraction.peptideId2)?.shortName}
                </span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  selectedInteraction.compatibility === 'synergistic' && "bg-green-500/30 text-green-400",
                  selectedInteraction.compatibility === 'compatible' && "bg-blue-500/30 text-blue-400",
                  selectedInteraction.compatibility === 'caution' && "bg-yellow-500/30 text-yellow-400",
                  selectedInteraction.compatibility === 'avoid' && "bg-red-500/30 text-red-400"
                )}>
                  {getCompatibilityLabel(selectedInteraction.compatibility)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedInteraction.notes}
              </p>
              {selectedInteraction.timing && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Clock size={12} />
                  <span>{selectedInteraction.timing}</span>
                </div>
              )}
            </div>
          </div>
        </GradientCard>
      )}

      {/* Hint */}
      {!selectedInteraction && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info size={14} />
          <span>Tap any cell in the matrix to see detailed interaction information</span>
        </div>
      )}
    </div>
  );
}
