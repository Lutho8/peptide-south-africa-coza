import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { todaysDoses } from '@/data/userData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, X, ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DoseTrackerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DoseTrackerModal({ open, onOpenChange }: DoseTrackerModalProps) {
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [doses, setDoses] = useState(todaysDoses);

  const handleMarkTaken = (id: string) => {
    setDoses(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'taken' as const } : d
    ));
  };

  const handleMarkSkipped = (id: string) => {
    setDoses(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'skipped' as const } : d
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Daily Dose Tracker</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Weekly Calendar View */}
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft size={18} />
            </Button>
            <span className="font-medium text-foreground">This Week</span>
            <Button variant="ghost" size="icon">
              <ChevronRight size={18} />
            </Button>
          </div>

          <div className="flex gap-2">
            {weekDays.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "flex-1 py-3 rounded-lg text-center transition-all",
                  selectedDay === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                <p className="text-xs font-medium">{day}</p>
                <p className="text-lg font-bold">{18 + index}</p>
              </button>
            ))}
          </div>

          {/* Add Schedule Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAddSchedule(!showAddSchedule)}
          >
            <Plus size={16} />
            Add New Schedule
          </Button>

          {/* Add Schedule Form */}
          {showAddSchedule && (
            <GradientCard className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Peptide Name</Label>
                  <Input placeholder="Select peptide..." className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dose Amount</Label>
                  <Input placeholder="e.g., 500mcg" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Time</Label>
                  <Input type="time" className="bg-muted" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Frequency</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Daily', 'Weekly', '2x/week', 'Custom'].map((freq) => (
                      <button
                        key={freq}
                        className="py-2 rounded-lg bg-muted text-muted-foreground text-xs hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="w-full">Add Schedule</Button>
            </GradientCard>
          )}

          {/* Today's Doses */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Today's Schedule</h3>
            <div className="space-y-3">
              {doses.map((dose) => (
                <GradientCard key={dose.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Clock size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{dose.peptideName}</h4>
                        <p className="text-xs text-muted-foreground">{dose.time} • {dose.dose}</p>
                      </div>
                    </div>
                    <StatusBadge status={dose.status} />
                  </div>

                  {dose.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleMarkTaken(dose.id)}
                      >
                        <Check size={14} />
                        Mark Taken
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleMarkSkipped(dose.id)}
                      >
                        <X size={14} />
                        Skip
                      </Button>
                    </div>
                  )}
                </GradientCard>
              ))}
            </div>
          </div>

          {/* Summary */}
          <GradientCard variant="primary" className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm text-foreground">Daily Summary</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {doses.filter(d => d.status === 'taken').length}/{doses.length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </GradientCard>
        </div>
      </DialogContent>
    </Dialog>
  );
}
