import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { findBlendData } from '@/data/blendAdapters';

interface InsulinNeedleGuideProps {
  dose: number;
  unit: 'mcg' | 'mg' | 'IU';
  concentration?: number;
  peptideId?: string;
}

type SyringeType = 'U40' | 'U50' | 'U100';

interface BlendConcentration {
  totalMg: number;
  waterMl: number;
  concentrationMgPerMl: number;
}

function getBlendConcentration(peptideId?: string): BlendConcentration | null {
  if (!peptideId) return null;
  const blend = findBlendData(peptideId);
  if (!blend) return null;

  const mgMatch = blend.vialSize.match(/([\d.]+)\s*mg/i);
  const totalMg = mgMatch ? parseFloat(mgMatch[1]) : null;
  if (!totalMg) return null;

  // Extract water volume from reconstitution quickstart
  const waterMatch = blend.quickstart.reconstitute.match(/([\d.]+)\s*mL/i);
  const waterMl = waterMatch ? parseFloat(waterMatch[1]) : 2.0;

  return {
    totalMg,
    waterMl,
    concentrationMgPerMl: totalMg / waterMl,
  };
}

const syringeUnitsPerMl: Record<SyringeType, number> = {
  U40: 40,
  U50: 50,
  U100: 100,
};

const syringeLabels: Record<SyringeType, string> = {
  U40: 'U-40',
  U50: 'U-50',
  U100: 'U-100',
};

// Dynamic calculator section
function ReconstitutionCalculator({ 
  defaultTotalMg, 
  defaultWaterMl,
  isBlend,
}: { 
  defaultTotalMg: number; 
  defaultWaterMl: number;
  isBlend: boolean;
}) {
  const [totalMg, setTotalMg] = useState(defaultTotalMg);
  const [waterMl, setWaterMl] = useState(defaultWaterMl);
  const [syringeType, setSyringeType] = useState<SyringeType>('U100');

  const unitsPerMl = syringeUnitsPerMl[syringeType];
  const concentrationMgPerMl = waterMl > 0 ? totalMg / waterMl : 0;
  const mcgPerUnit = concentrationMgPerMl > 0 ? (concentrationMgPerMl / unitsPerMl) * 1000 : 0;

  const dosePresets = [2, 4, 6];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border">
      <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Syringe size={14} className="text-primary" />
        Dynamic Reconstitution Calculator
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Total mg in vial</Label>
          <Input
            type="number"
            value={totalMg}
            onChange={(e) => setTotalMg(parseFloat(e.target.value) || 0)}
            className="h-8 text-sm"
            min={0}
            step={1}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">mL BAC water</Label>
          <Input
            type="number"
            value={waterMl}
            onChange={(e) => setWaterMl(parseFloat(e.target.value) || 0)}
            className="h-8 text-sm"
            min={0.1}
            step={0.5}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Syringe</Label>
          <Select value={syringeType} onValueChange={(v) => setSyringeType(v as SyringeType)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="U40">U-40</SelectItem>
              <SelectItem value="U50">U-50</SelectItem>
              <SelectItem value="U100">U-100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {concentrationMgPerMl > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-md bg-background border border-border">
              <div className="text-muted-foreground">Concentration</div>
              <div className="text-sm font-bold text-foreground">{concentrationMgPerMl.toFixed(2)} mg/mL</div>
            </div>
            <div className="p-2 rounded-md bg-background border border-border">
              <div className="text-muted-foreground">1 unit ({syringeLabels[syringeType]})</div>
              <div className="text-sm font-bold text-primary">{Math.round(mcgPerUnit)} mcg</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 text-xs">Target Dose</TableHead>
                <TableHead className="h-8 text-xs">Units to Draw ({syringeLabels[syringeType]})</TableHead>
                <TableHead className="h-8 text-xs">Volume (mL)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dosePresets.map((doseMg) => {
                const volumeMl = concentrationMgPerMl > 0 ? doseMg / concentrationMgPerMl : 0;
                const units = volumeMl * unitsPerMl;
                return (
                  <TableRow key={doseMg}>
                    <TableCell className="py-1.5 text-sm font-medium">{doseMg} mg</TableCell>
                    <TableCell className="py-1.5 text-sm font-bold text-primary">{units.toFixed(1)} units</TableCell>
                    <TableCell className="py-1.5 text-sm text-muted-foreground">{volumeMl.toFixed(3)} mL</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function InsulinNeedleGuide({ dose, unit, concentration, peptideId }: InsulinNeedleGuideProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const blendConc = useMemo(() => getBlendConcentration(peptideId), [peptideId]);
  const isBlend = !!blendConc;
  const blendData = useMemo(() => peptideId ? findBlendData(peptideId) : null, [peptideId]);

  // For blends use their real concentration; for individual peptides fall back to provided or default
  const activeTotalMg = blendConc?.totalMg ?? 5;
  const activeWaterMl = blendConc?.waterMl ?? 2;
  const activeConcentrationMcgPerMl = (blendConc?.concentrationMgPerMl ?? (concentration || 2500 / 1000)) * 1000;

  // Convert dose to mcg
  const doseMcg = unit === 'mg' ? dose * 1000 : dose;
  const volumeNeededMl = doseMcg / activeConcentrationMcgPerMl;

  if (dose <= 0) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Syringe size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {isBlend ? `${blendData?.shortName || 'Blend'} Dosage Guide` : 'Insulin Needle Dosage Guide'}
          </span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              {/* Safety Warning for blends */}
              {isBlend && (
                <Alert variant="destructive" className="border-destructive bg-destructive/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-bold">⚠️ SAFETY CORRECTION</AlertTitle>
                  <AlertDescription className="text-xs">
                    Previous dosage values for this blend were <strong>incorrect and potentially dangerous</strong>. 
                    The values below use the verified standard protocol ({activeTotalMg}mg vial + {activeWaterMl}mL BAC water). 
                    Always verify concentration based on YOUR reconstitution.
                  </AlertDescription>
                </Alert>
              )}

              {/* Blend concentration info */}
              {isBlend && blendConc && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                  <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Standard reconstitution: </span>
                    {activeTotalMg}mg vial + {activeWaterMl}mL BAC water = {blendConc.concentrationMgPerMl.toFixed(2)} mg/mL
                    <br />
                    <span className="text-foreground font-medium">1 unit (U-100) = {Math.round(blendConc.concentrationMgPerMl * 10)} mcg total peptides</span>
                  </div>
                </div>
              )}

              {/* Non-blend info */}
              {!isBlend && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                  <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Based on reconstitution: </span>
                    {activeTotalMg}mg vial + {activeWaterMl}mL BAC water = {(activeConcentrationMcgPerMl).toLocaleString()} mcg/mL
                  </div>
                </div>
              )}

              {/* Blend dosing table from protocol data */}
              {isBlend && blendData && blendData.dosingTable.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    {blendData.shortName} Protocol Dosing Table
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-8 text-xs">Period</TableHead>
                        <TableHead className="h-8 text-xs">Daily Dose</TableHead>
                        <TableHead className="h-8 text-xs">Units to Draw</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blendData.dosingTable.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="py-1.5 text-xs font-medium">{row.week}</TableCell>
                          <TableCell className="py-1.5 text-xs">{row.dailyDose}</TableCell>
                          <TableCell className="py-1.5 text-xs font-bold text-primary">{row.units}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Current dose quick reference */}
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="text-sm font-medium text-foreground">
                  Your current dose: {dose} {unit}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['U40', 'U50', 'U100'] as SyringeType[]).map((sType) => {
                    const uPerMl = syringeUnitsPerMl[sType];
                    const units = volumeNeededMl * uPerMl;
                    return (
                      <div key={sType} className="p-2 rounded-md bg-background border border-border text-center">
                        <div className="text-muted-foreground">{syringeLabels[sType]}</div>
                        <div className="text-lg font-bold text-primary">{units.toFixed(1)}</div>
                        <div className="text-muted-foreground">units</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Volume: {volumeNeededMl.toFixed(3)} mL
                </div>
              </div>

              {/* Dynamic Calculator */}
              <ReconstitutionCalculator
                defaultTotalMg={activeTotalMg}
                defaultWaterMl={activeWaterMl}
                isBlend={isBlend}
              />

              {/* Quick Reference */}
              <div className="text-[10px] text-muted-foreground text-center border-t border-border pt-2">
                <strong>Quick Reference:</strong> U-40 = 40 units/mL • U-50 = 50 units/mL • U-100 = 100 units/mL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
