import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, FileText, Syringe, AlertTriangle, Calculator, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';
import { getPreferredUnit, convertDose, type DoseUnit } from '@/data/peptideUnits';
import { getDosagePresetForPeptide, type DosagePreset } from '@/services/storage';

interface EditDoseModalProps {
  dose: DailyDoseEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    doseId: string,
    updates: { time?: string; notes?: string; dose?: number; unit?: DoseUnit }
  ) => Promise<void>;
}

const UNITS_PER_ML: Record<DosagePreset['syringeType'], number> = {
  u100: 100,
  u50: 50,
  u40: 40,
};

const SYRINGE_LABEL: Record<DosagePreset['syringeType'], string> = {
  u100: 'U-100',
  u50: 'U-50',
  u40: 'U-40',
};

export function EditDoseModal({ dose, open, onOpenChange, onSave }: EditDoseModalProps) {
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [doseAmount, setDoseAmount] = useState<string>('');
  const [unit, setUnit] = useState<DoseUnit>('mg');
  const [isSaving, setIsSaving] = useState(false);
  const [preset, setPreset] = useState<DosagePreset | undefined>(undefined);

  useEffect(() => {
    if (dose) {
      setTime(dose.time);
      setNotes(dose.notes || '');
      setDoseAmount(String(dose.dose));
      setUnit(dose.unit);
      setPreset(getDosagePresetForPeptide(dose.peptide_id));
    }
  }, [dose]);

  const parsedDose = parseFloat(doseAmount);
  const doseValid = !isNaN(parsedDose) && parsedDose > 0;
  const doseChanged = dose && (parsedDose !== dose.dose || unit !== dose.unit);

  const expectedUnit = getPreferredUnit(dose?.peptide_id);
  const unitMismatch = !!expectedUnit && unit !== expectedUnit;

  // Preview the auto-conversion that will happen on save.
  const previewConverted = useMemo(() => {
    if (!doseValid || !unitMismatch || !expectedUnit) return null;
    return convertDose(parsedDose, unit, expectedUnit, dose?.peptide_id);
  }, [doseValid, unitMismatch, expectedUnit, parsedDose, unit, dose?.peptide_id]);

  const sanityWarning = useMemo(() => {
    if (!doseValid) return null;
    if (unit === 'mg' && parsedDose > 50) return `${parsedDose} mg is unusually high — double-check.`;
    if (unit === 'mg' && parsedDose < 0.01) return `${parsedDose} mg is unusually low — double-check.`;
    if (unit === 'IU' && parsedDose > 100) return `${parsedDose} IU is unusually high — double-check.`;
    return null;
  }, [parsedDose, unit, doseValid]);

  // Auto-calc syringe volume from preset — supports mg, IU, and units presets.
  const calc = useMemo(() => {
    if (!preset || !doseValid) return null;
    const presetUnit: DoseUnit = preset.vialUnitType ?? 'mg';
    const vialAmount = parseFloat(preset.vialSize);
    const bacMl = parseFloat(preset.bacWater);
    if (!vialAmount || !bacMl) return null;
    const concentration = vialAmount / bacMl; // <unit>/mL
    const unitsPerMl = UNITS_PER_ML[preset.syringeType];

    // If dose unit doesn't match preset unit, try to convert dose first.
    let effectiveDose = parsedDose;
    let effectiveUnit: DoseUnit = unit;
    let convertedFrom: DoseUnit | null = null;
    if (unit !== presetUnit) {
      const c = convertDose(parsedDose, unit, presetUnit, dose?.peptide_id);
      if (c.converted) {
        effectiveDose = c.value;
        effectiveUnit = presetUnit;
        convertedFrom = unit;
      } else {
        return {
          mismatch: true as const,
          presetUnit,
          doseUnit: unit,
        };
      }
    }
    const volumeMl = effectiveDose / concentration;
    const drawUnits = volumeMl * unitsPerMl;
    return {
      mismatch: false as const,
      presetUnit,
      effectiveUnit,
      convertedFrom,
      effectiveDose,
      concentration,
      volumeMl,
      drawUnits,
      unitsPerMl,
      overCapacity: drawUnits > unitsPerMl,
      tooSmall: drawUnits < 2,
    };
  }, [preset, parsedDose, unit, doseValid, dose?.peptide_id]);

  const handleSave = async () => {
    if (!dose || !doseValid) return;
    setIsSaving(true);
    try {
      let saveValue = parsedDose;
      let saveUnit: DoseUnit = unit;
      if (unitMismatch && expectedUnit) {
        const c = convertDose(parsedDose, unit, expectedUnit, dose.peptide_id);
        saveValue = c.value;
        saveUnit = c.unit;
        if (c.converted) {
          toast.success(`Auto-converted to ${c.value} ${c.unit}`);
        } else {
          toast.info(`Saved as ${c.value} ${c.unit} (label corrected)`);
        }
      }
      await onSave(dose.id, { time, notes, dose: saveValue, unit: saveUnit });
      onOpenChange(false);
    } catch {
      // parent toasts the error
    } finally {
      setIsSaving(false);
    }
  };

  if (!dose) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {dose.peptide_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Syringe size={14} className="text-muted-foreground" />
              Dose
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={doseAmount}
                onChange={(e) => setDoseAmount(e.target.value)}
                className="flex-1"
              />
              <Select value={unit} onValueChange={(v) => setUnit(v as DoseUnit)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="IU">IU</SelectItem>
                  <SelectItem value="units">units</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!doseValid && (
              <p className="text-xs text-destructive">Enter a dose greater than 0.</p>
            )}
            {doseValid && doseChanged && (
              <p className="text-xs text-muted-foreground">
                Original: {dose.dose} {dose.unit}
              </p>
            )}
          </div>

          {unitMismatch && previewConverted && (
            <Alert className="border-primary/50 bg-primary/10">
              <Wand2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                {dose.peptide_name} is dosed in <strong>{expectedUnit}</strong>. On save we'll
                {previewConverted.converted ? ' auto-convert to ' : ' relabel as '}
                <strong>{previewConverted.value} {previewConverted.unit}</strong>.
              </AlertDescription>
            </Alert>
          )}

          {sanityWarning && !unitMismatch && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-xs">{sanityWarning}</AlertDescription>
            </Alert>
          )}

          {/* Auto-calc syringe volume */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Calculator size={14} className="text-primary" />
              Syringe volume
            </div>
            {!preset && (
              <p className="text-xs text-muted-foreground">
                Save a preset for {dose.peptide_name} in the Reconstitution Calculator to enable
                auto-calculation.
              </p>
            )}
            {preset && calc?.mismatch && (
              <p className="text-xs text-muted-foreground">
                Preset is in <strong>{calc.presetUnit}</strong> but dose is in <strong>{calc.doseUnit}</strong>.
                Switch the dose unit to match, or save a new preset in {calc.doseUnit}.
              </p>
            )}
            {preset && calc && !calc.mismatch && (
              <>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>
                    Vial: {preset.vialSize} {calc.presetUnit} in {preset.bacWater} mL ={' '}
                    <strong>{calc.concentration.toFixed(2)} {calc.presetUnit}/mL</strong>
                  </div>
                  <div>Syringe: {SYRINGE_LABEL[preset.syringeType]} ({calc.unitsPerMl} units / mL)</div>
                  {calc.convertedFrom && (
                    <div className="text-primary">
                      Dose converted: {parsedDose} {calc.convertedFrom} → {calc.effectiveDose} {calc.effectiveUnit}
                    </div>
                  )}
                </div>
                <div className="text-base font-semibold text-primary">
                  Draw {calc.drawUnits.toFixed(1)} units ({calc.volumeMl.toFixed(3)} mL)
                </div>
                {calc.overCapacity && (
                  <p className="text-xs text-destructive">
                    Exceeds {SYRINGE_LABEL[preset.syringeType]} capacity ({calc.unitsPerMl} units).
                  </p>
                )}
                {calc.tooSmall && !calc.overCapacity && (
                  <p className="text-xs text-yellow-600">
                    Less than 2 units — accuracy may suffer. Consider a smaller syringe.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              Time
            </Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText size={14} className="text-muted-foreground" />
              Notes
            </Label>
            <Textarea
              placeholder="e.g. Pre-workout, fasted, injection site..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/200</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !doseValid}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
