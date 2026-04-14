import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { findBlendData } from '@/data/blendAdapters';

interface InsulinNeedleGuideProps {
  dose: number;
  unit: 'mg' | 'IU' | 'units';
  concentration?: number;
  peptideId?: string;
}

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

  const waterMatch = blend.quickstart.reconstitute.match(/([\d.]+)\s*mL/i);
  const waterMl = waterMatch ? parseFloat(waterMatch[1]) : 2.0;

  return {
    totalMg,
    waterMl,
    concentrationMgPerMl: totalMg / waterMl,
  };
}

const U40_UNITS_PER_ML = 40;

// Dynamic calculator section — U-40 only
function ReconstitutionCalculator({ 
  defaultTotalMg, 
  defaultWaterMl,
}: { 
  defaultTotalMg: number; 
  defaultWaterMl: number;
}) {
  const [totalMg, setTotalMg] = useState(defaultTotalMg);
  const [waterMl, setWaterMl] = useState(defaultWaterMl);

  const concentrationMgPerMl = waterMl > 0 ? totalMg / waterMl : 0;
  const mgPerUnit = concentrationMgPerMl > 0 ? concentrationMgPerMl / U40_UNITS_PER_ML : 0;

  const dosePresets = [2, 4, 6];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border">
      <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Syringe size={14} className="text-primary" />
        Dynamic Calculator (U-40 Syringe)
      </div>

      <div className="grid grid-cols-2 gap-2">
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
      </div>

      {concentrationMgPerMl > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-md bg-background border border-border">
              <div className="text-muted-foreground">Concentration</div>
              <div className="text-sm font-bold text-foreground">{concentrationMgPerMl.toFixed(2)} mg/mL</div>
            </div>
            <div className="p-2 rounded-md bg-background border border-border">
              <div className="text-muted-foreground">1 unit (U-40)</div>
              <div className="text-sm font-bold text-primary">{mgPerUnit.toFixed(3)} mg</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 text-xs">Target Dose</TableHead>
                <TableHead className="h-8 text-xs">U-40 Units</TableHead>
                <TableHead className="h-8 text-xs">Volume (mL)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dosePresets.map((doseMg) => {
                const volumeMl = concentrationMgPerMl > 0 ? doseMg / concentrationMgPerMl : 0;
                const units = volumeMl * U40_UNITS_PER_ML;
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

  const activeTotalMg = blendConc?.totalMg ?? 5;
  const activeWaterMl = blendConc?.waterMl ?? 2;
  const activeConcentrationMgPerMl = blendConc?.concentrationMgPerMl ?? (concentration ? concentration / 1000 : 2.5);

  // Convert dose to mg
  const doseMg = unit === 'mg' ? dose : dose; // IU treated as mg equivalent for display
  const volumeNeededMl = activeConcentrationMgPerMl > 0 ? doseMg / activeConcentrationMgPerMl : 0;
  const u40Units = volumeNeededMl * U40_UNITS_PER_ML;

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
            {isBlend ? `${blendData?.shortName || 'Blend'} U-40 Dosage Guide` : 'U-40 Syringe Dosage Guide'}
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

              {/* Concentration info */}
              <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">Reconstitution: </span>
                  {activeTotalMg}mg vial + {activeWaterMl}mL BAC water = {activeConcentrationMgPerMl.toFixed(2)} mg/mL
                  <br />
                  <span className="text-foreground font-medium">1 U-40 unit = {(activeConcentrationMgPerMl / U40_UNITS_PER_ML).toFixed(3)} mg</span>
                </div>
              </div>

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
                        <TableHead className="h-8 text-xs">U-40 Units</TableHead>
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

              {/* Current dose — U-40 only */}
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="text-sm font-medium text-foreground">
                  Your current dose: {dose} {unit}
                </div>
                <div className="p-3 rounded-md bg-background border border-border text-center">
                  <div className="text-muted-foreground text-xs">U-40 Syringe</div>
                  <div className="text-2xl font-bold text-primary">{u40Units.toFixed(1)}</div>
                  <div className="text-muted-foreground text-xs">units to draw</div>
                  <div className="text-muted-foreground text-[10px] mt-1">({volumeNeededMl.toFixed(3)} mL)</div>
                </div>
              </div>

              {/* Dynamic Calculator */}
              <ReconstitutionCalculator
                defaultTotalMg={activeTotalMg}
                defaultWaterMl={activeWaterMl}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
