import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator, Droplets, Syringe, FlaskConical, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { peptides } from '@/data/peptides';
import { cn } from '@/lib/utils';

interface ReconstitutionCalculatorProps {
  open: boolean;
  onClose: () => void;
}

type SyringeType = 'U100' | 'U50' | 'U40' | 'U30';

const syringeConfigs: Record<SyringeType, { units: number; label: string; tickMarks: number[] }> = {
  U100: { units: 100, label: 'U-100 (1mL)', tickMarks: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
  U50: { units: 50, label: 'U-50 (0.5mL)', tickMarks: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] },
  U40: { units: 40, label: 'U-40 (0.4mL)', tickMarks: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40] },
  U30: { units: 30, label: 'U-30 (0.3mL)', tickMarks: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30] },
};

export function ReconstitutionCalculator({ open, onClose }: ReconstitutionCalculatorProps) {
  const [peptideAmount, setPeptideAmount] = useState<string>('5');
  const [peptideUnit, setPeptideUnit] = useState<'mg' | 'IU'>('mg');
  const [bacWater, setBacWater] = useState<string>('2');
  const [desiredDose, setDesiredDose] = useState<string>('250');
  const [doseUnit, setDoseUnit] = useState<'mcg' | 'IU'>('mcg');
  const [syringeType, setSyringeType] = useState<SyringeType>('U100');
  const [selectedPeptide, setSelectedPeptide] = useState<string>('');

  const calculations = useMemo(() => {
    const peptideAmountNum = parseFloat(peptideAmount) || 0;
    const bacWaterNum = parseFloat(bacWater) || 0;
    const desiredDoseNum = parseFloat(desiredDose) || 0;

    if (peptideAmountNum <= 0 || bacWaterNum <= 0 || desiredDoseNum <= 0) {
      return null;
    }

    // Convert peptide to mcg if in mg
    const peptideMcg = peptideUnit === 'mg' ? peptideAmountNum * 1000 : peptideAmountNum;
    
    // Convert dose to mcg if in IU (assuming 1 IU = 1 mcg for calculation purposes)
    const doseMcg = doseUnit === 'mcg' ? desiredDoseNum : desiredDoseNum;

    // Concentration in mcg per mL
    const concentration = peptideMcg / bacWaterNum;

    // Volume needed for desired dose in mL
    const volumeNeeded = doseMcg / concentration;

    // Convert to units based on syringe type
    const syringeConfig = syringeConfigs[syringeType];
    const unitsPerMl = syringeConfig.units;
    const unitsToDraw = volumeNeeded * unitsPerMl;

    // Number of doses per vial
    const dosesPerVial = Math.floor(peptideMcg / doseMcg);

    // Concentration per unit
    const mcgPerUnit = concentration / unitsPerMl;

    return {
      concentration: concentration.toFixed(2),
      volumeNeeded: volumeNeeded.toFixed(4),
      unitsToDraw: unitsToDraw.toFixed(1),
      dosesPerVial,
      mcgPerUnit: mcgPerUnit.toFixed(2),
      isAccurate: Math.abs(unitsToDraw - Math.round(unitsToDraw)) < 0.5
    };
  }, [peptideAmount, peptideUnit, bacWater, desiredDose, doseUnit, syringeType]);

  const handlePeptideSelect = (peptideId: string) => {
    setSelectedPeptide(peptideId);
    const peptide = peptides.find(p => p.id === peptideId);
    if (peptide) {
      // Extract dose from beginner dosing (e.g., "250mcg daily" -> 250)
      const doseMatch = peptide.dosing.beginner.match(/(\d+(?:\.\d+)?)\s*(mcg|mg|IU)/i);
      if (doseMatch) {
        setDesiredDose(doseMatch[1]);
        if (doseMatch[2].toLowerCase() === 'mcg') {
          setDoseUnit('mcg');
        } else if (doseMatch[2].toLowerCase() === 'iu') {
          setDoseUnit('IU');
        }
      }
    }
  };

  if (!open) return null;

  const syringeConfig = syringeConfigs[syringeType];
  const fillPercentage = calculations ? Math.min(100, (parseFloat(calculations.unitsToDraw) / syringeConfig.units) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold">Reconstitution Calculator</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-accent" />
                    Peptide Information
                  </h2>

                  {/* Peptide Selector */}
                  <div className="space-y-4">
                    <div>
                      <Label>Select Peptide (Optional)</Label>
                      <Select value={selectedPeptide} onValueChange={handlePeptideSelect}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a peptide..." />
                        </SelectTrigger>
                        <SelectContent>
                          {peptides.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.shortName} - {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Peptide Amount in Vial</Label>
                        <Input
                          type="number"
                          value={peptideAmount}
                          onChange={(e) => setPeptideAmount(e.target.value)}
                          className="mt-1"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Select value={peptideUnit} onValueChange={(v: 'mg' | 'IU') => setPeptideUnit(v)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="IU">IU</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        Bacteriostatic Water (mL)
                      </Label>
                      <Input
                        type="number"
                        value={bacWater}
                        onChange={(e) => setBacWater(e.target.value)}
                        className="mt-1"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-accent" />
                    Dosing Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Desired Dose</Label>
                        <Input
                          type="number"
                          value={desiredDose}
                          onChange={(e) => setDesiredDose(e.target.value)}
                          className="mt-1"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Select value={doseUnit} onValueChange={(v: 'mcg' | 'IU') => setDoseUnit(v)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcg">mcg</SelectItem>
                            <SelectItem value="IU">IU</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Syringe Type</Label>
                      <Select value={syringeType} onValueChange={(v: SyringeType) => setSyringeType(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(syringeConfigs).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <Card className="p-6 bg-accent/5 border-accent/20">
                  <h2 className="text-lg font-semibold mb-4">Calculation Results</h2>

                  {calculations ? (
                    <div className="space-y-4">
                      {/* Units to Draw - Main Result */}
                      <div className="text-center p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Units to Draw</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold text-accent">
                            {calculations.unitsToDraw}
                          </span>
                          <span className="text-lg text-muted-foreground">units</span>
                        </div>
                        {calculations.isAccurate && (
                          <Badge className="mt-2 bg-green-500/20 text-green-400">
                            ✓ Accurate Measurement
                          </Badge>
                        )}
                      </div>

                      {/* Visual Syringe */}
                      <div className="p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground mb-3">Visual Syringe ({syringeConfig.label})</p>
                        <div className="relative h-8 bg-muted rounded-full overflow-hidden border-2 border-border">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fillPercentage}%` }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-primary rounded-full"
                          />
                          {/* Tick marks */}
                          <div className="absolute inset-0 flex justify-between px-1">
                            {syringeConfig.tickMarks.map((mark, i) => (
                              <div key={mark} className="flex flex-col items-center">
                                <div className="w-px h-2 bg-border/50" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span>{syringeConfig.units}</span>
                        </div>
                      </div>

                      {/* Other Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-background rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Concentration</p>
                          <p className="font-semibold">{calculations.concentration} mcg/mL</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Volume</p>
                          <p className="font-semibold">{calculations.volumeNeeded} mL</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">mcg per Unit</p>
                          <p className="font-semibold">{calculations.mcgPerUnit}</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Doses per Vial</p>
                          <p className="font-semibold">{calculations.dosesPerVial}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter values above to calculate</p>
                    </div>
                  )}
                </Card>

                {/* Info Box */}
                <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-400 mb-1">How to Use</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Enter the peptide amount from your vial label</li>
                        <li>Enter how much bacteriostatic water you'll add</li>
                        <li>Enter your desired dose per injection</li>
                        <li>Select your syringe type</li>
                        <li>Draw to the calculated unit mark</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
