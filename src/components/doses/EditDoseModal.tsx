import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, FileText, Syringe, AlertTriangle, Calculator } from 'lucide-react';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';
import { getPreferredUnit } from '@/data/peptideUnits';
import { getDosagePresetForPeptide, type DosagePreset } from '@/services/storage';

interface EditDoseModalProps {
  dose: DailyDoseEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    doseId: string,
    updates: { time?: string; notes?: string; dose?: number; unit?: 'mg' | 'IU' | 'units' }
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
  const [unit, setUnit] = useState<'mg' | 'IU' | 'units'>('mg');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmMismatch, setConfirmMismatch] = useState(false);
  const [preset, setPreset] = useState<DosagePreset | undefined>(undefined);

  useEffect(() => {
    if (dose) {
      setTime(dose.time);
      setNotes(dose.notes || '');
      setDoseAmount(String(dose.dose));
      setUnit(dose.unit);
      setConfirmMismatch(false);
      setPreset(getDosagePresetForPeptide(dose.peptide_id));
    }
  }, [dose]);

  // Reset mismatch confirmation any time the unit changes.
  useEffect(() => {
    setConfirmMismatch(false);
  }, [unit]);

  const parsedDose = parseFloat(doseAmount);
  const doseValid = !isNaN(parsedDose) && parsedDose > 0;
  const doseChanged = dose && (parsedDose !== dose.dose || unit !== dose.unit);

  const expectedUnit = getPreferredUnit(dose?.peptide_id);
  const unitMismatch = !!expectedUnit && unit !== expectedUnit;

  // Sanity warnings (non-blocking).
  const sanityWarning = useMemo(() => {
    if (!doseValid) return null;
    if (unit === 'mg' && parsedDose > 50) return `${parsedDose} mg is unusually high — double-check.`;
    if (unit === 'mg' && parsedDose < 0.01) return `${parsedDose} mg is unusually low — double-check.`;
    if (unit === 'IU' && parsedDose > 100) return `${parsedDose} IU is unusually high — double-check.`;
    return null;
  }, [parsedDose, unit, doseValid]);

  // Auto-calc syringe volume from preset.
  const calc = useMemo(() => {
    if (!preset || !doseValid) return null;
    if (unit !== 'mg') return { unsupported: true as const };
    const vialMg = parseFloat(preset.vialSize);
    const bacMl = parseFloat(preset.bacWater);
    if (!vialMg || !bacMl) return null;
    const concentration = vialMg / bacMl; // mg / mL
    const volumeMl = parsedDose / concentration;
    const unitsPerMl = UNITS_PER_ML[preset.syringeType];
    const units = volumeMl * unitsPerMl;
    const overCapacity = units > unitsPerMl;
    const tooSmall = units < 2;
    return {
      unsupported: false as const,
      concentration,
      volumeMl,
      units,
      overCapacity,
      tooSmall,
      unitsPerMl,
    };
  }, [preset, parsedDose, unit, doseValid]);

  const handleSave = async () => {
    if (!dose || !doseValid) return;
    if (unitMismatch && !confirmMismatch) {
      setConfirmMismatch(true);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(dose.id, { time, notes, dose: parsedDose, unit });
      onOpenChange(false);
    } catch {
      // error handled by parent
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
              <Select value={unit} onValueChange={(v) => setUnit(v as 'mg' | 'IU' | 'units')}>
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

          {unitMismatch && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-xs">
                {dose.peptide_name} is normally dosed in <strong>{expectedUnit}</strong>,
                but you selected <strong>{unit}</strong>.
                {confirmMismatch
                  ? ' Press Save again to confirm.'
                  : ' Double-check before saving.'}
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
            {preset && calc?.unsupported && (
              <p className="text-xs text-muted-foreground">
                Auto-calc only available for mg doses.
              </p>
            )}
            {preset && calc && !calc.unsupported && (
              <>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>
                    Vial: {preset.vialSize} mg in {preset.bacWater} mL ={' '}
                    <strong>{calc.concentration.toFixed(2)} mg/mL</strong>
                  </div>
                  <div>Syringe: {SYRINGE_LABEL[preset.syringeType]} ({calc.unitsPerMl} units / mL)</div>
                </div>
                <div className="text-base font-semibold text-primary">
                  Draw {calc.units.toFixed(1)} units ({calc.volumeMl.toFixed(3)} mL)
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
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
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
            {isSaving
              ? 'Saving...'
              : unitMismatch && !confirmMismatch
                ? 'Confirm & Save'
                : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
