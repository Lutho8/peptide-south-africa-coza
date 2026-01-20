import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { activeCycles } from '@/data/userData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ChevronLeft, ChevronRight, Calendar, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CycleManagementModal({ open, onOpenChange }: CycleManagementModalProps) {
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
              onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="font-medium text-foreground">{monthName}</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
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
                const isToday = day === new Date().getDate() && 
                  selectedMonth.getMonth() === new Date().getMonth();
                
                // Simple cycle visualization
                const hasCycle = day >= 1 && day <= 15; // Example: TA1 cycle
                
                return (
                  <div
                    key={day}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-sm transition-all",
                      isToday && "ring-2 ring-primary",
                      hasCycle && "bg-green-500/20"
                    )}
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
                  <Label className="text-xs">Peptide</Label>
                  <Input placeholder="Select peptide..." className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dose</Label>
                  <Input placeholder="e.g., 1.5mg" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Frequency</Label>
                  <Input placeholder="e.g., 3x/week" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Duration (days)</Label>
                  <Input type="number" placeholder="90" className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Break Duration (days)</Label>
                  <Input type="number" placeholder="30" className="bg-muted" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Notes</Label>
                  <Input placeholder="Optional notes..." className="bg-muted" />
                </div>
              </div>
              <Button className="w-full">Start Cycle</Button>
            </GradientCard>
          )}

          {/* Active Cycles */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Active Cycles</h3>
            <div className="space-y-3">
              {activeCycles.map((cycle) => (
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
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pause size={12} />
                          Start Break
                        </Button>
                      ) : cycle.status === 'break' ? (
                        <Button variant="outline" size="sm" className="gap-1">
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
            </div>
          </div>

          {/* Completed Cycles */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Completed History</h3>
            <GradientCard className="p-3 text-center">
              <p className="text-sm text-muted-foreground">No completed cycles yet</p>
            </GradientCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
