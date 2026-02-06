import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, FileText } from 'lucide-react';
import type { DailyDoseEntry } from '@/hooks/useDailyDoses';

interface EditDoseModalProps {
  dose: DailyDoseEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (doseId: string, updates: { time?: string; notes?: string }) => Promise<void>;
}

export function EditDoseModal({ dose, open, onOpenChange, onSave }: EditDoseModalProps) {
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dose) {
      setTime(dose.time);
      setNotes(dose.notes || '');
    }
  }, [dose]);

  const handleSave = async () => {
    if (!dose) return;
    setIsSaving(true);
    try {
      await onSave(dose.id, { time, notes });
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
