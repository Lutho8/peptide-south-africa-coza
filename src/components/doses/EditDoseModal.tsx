import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, FileText, Syringe } from 'lucide-react';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';

interface EditDoseModalProps {
  dose: DailyDoseEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    doseId: string,
    updates: { time?: string; notes?: string; dose?: number; unit?: 'mg' | 'IU' | 'units' }
  ) => Promise<void>;
}

export function EditDoseModal({ dose, open, onOpenChange, onSave }: EditDoseModalProps) {
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [doseAmount, setDoseAmount] = useState<string>('');
  const [unit, setUnit] = useState<'mg' | 'IU' | 'units'>('mg');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dose) {
      setTime(dose.time);
      setNotes(dose.notes || '');
      setDoseAmount(String(dose.dose));
      setUnit(dose.unit);
    }
  }, [dose]);

  const parsedDose = parseFloat(doseAmount);
  const doseValid = !isNaN(parsedDose) && parsedDose > 0;
  const doseChanged = dose && (parsedDose !== dose.dose || unit !== dose.unit);

  const handleSave = async () => {
    if (!dose || !doseValid) return;
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
      <DialogContent className="max-w-sm">
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
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
