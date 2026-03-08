import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Droplets, Syringe, FlaskConical, Info, Copy, Check, Tag, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { peptides } from '@/data/peptides';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ReconstitutionGuide } from './ReconstitutionGuide';

interface ReconstitutionCalculatorProps {
  open: boolean;
  onClose: () => void;
}

type SyringeSize = '0.3ml' | '0.5ml' | '1ml';
type VialSize = '3ml' | '5ml' | '10ml';

const syringeOptions: Record<SyringeSize, { units: number; label: string; mlPerUnit: number }> = {
  '0.3ml': { units: 30, label: '0.3mL (30 unit) Insulin Syringe', mlPerUnit: 0.01 },
  '0.5ml': { units: 50, label: '0.5mL (50 unit) Insulin Syringe', mlPerUnit: 0.01 },
  '1ml': { units: 100, label: '1mL (100 unit) Insulin Syringe', mlPerUnit: 0.01 },
};

export function ReconstitutionCalculator({ open, onClose }: ReconstitutionCalculatorProps) {
  const [selectedPeptide, setSelectedPeptide] = useState<string>('');
  const [coaAmount, setCoaAmount] = useState<string>('');
  const [vialSize, setVialSize] = useState<VialSize>('3ml');
  const [desiredDose, setDesiredDose] = useState<string>('');
  const [doseUnit, setDoseUnit] = useState<'mg' | 'mcg'>('mcg');
  const [syringeSize, setSyringeSize] = useState<SyringeSize>('1ml');
  const [calcMode, setCalcMode] = useState<'concentration' | 'desired-units'>('concentration');
  const [desiredUnits, setDesiredUnits] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const clearForm = () => {
    setSelectedPeptide('');
    setCoaAmount('');
    setDesiredDose('');
    setDesiredUnits('');
    setCopied(false);
  };

  const handlePeptideSelect = (peptideId: string) => {
    setSelectedPeptide(peptideId);
    const peptide = peptides.find(p => p.id === peptideId);
    if (peptide) {
      const doseMatch = peptide.dosing.beginner.match(/(\d+(?:\.\d+)?)\s*(mcg|mg|IU)/i);
      if (doseMatch) {
        const val = doseMatch[1];
        const unit = doseMatch[2].toLowerCase();
        if (unit === 'mg') {
          setDesiredDose(val);
          setDoseUnit('mg');
        } else {
          setDesiredDose(unit === 'iu' ? val : val);
          setDoseUnit('mcg');
        }
      }
    }
  };

  const calculations = useMemo(() => {
    const coaMg = parseFloat(coaAmount) || 0;
    const doseMg = doseUnit === 'mg' ? (parseFloat(desiredDose) || 0) : (parseFloat(desiredDose) || 0) / 1000;

    if (coaMg <= 0) return null;

    if (calcMode === 'concentration') {
      if (doseMg <= 0) return null;

      const syringe = syringeOptions[syringeSize];
      // Auto-calculate optimal BAC water to keep units between 10-50
      // Target: dose should be ~20 units on the syringe for easy measurement
      const targetUnits = 20;
      const targetMlPerDose = (targetUnits * syringe.mlPerUnit);
      let optimalBacWater = coaMg / doseMg * targetMlPerDose;

      // Clamp to vial size
      const maxMl = parseFloat(vialSize);
      optimalBacWater = Math.min(optimalBacWater, maxMl);
      // Round to nearest 0.1
      optimalBacWater = Math.round(optimalBacWater * 10) / 10;
      if (optimalBacWater < 0.5) optimalBacWater = 0.5;

      const concentrationMgPerMl = coaMg / optimalBacWater;
      const volumePerDoseMl = doseMg / concentrationMgPerMl;
      const unitsToDraw = volumePerDoseMl / syringe.mlPerUnit;
      const dosesPerVial = Math.floor(coaMg / doseMg);

      return {
        bacWater: optimalBacWater,
        concentrationMgPerMl,
        volumePerDoseMl,
        unitsToDraw: Math.round(unitsToDraw * 10) / 10,
        dosesPerVial,
        ccPerDose: volumePerDoseMl,
        syringeUnits: syringe.units,
      };
    } else {
      // Calculate by desired units mode
      const targetUnits = parseFloat(desiredUnits) || 0;
      if (targetUnits <= 0 || doseMg <= 0) return null;

      const syringe = syringeOptions[syringeSize];
      const targetMlPerDose = targetUnits * syringe.mlPerUnit;
      const bacWater = (coaMg / doseMg) * targetMlPerDose;
      const roundedBac = Math.round(bacWater * 10) / 10;

      const concentrationMgPerMl = coaMg / roundedBac;
      const volumePerDoseMl = doseMg / concentrationMgPerMl;
      const actualUnits = volumePerDoseMl / syringe.mlPerUnit;
      const dosesPerVial = Math.floor(coaMg / doseMg);

      return {
        bacWater: roundedBac,
        concentrationMgPerMl,
        volumePerDoseMl,
        unitsToDraw: Math.round(actualUnits * 10) / 10,
        dosesPerVial,
        ccPerDose: volumePerDoseMl,
        syringeUnits: syringe.units,
      };
    }
  }, [coaAmount, desiredDose, doseUnit, syringeSize, vialSize, calcMode, desiredUnits]);

  const peptideName = selectedPeptide
    ? peptides.find(p => p.id === selectedPeptide)?.shortName || ''
    : '';

  const labelText = calculations
    ? `${peptideName || 'Peptide'}\n${coaAmount}mg COA / ${calculations.bacWater}mL BAC\n${calculations.concentrationMgPerMl.toFixed(2)}mg/mL | ${doseUnit === 'mg' ? desiredDose + 'mg' : (parseFloat(desiredDose) / 1000).toFixed(2) + 'mg'} = ${calculations.unitsToDraw}u (${calculations.ccPerDose.toFixed(2)}cc)\n${format(new Date(), 'MMMM do, yyyy')}`
    : '';

  const handleCopyLabel = async () => {
    try {
      await navigator.clipboard.writeText(labelText);
      setCopied(true);
      toast.success('Label copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (!open) return null;

  const fillPercent = calculations ? Math.min(100, (calculations.unitsToDraw / calculations.syringeUnits) * 100) : 0;
  const syringeInfo = syringeOptions[syringeSize];

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
              <Calculator className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Peptide Reconstitution Calculator</h1>
                <p className="text-xs text-muted-foreground">Calculate optimal reconstitution ratio and create vial labels</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearForm}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4 max-w-5xl space-y-6">

            {/* Top: Peptide & Date row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  Peptide Name
                </Label>
                <Select value={selectedPeptide} onValueChange={handlePeptideSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type or select a peptide..." />
                  </SelectTrigger>
                  <SelectContent>
                    {peptides.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.shortName} — {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Reconstitution Date</Label>
                <div className="h-10 px-3 rounded-md border border-input bg-background flex items-center text-sm text-foreground">
                  {format(new Date(), 'MMMM do, yyyy')}
                </div>
              </div>
            </div>

            {/* Calc Mode Toggle */}
            <Tabs value={calcMode} onValueChange={(v) => setCalcMode(v as any)}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="concentration">Calculate Concentration</TabsTrigger>
                <TabsTrigger value="desired-units">Calculate by Desired Units</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  COA Amount in Vial
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={coaAmount}
                    onChange={(e) => setCoaAmount(e.target.value)}
                    placeholder="e.g. 5, 10, 12"
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">mg</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Actual amount from Certificate of Analysis</p>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <Droplets className="w-4 h-4 text-primary" />
                  Vial Size
                </Label>
                <Select value={vialSize} onValueChange={(v: VialSize) => setVialSize(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3ml">3mL Vial</SelectItem>
                    <SelectItem value="5ml">5mL Vial</SelectItem>
                    <SelectItem value="10ml">10mL Vial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <Syringe className="w-4 h-4 text-primary" />
                  Desired Dose per Injection
                </Label>
                <div className="flex gap-2">
                  <div className="flex rounded-md border border-input overflow-hidden">
                    <button
                      className={cn(
                        "px-3 py-2 text-sm transition-colors",
                        doseUnit === 'mg' ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                      )}
                      onClick={() => setDoseUnit('mg')}
                    >mg</button>
                    <button
                      className={cn(
                        "px-3 py-2 text-sm transition-colors",
                        doseUnit === 'mcg' ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                      )}
                      onClick={() => setDoseUnit('mcg')}
                    >mcg</button>
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      value={desiredDose}
                      onChange={(e) => setDesiredDose(e.target.value)}
                      placeholder={doseUnit === 'mg' ? "e.g. 0.5" : "e.g. 500"}
                      min="0"
                      step={doseUnit === 'mg' ? '0.1' : '1'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{doseUnit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Syringe selector + desired units for mode 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Syringe Size</Label>
                <div className="flex gap-2">
                  {(Object.keys(syringeOptions) as SyringeSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSyringeSize(size)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-all",
                        syringeSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {size === '0.3ml' ? '0.3mL' : size === '0.5ml' ? '0.5mL' : '1mL'} Syringe
                    </button>
                  ))}
                </div>
              </div>
              {calcMode === 'desired-units' && (
                <div>
                  <Label className="mb-1.5 block">Desired Units to Draw</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={desiredUnits}
                      onChange={(e) => setDesiredUnits(e.target.value)}
                      placeholder="e.g. 10, 20, 50"
                      min="1"
                      max={String(syringeInfo.units)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">units</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {calculations ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="p-4 text-center bg-primary/5 border-primary/20">
                      <Syringe className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <div className="text-xs text-muted-foreground">Per Dose ({doseUnit === 'mg' ? desiredDose + 'mg' : desiredDose + 'mcg'})</div>
                      <div className="text-2xl font-bold text-primary">{calculations.unitsToDraw} units</div>
                      <div className="text-xs text-muted-foreground">({calculations.ccPerDose.toFixed(2)} cc / {calculations.ccPerDose.toFixed(2)} mL)</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <FlaskConical className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">Doses per Vial</div>
                      <div className="text-2xl font-bold">{calculations.dosesPerVial} doses</div>
                      <div className="text-xs text-muted-foreground">at {doseUnit === 'mg' ? desiredDose + 'mg' : desiredDose + 'mcg'} each</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">BAC Water to Add</div>
                      <div className="text-2xl font-bold">{calculations.bacWater} mL</div>
                      <div className="text-xs text-muted-foreground">auto-optimized</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <Calculator className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">Concentration</div>
                      <div className="text-2xl font-bold">{calculations.concentrationMgPerMl.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">mg/mL</div>
                    </Card>
                  </div>

                  {/* Horizontal Syringe Visual */}
                  <Card className="p-5">
                    <div className="text-sm font-medium text-center mb-1">
                      {syringeInfo.label}
                    </div>
                    <div className="text-xs text-muted-foreground text-center mb-3">Dose Fill Level</div>

                    {/* Tick labels */}
                    <div className="relative mx-12 mb-0">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {Array.from({ length: 11 }, (_, i) => {
                          const val = Math.round((i / 10) * syringeInfo.units);
                          return <span key={i}>{val}</span>;
                        })}
                      </div>
                    </div>

                    {/* Syringe body */}
                    <div className="relative flex items-center">
                      {/* Plunger */}
                      <div className="w-10 flex items-center justify-end mr-1">
                        <div className="w-6 h-4 bg-muted-foreground/30 rounded-sm" />
                        <motion.div
                          className="h-1.5 bg-muted-foreground/40 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(2, 40 - fillPercent * 0.4)}px` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      {/* Barrel */}
                      <div className="flex-1 relative h-10 bg-background border-2 border-muted-foreground/30 rounded-sm overflow-hidden">
                        {/* Tick marks */}
                        <div className="absolute inset-0 flex justify-between">
                          {Array.from({ length: syringeInfo.units + 1 }, (_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "border-l",
                                i % 10 === 0 ? "h-full border-muted-foreground/40" :
                                i % 5 === 0 ? "h-3/4 border-muted-foreground/30" :
                                "h-1/2 border-muted-foreground/15"
                              )}
                              style={{ width: 0 }}
                            />
                          ))}
                        </div>

                        {/* Fill */}
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-primary/25 border-r-2 border-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>

                      {/* Needle hub + needle */}
                      <div className="flex items-center ml-0">
                        <div className="w-4 h-6 bg-muted-foreground/30 rounded-r-sm" />
                        <div className="w-8 h-px bg-muted-foreground/60" />
                      </div>
                    </div>

                    {/* Value readout */}
                    <div className="text-center mt-3">
                      <span className="text-lg font-bold text-primary">{calculations.unitsToDraw} units</span>
                      <span className="text-muted-foreground mx-1">|</span>
                      <span className="text-sm text-muted-foreground">{calculations.ccPerDose.toFixed(2)} mL</span>
                      <span className="text-muted-foreground mx-1">|</span>
                      <span className="text-sm text-muted-foreground">{calculations.ccPerDose.toFixed(2)} cc</span>
                    </div>
                  </Card>

                  {/* Vial Label */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Vial Label</h3>
                      <span className="text-xs text-muted-foreground ml-2">Copy and paste into your label making software</span>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-sm leading-relaxed whitespace-pre-line">
                      {labelText}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleCopyLabel}
                    >
                      {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? 'Copied!' : 'Copy Label'}
                    </Button>
                  </Card>

                  {/* Step-by-step Reconstitution Guide */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Syringe className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Step-by-Step Reconstitution Guide</h3>
                    </div>
                    <ReconstitutionGuide />
                  </Card>

                  {/* Important Notes */}
                  <Card className="p-4 bg-accent/5 border-accent/20">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-accent">Important Notes</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                          <li>100 units on an insulin syringe = 1mL regardless of syringe size</li>
                          <li>BAC water amount is auto-optimized to keep units between 10-50 for easy measurement</li>
                          <li>Always inject BAC water slowly along the vial wall — never directly onto lyophilized powder</li>
                          <li>Store reconstituted vials at 2-8°C (refrigerated) and use within 30 days</li>
                          <li>For research purposes only. Not medical advice.</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Enter valid values above to calculate reconstitution</p>
                  <p className="text-xs text-muted-foreground mt-2">Auto-adjusts ratio to keep units between 10-50 for easy measurement</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
