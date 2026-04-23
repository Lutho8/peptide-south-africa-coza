import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradientCard } from '@/components/ui/GradientCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { CycleHistoryTimeline } from '@/components/doses/CycleHistoryTimeline';
import { CycleBreakAlert } from '@/components/doses/CycleBreakAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getCycles,
  saveCycle,
  updateCycle,
  Cycle
} from '@/services/storage';
import { Plus, ChevronLeft, ChevronRight, Play, Pause, Save, Bell, FlaskConical, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BulkReminderModal } from './BulkReminderModal';
import { useDoseReminders } from '@/hooks/useDoseReminders';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { buildWeeklyScheduleFromReport, expandDays, formatFrequencyFromDays, type ScheduleEntry } from '@/utils/bloodworkSchedule';

interface CycleManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CycleManagementModal({ open, onOpenChange }: CycleManagementModalProps) {
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [showBulkReminder, setShowBulkReminder] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [newCycle, setNewCycle] = useState<Partial<Cycle>>({});
  const { toast } = useToast();
  const { bulkAddReminders } = useDoseReminders();

  useEffect(() => {
    if (open) {
      setCycles(getCycles());
    }
  }, [open]);

  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleSaveCycle = () => {
    if (!newCycle.peptideName || !newCycle.dose) {
      toast({
        title: "Required fields missing",
        description: "Please enter peptide name and dose.",
        variant: "destructive"
      });
      return;
    }

    const cycle: Cycle = {
      id: `cycle-${Date.now()}`,
      peptideId: newCycle.peptideName?.toLowerCase().replace(/\s+/g, '-') || '',
      peptideName: newCycle.peptideName || '',
      dose: newCycle.dose || '',
      frequency: newCycle.frequency || 'Daily',
      startDate: new Date().toISOString().split('T')[0],
      plannedDuration: newCycle.plannedDuration || 90,
      breakDuration: newCycle.breakDuration || 30,
      status: 'active',
      notes: newCycle.notes,
    };

    saveCycle(cycle);
    setCycles([...cycles, cycle]);
    setNewCycle({});
    setShowAddCycle(false);
    
    toast({
      title: "Cycle started",
      description: `${cycle.peptideName} cycle has been added.`,
    });
  };

  const handleToggleCycleStatus = (cycle: Cycle) => {
    const newStatus = cycle.status === 'active' ? 'break' : 'active';
    const updatedCycle = { ...cycle, status: newStatus as 'active' | 'break' };
    updateCycle(updatedCycle);
    setCycles(cycles.map(c => c.id === cycle.id ? updatedCycle : c));
    
    toast({
      title: newStatus === 'break' ? "Break started" : "Cycle resumed",
      description: `${cycle.peptideName} is now ${newStatus === 'break' ? 'on break' : 'active'}.`,
    });
  };

  // Get cycle blocks for calendar
  const getCycleForDay = (day: number): Cycle | undefined => {
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cycles.find(cycle => {
      const start = new Date(cycle.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + cycle.plannedDuration);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Cycle Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="font-medium text-foreground">{monthName}</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const today = new Date();
                const isToday = day === today.getDate() && 
                  selectedMonth.getMonth() === today.getMonth() &&
                  selectedMonth.getFullYear() === today.getFullYear();
                
                const cycle = getCycleForDay(day);
                
                return (
                  <div
                    key={day}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-sm transition-all",
                      isToday && "ring-2 ring-primary",
                      cycle?.status === 'active' && "bg-green-500/20",
                      cycle?.status === 'break' && "bg-blue-500/20"
                    )}
                    title={cycle?.peptideName}
                  >
                    <span className={cn(
                      isToday ? "text-primary font-bold" : "text-foreground"
                    )}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500/50" />
              <span className="text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/50" />
              <span className="text-muted-foreground">Break</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted" />
              <span className="text-muted-foreground">Completed</span>
            </div>
          </div>

          {/* Generate Reminders Button */}
          {cycles.filter(c => c.status === 'active').length > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => setShowBulkReminder(true)}
            >
              <Bell size={16} />
              Generate Reminders from Cycles
            </Button>
          )}

          {/* Add Cycle Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAddCycle(!showAddCycle)}
          >
            <Plus size={16} />
            Add New Cycle
          </Button>

          {/* Add Cycle Form */}
          {showAddCycle && (
            <GradientCard className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Peptide *</Label>
                  <Input 
                    placeholder="e.g., Thymosin Alpha-1" 
                    className="bg-muted"
                    value={newCycle.peptideName || ''}
                    onChange={(e) => setNewCycle({ ...newCycle, peptideName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dose *</Label>
                  <Input 
                    placeholder="e.g., 1.5mg" 
                    className="bg-muted"
                    value={newCycle.dose || ''}
                    onChange={(e) => setNewCycle({ ...newCycle, dose: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Frequency</Label>
                  <Input 
                    placeholder="e.g., 3x/week" 
                    className="bg-muted"
                    value={newCycle.frequency || ''}
                    onChange={(e) => setNewCycle({ ...newCycle, frequency: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Duration (days)</Label>
                  <Input 
                    type="number" 
                    placeholder="90" 
                    className="bg-muted"
                    value={newCycle.plannedDuration || ''}
                    onChange={(e) => setNewCycle({ ...newCycle, plannedDuration: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Break Duration (days)</Label>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    className="bg-muted"
                    value={newCycle.breakDuration || ''}
                    onChange={(e) => setNewCycle({ ...newCycle, breakDuration: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Notes</Label>
                  <Input 
                    placeholder="Optional notes..." 
                    className="bg-muted"
                    value={newCycle.notes || ''}
                    onChange={(e) => setNewCycle({ ...newCycle, notes: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full gap-2" onClick={handleSaveCycle}>
                <Save size={16} />
                Start Cycle
              </Button>
            </GradientCard>
          )}

          {/* Active Cycles */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Active Cycles</h3>
            <div className="space-y-3">
              {cycles.filter(c => c.status !== 'completed').map((cycle) => (
                <GradientCard key={cycle.id} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{cycle.peptideName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {cycle.dose} • {cycle.frequency}
                      </p>
                    </div>
                    <StatusBadge status={cycle.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50 text-xs">
                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p className="text-foreground">{cycle.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="text-foreground">{cycle.plannedDuration} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Break</p>
                      <p className="text-foreground">{cycle.breakDuration} days</p>
                    </div>
                    <div className="flex items-end">
                      {cycle.status === 'active' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleToggleCycleStatus(cycle)}
                        >
                          <Pause size={12} />
                          Start Break
                        </Button>
                      ) : cycle.status === 'break' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleToggleCycleStatus(cycle)}
                        >
                          <Play size={12} />
                          Resume
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  {cycle.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">{cycle.notes}</p>
                  )}
                </GradientCard>
              ))}

              {cycles.filter(c => c.status !== 'completed').length === 0 && (
                <GradientCard className="p-3 text-center">
                  <p className="text-sm text-muted-foreground">No active cycles. Start one above!</p>
                </GradientCard>
              )}
            </div>
          </div>

          {/* Cycle Break Alerts */}
          <CycleBreakAlert
            cycles={cycles}
            onStartBreak={(cycle) => handleToggleCycleStatus(cycle)}
          />

          {/* Cycle History Timeline */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Cycle Timeline</h3>
            <CycleHistoryTimeline cycles={cycles} />
          </div>
        </div>

        {/* Bulk Reminder Modal */}
        <BulkReminderModal
          open={showBulkReminder}
          onOpenChange={setShowBulkReminder}
          cycles={cycles}
          onConfirm={async (reminders) => {
            await bulkAddReminders(reminders.map(r => ({
              peptide_id: r.peptideId,
              peptide_name: r.peptideName,
              dose: r.dose,
              time: r.time,
              days: r.days,
              enabled: r.enabled,
            })));
            toast({
              title: 'Reminders created',
              description: `${reminders.length} dose reminder${reminders.length > 1 ? 's' : ''} generated from your cycles.`,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
