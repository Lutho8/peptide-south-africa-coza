import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { peptides } from '@/data/peptides';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Syringe, Trash2, Calendar, Cloud, CloudOff, Loader2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { DoseSummary } from '@/components/doses/DoseSummary';
import { z } from 'zod';

const doseEntrySchema = z.object({
  peptideId: z.string().min(1, 'Please select a peptide'),
  dose: z.number().min(0.001, 'Dose must be greater than 0').max(10000, 'Dose seems too high'),
  unit: z.enum(['mcg', 'mg', 'IU']),
  time: z.string().min(1, 'Please enter a time'),
  notes: z.string().max(200, 'Notes must be less than 200 characters').optional(),
});

export function DailyLogScreen() {
  const { toast } = useToast();
  const { doses, isLoading, isSyncing, isCloudEnabled, addDose, deleteDose, getDosesForDate } = useDailyDoses();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    peptideId: '',
    dose: '',
    unit: 'mcg' as 'mcg' | 'mg' | 'IU',
    time: format(new Date(), 'HH:mm'),
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const selectedDateDoses = useMemo(() => {
    return getDosesForDate(selectedDate);
  }, [selectedDate, getDosesForDate]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleAddDose = async () => {
    setFormErrors({});
    
    const peptide = peptides.find(p => p.id === formData.peptideId);
    const doseNumber = parseFloat(formData.dose);

    const result = doseEntrySchema.safeParse({
      peptideId: formData.peptideId,
      dose: isNaN(doseNumber) ? 0 : doseNumber,
      unit: formData.unit,
      time: formData.time,
      notes: formData.notes || undefined,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      await addDose({
        date: format(selectedDate, 'yyyy-MM-dd'),
        peptide_id: formData.peptideId,
        peptide_name: peptide?.shortName || formData.peptideId,
        dose: doseNumber,
        unit: formData.unit,
        time: formData.time,
        notes: formData.notes || undefined,
      });

      toast({
        title: 'Dose logged',
        description: `${peptide?.shortName} ${doseNumber}${formData.unit} added for ${format(selectedDate, 'MMM d')}`,
      });

      setIsAddModalOpen(false);
      setFormData({
        peptideId: '',
        dose: '',
        unit: 'mcg',
        time: format(new Date(), 'HH:mm'),
        notes: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save dose',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDose = async (doseId: string) => {
    try {
      await deleteDose(doseId);
      toast({
        title: 'Dose deleted',
        description: 'Entry removed from your log',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete dose',
        variant: 'destructive',
      });
    }
  };

  const getCategoryColor = (peptideId: string) => {
    const peptide = peptides.find(p => p.id === peptideId);
    if (!peptide) return 'bg-muted';
    const colors: Record<string, string> = {
      'immune': 'bg-indigo-500',
      'longevity': 'bg-emerald-500',
      'cognitive': 'bg-cyan-500',
      'metabolic': 'bg-red-500',
      'healing': 'bg-orange-500',
      'gh-secretagogue': 'bg-violet-500',
    };
    return colors[peptide.category] || 'bg-muted';
  };

  const getDosesForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return doses.filter(d => d.date === dateStr);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={28} />
          <h1 className="text-2xl font-bold text-foreground">Daily Dose Log</h1>
        </div>
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <Loader2 size={16} className="animate-spin text-primary" />
          ) : isCloudEnabled ? (
            <Cloud size={16} className="text-primary" />
          ) : (
            <CloudOff size={16} className="text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {isCloudEnabled ? 'Synced' : 'Local'}
          </span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={showSummary ? 'outline' : 'default'}
          size="sm"
          onClick={() => setShowSummary(false)}
          className="flex-1"
        >
          <Calendar size={16} className="mr-1" />
          Calendar
        </Button>
        <Button
          variant={showSummary ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowSummary(true)}
          className="flex-1"
        >
          <BarChart3 size={16} className="mr-1" />
          Summary
        </Button>
      </div>

      {showSummary ? (
        <DoseSummary doses={doses} currentDate={selectedDate} />
      ) : (
        <>
          {/* Month Navigation */}
          <GradientCard className="p-3">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft size={20} className="text-muted-foreground" />
              </button>
              <h2 className="text-lg font-semibold text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {daysInMonth.map((day) => {
                const dayDoses = getDosesForDay(day);
                const isSelected = isSameDay(day, selectedDate);
                const hasDoses = dayDoses.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                      isSelected && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
                      !isSelected && isToday(day) && "bg-primary/20 text-primary",
                      !isSelected && !isToday(day) && "hover:bg-muted text-foreground",
                    )}
                  >
                    <span className={cn("font-medium", isSelected && "font-bold")}>
                      {format(day, 'd')}
                    </span>
                    {hasDoses && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayDoses.slice(0, 3).map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-1 h-1 rounded-full",
                              isSelected ? "bg-primary-foreground" : "bg-primary"
                            )}
                          />
                        ))}
                        {dayDoses.length > 3 && (
                          <span className="text-[8px]">+</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </GradientCard>

          {/* Selected Date Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="gap-1"
              >
                <Plus size={16} />
                Add Dose
              </Button>
            </div>

            {selectedDateDoses.length === 0 ? (
              <GradientCard className="text-center py-8">
                <Syringe size={32} className="mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground text-sm">No doses logged for this day</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Log your first dose
                </Button>
              </GradientCard>
            ) : (
              <div className="space-y-2">
                {selectedDateDoses.map((dose) => (
                  <GradientCard key={dose.id} className="flex items-center gap-3">
                    <div className={cn("w-2 h-10 rounded-full", getCategoryColor(dose.peptide_id))} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{dose.peptide_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {dose.dose} {dose.unit}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dose.time}
                        {dose.notes && <span className="ml-2">• {dose.notes}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDose(dose.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </GradientCard>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Dose Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Dose for {format(selectedDate, 'MMM d, yyyy')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Peptide</Label>
              <Select
                value={formData.peptideId}
                onValueChange={(val) => setFormData(prev => ({ ...prev, peptideId: val }))}
              >
                <SelectTrigger className={cn(formErrors.peptideId && "border-destructive")}>
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
              {formErrors.peptideId && (
                <p className="text-xs text-destructive">{formErrors.peptideId}</p>
              )}
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
                  className={cn(formErrors.dose && "border-destructive")}
                />
                {formErrors.dose && (
                  <p className="text-xs text-destructive">{formErrors.dose}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(val: 'mcg' | 'mg' | 'IU') => setFormData(prev => ({ ...prev, unit: val }))}
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
                className={cn(formErrors.time && "border-destructive")}
              />
              {formErrors.time && (
                <p className="text-xs text-destructive">{formErrors.time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="e.g. Pre-workout, fasted, etc."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                maxLength={200}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDose}>
              <Plus size={16} className="mr-1" />
              Add Dose
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
