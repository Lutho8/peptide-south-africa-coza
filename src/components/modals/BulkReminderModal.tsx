import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GradientCard } from '@/components/ui/GradientCard';
import { parseFrequencyToSchedule, formatDaysToString, needsMultipleReminders, getSecondDoseTime } from '@/utils/frequencyParser';
import { Bell, Clock, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Cycle } from '@/services/storage';

interface ReminderPreview {
  id: string;
  peptideId: string;
  peptideName: string;
  dose: string;
  time: string;
  days: string[];
  enabled: boolean;
  selected: boolean;
}

interface BulkReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycles: Cycle[];
  onConfirm: (reminders: Omit<ReminderPreview, 'selected'>[]) => Promise<void>;
}

export function BulkReminderModal({ open, onOpenChange, cycles, onConfirm }: BulkReminderModalProps) {
  const [reminders, setReminders] = useState<ReminderPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'preview' | 'customize'>('preview');

  // Generate reminder previews from cycles
  const generatePreviews = () => {
    const previews: ReminderPreview[] = [];
    
    cycles.filter(c => c.status === 'active').forEach(cycle => {
      const schedule = parseFrequencyToSchedule(cycle.frequency);
      
      previews.push({
        id: `bulk-${cycle.id}-1`,
        peptideId: cycle.peptideId,
        peptideName: cycle.peptideName,
        dose: cycle.dose,
        time: schedule.suggestedTime,
        days: schedule.days,
        enabled: true,
        selected: true,
      });
      
      // Add second reminder if frequency suggests split doses
      if (needsMultipleReminders(cycle.frequency)) {
        previews.push({
          id: `bulk-${cycle.id}-2`,
          peptideId: cycle.peptideId,
          peptideName: cycle.peptideName,
          dose: cycle.dose,
          time: getSecondDoseTime(schedule.suggestedTime),
          days: schedule.days,
          enabled: true,
          selected: true,
        });
      }
    });
    
    setReminders(previews);
    setStep('customize');
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, selected: !r.selected } : r
    ));
  };

  // Update time for a reminder
  const updateTime = (id: string, time: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, time } : r
    ));
  };

  // Handle confirm
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const selected = reminders
        .filter(r => r.selected)
        .map(({ selected, ...rest }) => rest);
      
      await onConfirm(selected);
      onOpenChange(false);
      setStep('preview');
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeCycles = cycles.filter(c => c.status === 'active');
  const selectedCount = reminders.filter(r => r.selected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="text-primary" size={20} />
            Generate Reminders from Cycles
          </DialogTitle>
        </DialogHeader>

        {step === 'preview' ? (
          <div className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground">
              Create dose reminders automatically from your active cycles. Each reminder will be 
              scheduled based on the cycle's frequency.
            </p>
            
            {activeCycles.length === 0 ? (
              <GradientCard className="p-4 text-center">
                <AlertCircle className="mx-auto text-muted-foreground mb-2" size={32} />
                <p className="text-sm text-muted-foreground">
                  No active cycles found. Start a cycle first to generate reminders.
                </p>
              </GradientCard>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  {activeCycles.length} active cycle{activeCycles.length > 1 ? 's' : ''} found:
                </Label>
                {activeCycles.map(cycle => (
                  <GradientCard key={cycle.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{cycle.peptideName}</p>
                        <p className="text-xs text-muted-foreground">{cycle.dose} • {cycle.frequency}</p>
                      </div>
                      <div className="text-xs text-primary">
                        {formatDaysToString(parseFrequencyToSchedule(cycle.frequency).days)}
                      </div>
                    </div>
                  </GradientCard>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                Customize times and select which reminders to create:
              </p>
              
              {reminders.map(reminder => (
                <GradientCard 
                  key={reminder.id} 
                  className={cn(
                    "p-3 transition-opacity",
                    !reminder.selected && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={reminder.selected}
                      onCheckedChange={() => toggleSelection(reminder.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-medium text-foreground">{reminder.peptideName}</p>
                        <p className="text-xs text-muted-foreground">{reminder.dose}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          {formatDaysToString(reminder.days)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-muted-foreground" />
                          <Input
                            type="time"
                            value={reminder.time}
                            onChange={(e) => updateTime(reminder.id, e.target.value)}
                            className="h-7 w-24 text-xs"
                            disabled={!reminder.selected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </GradientCard>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t border-border">
          {step === 'preview' ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={generatePreviews}
                disabled={activeCycles.length === 0}
              >
                Generate Previews
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('preview')}>
                Back
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={selectedCount === 0 || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Bell size={16} className="mr-2" />
                )}
                Create {selectedCount} Reminder{selectedCount !== 1 ? 's' : ''}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
