import { useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { peptides, getCategoryLabel } from '@/data/peptides';
import { AlertTriangle, Calculator, Droplets, Syringe, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export function DosageScreen() {
  const [vialSize, setVialSize] = useState('5');
  const [bacWater, setBacWater] = useState('2');
  const [targetDose, setTargetDose] = useState('250');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'athlete'>('intermediate');
  const [expandedPeptide, setExpandedPeptide] = useState<string | null>(null);

  const vialMg = parseFloat(vialSize) || 0;
  const waterMl = parseFloat(bacWater) || 0;
  const targetMcg = parseFloat(targetDose) || 0;

  const concentration = waterMl > 0 ? (vialMg * 1000) / waterMl : 0; // mcg per ml
  const volumeNeeded = concentration > 0 ? targetMcg / concentration : 0; // ml
  const insulinUnits = volumeNeeded * 100; // 100 units = 1ml

  const experienceLevels = [
    { id: 'beginner' as const, label: 'Beginner' },
    { id: 'intermediate' as const, label: 'Intermediate' },
    { id: 'advanced' as const, label: 'Advanced' },
    { id: 'athlete' as const, label: 'Athlete' },
  ];

  return (
    <div className="pb-24 space-y-6 fade-in">
      <h1 className="text-2xl font-bold text-foreground">Dosage Calculator</h1>

      {/* Safety Warning */}
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-400">Safety First</h3>
            <p className="text-xs text-yellow-200/80 mt-1">
              Always verify calculations independently. Start with the lowest recommended dose. 
              These calculations are for reference only - consult professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Reconstitution Calculator */}
      <GradientCard variant="primary">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Reconstitution Calculator</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Vial Size (mg)</Label>
            <Input
              type="number"
              value={vialSize}
              onChange={(e) => setVialSize(e.target.value)}
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">BAC Water (ml)</Label>
            <Input
              type="number"
              value={bacWater}
              onChange={(e) => setBacWater(e.target.value)}
              className="bg-muted border-border"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label className="text-sm text-muted-foreground">Target Dose (mcg)</Label>
            <Input
              type="number"
              value={targetDose}
              onChange={(e) => setTargetDose(e.target.value)}
              className="bg-muted border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Droplets size={18} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Concentration</p>
            <p className="text-lg font-bold text-foreground">{concentration.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">mcg/ml</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Syringe size={18} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="text-lg font-bold text-foreground">{volumeNeeded.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground">ml</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/20">
            <Syringe size={18} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Insulin Units</p>
            <p className="text-lg font-bold text-primary">{insulinUnits.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">IU</p>
          </div>
        </div>
      </GradientCard>

      {/* Experience Level Selector */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Experience Level</h3>
        <div className="flex gap-2">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setExperienceLevel(level.id)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                experienceLevel === level.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Peptide Dosage Reference */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Dosage Reference</h3>
        <div className="space-y-2">
          {peptides.map((peptide) => (
            <Collapsible 
              key={peptide.id}
              open={expandedPeptide === peptide.id}
              onOpenChange={(open) => setExpandedPeptide(open ? peptide.id : null)}
            >
              <GradientCard className="p-3">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-medium text-foreground">{peptide.name}</h4>
                      <p className="text-xs text-muted-foreground">{getCategoryLabel(peptide.category)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary font-medium">
                        {peptide.dosing[experienceLevel]}
                      </span>
                      {expandedPeptide === peptide.id ? (
                        <ChevronUp size={16} className="text-muted-foreground" />
                      ) : (
                        <ChevronDown size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Beginner</p>
                        <p className="text-foreground font-medium">{peptide.dosing.beginner}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Intermediate</p>
                        <p className="text-foreground font-medium">{peptide.dosing.intermediate}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Advanced</p>
                        <p className="text-foreground font-medium">{peptide.dosing.advanced}</p>
                      </div>
                      <div className="p-2 rounded bg-primary/20">
                        <p className="text-primary">Athlete</p>
                        <p className="text-foreground font-medium">{peptide.dosing.athlete}</p>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p><span className="text-muted-foreground">Frequency:</span> <span className="text-foreground">{peptide.frequency}</span></p>
                      <p><span className="text-muted-foreground">Administration:</span> <span className="text-foreground">{peptide.administration}</span></p>
                      {peptide.halfLife && (
                        <p><span className="text-muted-foreground">Half-life:</span> <span className="text-foreground">{peptide.halfLife}</span></p>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </GradientCard>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Storage Info */}
      <GradientCard>
        <h3 className="font-medium text-foreground mb-2">Storage & Handling</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Store unreconstituted peptides frozen (-20°C) or refrigerated (2-8°C)</li>
          <li>• After reconstitution, refrigerate and use within 4-6 weeks</li>
          <li>• Use bacteriostatic water for multi-dose reconstitution</li>
          <li>• Avoid shaking - gently swirl to mix</li>
          <li>• Protect from light and heat</li>
        </ul>
      </GradientCard>
    </div>
  );
}
