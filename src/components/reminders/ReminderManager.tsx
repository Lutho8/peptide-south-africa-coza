import { useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDoseReminders, DoseReminder } from '@/hooks/useDoseReminders';
import { peptides } from '@/data/peptides';
import { Bell, BellOff, Plus, Trash2, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

interface AddReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (reminder: Omit<DoseReminder, 'id' | 'user_id'>) => Promise<DoseReminder>;
}

function AddReminderModal({ open, onOpenChange, onAdd }: AddReminderModalProps) {
  const [formData, setFormData] = useState({
    peptideId: '',
    dose: '',
    unit: 'mcg',
    time: '08:00',
    days: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.peptideId || !formData.dose || !formData.time) return;

    const peptide = peptides.find(p => p.id === formData.peptideId);
    if (!peptide) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        peptide_id: formData.peptideId,
        peptide_name: peptide.shortName,
        dose: `${formData.dose} ${formData.unit}`,
        time: formData.time,
        days: formData.days,
        enabled: true,
      });

      setFormData({
        peptideId: '',
        dose: '',
        unit: 'mcg',
        time: '08:00',
        days: [],
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Dose Reminder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Peptide</Label>
            <Select
              value={formData.peptideId}
              onValueChange={(val) => setFormData(prev => ({ ...prev, peptideId: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select peptide..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {peptides.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.shortName} - {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Dose</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 250"
                value={formData.dose}
                onChange={(e) => setFormData(prev => ({ ...prev, dose: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(val) => setFormData(prev => ({ ...prev, unit: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="mcg">mcg</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="IU">IU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Days (leave empty for daily)</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => handleDayToggle(day.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    formData.days.includes(day.value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.peptideId || !formData.dose || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={16} className="mr-1 animate-spin" />
            ) : (
              <Plus size={16} className="mr-1" />
            )}
            Add Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReminderManager() {
  const { reminders, isLoading, toggleReminder, deleteReminder, addReminder } = useDoseReminders();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <GradientCard className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={24} />
      </GradientCard>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Scheduled Reminders
        </h3>
        <Button size="sm" variant="outline" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </div>

      {reminders.length === 0 ? (
        <GradientCard className="text-center py-6">
          <BellOff size={32} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No reminders scheduled</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setIsAddModalOpen(true)}
          >
            Create your first reminder
          </Button>
        </GradientCard>
      ) : (
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <GradientCard key={reminder.id} className="flex items-center gap-3 py-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                reminder.enabled ? "bg-primary/20" : "bg-muted"
              )}>
                {reminder.enabled ? (
                  <Bell size={18} className="text-primary" />
                ) : (
                  <BellOff size={18} className="text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">
                    {reminder.peptide_name}
                  </span>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {reminder.dose}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>{reminder.time}</span>
                  {reminder.days.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{reminder.days.join(', ').toUpperCase()}</span>
                    </>
                  )}
                  {reminder.days.length === 0 && (
                    <>
                      <span>•</span>
                      <span>Daily</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </GradientCard>
          ))}
        </div>
      )}

      <AddReminderModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={addReminder}
      />
    </div>
  );
}
