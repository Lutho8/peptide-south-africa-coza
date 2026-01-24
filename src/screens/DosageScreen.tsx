import { useState, useMemo } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { peptides, getCategoryLabel } from '@/data/peptides';
import { AlertTriangle, Calculator, Droplets, Syringe, ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Syringe types with units per ml
const SYRINGE_TYPES = [
  { id: 'u100', label: 'U-100', unitsPerMl: 100, description: 'Standard insulin syringe' },
  { id: 'u40', label: 'U-40', unitsPerMl: 40, description: 'Pet/veterinary syringe' },
  { id: 'u50', label: 'U-50', unitsPerMl: 50, description: 'Intermediate syringe' },
] as const;

type SyringeType = typeof SYRINGE_TYPES[number]['id'];

// Parse half-life string to hours for calculations
function parseHalfLifeToHours(halfLife: string | undefined): number | null {
  if (!halfLife) return null;
  
  const lower = halfLife.toLowerCase();
  const match = lower.match(/(\d+(?:\.\d+)?)\s*(?:-\s*\d+(?:\.\d+)?)?\s*(hour|hr|minute|min|day|week)/);
  
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  if (unit.startsWith('min')) return value / 60;
  if (unit.startsWith('hour') || unit.startsWith('hr')) return value;
  if (unit.startsWith('day')) return value * 24;
  if (unit.startsWith('week')) return value * 24 * 7;
  
  return null;
}

// Generate injection schedule based on frequency
function generateSchedule(frequency: string, halfLifeHours: number | null): { time: string; note: string }[] {
  const schedule: { time: string; note: string }[] = [];
  const freqLower = frequency.toLowerCase();
  
  if (freqLower.includes('before bed') || freqLower.includes('daily')) {
    schedule.push({ time: '21:00', note: 'Evening dose (before bed)' });
    if (freqLower.includes('2x')) {
      schedule.push({ time: '06:00', note: 'Morning dose (fasted)' });
    }
  } else if (freqLower.includes('3x')) {
    schedule.push({ time: '06:00', note: 'Morning dose' });
    schedule.push({ time: '14:00', note: 'Afternoon dose' });
    schedule.push({ time: '21:00', note: 'Evening dose' });
  } else if (freqLower.includes('2x')) {
    schedule.push({ time: '06:00', note: 'Morning dose' });
    schedule.push({ time: '18:00', note: 'Evening dose' });
  } else if (freqLower.includes('weekly')) {
    schedule.push({ time: '08:00 (Same day each week)', note: 'Weekly dose' });
  } else {
    schedule.push({ time: '08:00', note: 'Standard dose time' });
  }
  
  return schedule;
}

export function DosageScreen() {
  const [vialSize, setVialSize] = useState('5');
  const [bacWater, setBacWater] = useState('2');
  const [targetDose, setTargetDose] = useState('250');
  const [syringeType, setSyringeType] = useState<SyringeType>('u40'); // Default to U-40 as per user's syringe
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'athlete'>('intermediate');
  const [expandedPeptide, setExpandedPeptide] = useState<string | null>(null);
  const [selectedSchedulePeptide, setSelectedSchedulePeptide] = useState<string>('');

  // Get selected syringe config
  const selectedSyringe = SYRINGE_TYPES.find(s => s.id === syringeType) || SYRINGE_TYPES[0];

  // Parse inputs with validation
  const vialMg = Math.max(0, parseFloat(vialSize) || 0);
  const waterMl = Math.max(0, parseFloat(bacWater) || 0);
  const targetMcg = Math.max(0, parseFloat(targetDose) || 0);

  // Precision constants
  const MCG_PER_MG = 1000;

  // Core calculations with high precision
  const totalMcg = vialMg * MCG_PER_MG;
  const concentration = waterMl > 0 ? totalMcg / waterMl : 0;
  const volumeNeeded = concentration > 0 ? targetMcg / concentration : 0;
  
  // Calculate syringe units based on selected syringe type
  const syringeUnits = volumeNeeded * selectedSyringe.unitsPerMl;

  // Verification calculation
  const verificationDose = volumeNeeded * concentration;
  const isAccurate = Math.abs(verificationDose - targetMcg) < 0.001 || targetMcg === 0;

  // Calculate doses per vial
  const dosesPerVial = targetMcg > 0 ? Math.floor(totalMcg / targetMcg) : 0;

  // Get schedule for selected peptide
  const schedulePeptide = useMemo(() => 
    peptides.find(p => p.id === selectedSchedulePeptide), 
    [selectedSchedulePeptide]
  );
  
  const schedule = useMemo(() => {
    if (!schedulePeptide) return [];
    const halfLifeHours = parseHalfLifeToHours(schedulePeptide.halfLife);
    return generateSchedule(schedulePeptide.frequency, halfLifeHours);
  }, [schedulePeptide]);

  const experienceLevels = [
    { id: 'beginner' as const, label: 'Beginner' },
    { id: 'intermediate' as const, label: 'Intermediate' },
    { id: 'advanced' as const, label: 'Advanced' },
    { id: 'athlete' as const, label: 'Athlete' },
  ];

  return (
    <div className="pb-24 space-y-4 sm:space-y-6 fade-in">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dosage Calculator</h1>

      {/* Safety Warning */}
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-400 text-sm sm:text-base">Safety First</h3>
            <p className="text-xs text-yellow-200/80 mt-1">
              Always verify calculations independently. Start with the lowest recommended dose.
            </p>
          </div>
        </div>
      </div>

      {/* Reconstitution Calculator */}
      <GradientCard variant="primary">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={18} className="text-primary" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Reconstitution Calculator</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Vial Size (mg)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={vialSize}
              onChange={(e) => setVialSize(e.target.value)}
              className="bg-muted border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">BAC Water (ml)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={bacWater}
              onChange={(e) => setBacWater(e.target.value)}
              className="bg-muted border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Target Dose (mcg)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={targetDose}
              onChange={(e) => setTargetDose(e.target.value)}
              className="bg-muted border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Syringe Type</Label>
            <Select value={syringeType} onValueChange={(v) => setSyringeType(v as SyringeType)}>
              <SelectTrigger className="bg-muted border-border h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {SYRINGE_TYPES.map((syringe) => (
                  <SelectItem key={syringe.id} value={syringe.id}>
                    <span className="font-medium">{syringe.label}</span>
                    <span className="text-muted-foreground ml-1 text-xs">({syringe.unitsPerMl} units/ml)</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Syringe info banner */}
        <div className="mb-4 p-2 rounded-lg bg-primary/10 text-xs text-center">
          <span className="text-primary font-medium">{selectedSyringe.label}</span>
          <span className="text-muted-foreground"> - {selectedSyringe.description} ({selectedSyringe.unitsPerMl} units = 1ml)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-4 border-t border-border/50">
          <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
            <Droplets size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Concentration</p>
            <p className="text-base sm:text-lg font-bold text-foreground">{concentration.toFixed(2)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">mcg/ml</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
            <Syringe size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Volume</p>
            <p className="text-base sm:text-lg font-bold text-foreground">{volumeNeeded.toFixed(4)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">ml</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-primary/20">
            <Syringe size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">{selectedSyringe.label} Units</p>
            <p className="text-base sm:text-lg font-bold text-primary">{syringeUnits.toFixed(2)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">units</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
            <Calculator size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Doses/Vial</p>
            <p className="text-base sm:text-lg font-bold text-foreground">{dosesPerVial}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">doses</p>
          </div>
        </div>

        {/* Verification Badge */}
        {concentration > 0 && (
          <div className={cn(
            "mt-3 sm:mt-4 p-2 rounded-lg text-center text-xs",
            isAccurate ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isAccurate ? "✓ Calculation verified" : "⚠ Precision warning"}
            <span className="block text-muted-foreground mt-1 text-[10px] sm:text-xs">
              {volumeNeeded.toFixed(4)} ml × {concentration.toFixed(2)} mcg/ml = {verificationDose.toFixed(2)} mcg
            </span>
          </div>
        )}
      </GradientCard>

      {/* Dosing Schedule Calculator */}
      <GradientCard>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-primary" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Dosing Schedule</h2>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Select Peptide</Label>
            <Select value={selectedSchedulePeptide} onValueChange={setSelectedSchedulePeptide}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Choose a peptide..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50 max-h-60">
                {peptides.map((peptide) => (
                  <SelectItem key={peptide.id} value={peptide.id}>
                    {peptide.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {schedulePeptide && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              {/* Peptide info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground">Frequency</p>
                  <p className="text-foreground font-medium">{schedulePeptide.frequency}</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground">Half-life</p>
                  <p className="text-foreground font-medium">{schedulePeptide.halfLife || 'N/A'}</p>
                </div>
                <div className="col-span-2 p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground">Recommended Dose ({experienceLevel})</p>
                  <p className="text-primary font-medium">{schedulePeptide.dosing[experienceLevel]}</p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar size={12} />
                  Recommended Schedule
                </p>
                <div className="space-y-2">
                  {schedule.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <div className="w-16 sm:w-20 text-center">
                        <span className="text-primary font-bold text-sm sm:text-base">{item.time.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-foreground">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administration tip */}
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                <span className="font-medium text-foreground">Administration:</span> {schedulePeptide.administration}
              </div>
            </div>
          )}
        </div>
      </GradientCard>

      {/* Experience Level Selector */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Experience Level</h3>
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setExperienceLevel(level.id)}
              className={cn(
                "py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation",
                experienceLevel === level.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted active:scale-95"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Peptide Dosage Reference */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Dosage Reference</h3>
        <div className="space-y-2">
          {peptides.map((peptide) => (
            <Collapsible 
              key={peptide.id}
              open={expandedPeptide === peptide.id}
              onOpenChange={(open) => setExpandedPeptide(open ? peptide.id : null)}
            >
              <GradientCard className="p-2 sm:p-3">
                <CollapsibleTrigger className="w-full touch-manipulation">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-medium text-foreground text-sm sm:text-base">{peptide.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{getCategoryLabel(peptide.category)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-primary font-medium">
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
        <h3 className="font-medium text-foreground mb-2 text-sm sm:text-base">Storage & Handling</h3>
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
