import { useMemo, useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useDoseReminders, DoseReminder } from '@/hooks/useDoseReminders';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { format, subDays, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MissedDose {
  date: string;
  dateFormatted: string;
  peptide_id: string;
  peptide_name: string;
  dose: string;
  time: string;
}

export function MissedDosesCard() {
  const { reminders } = useDoseReminders();
  const { doses, addDose } = useDailyDoses();
  const [expanded, setExpanded] = useState(false);
  const [loggingId, setLoggingId] = useState<string | null>(null);

  const missedDoses = useMemo(() => {
    const missed: MissedDose[] = [];
    const today = startOfDay(new Date());
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    // Check past 7 days (excluding today)
    for (let i = 1; i <= 7; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const dayName = dayNames[checkDate.getDay()];

      // Find scheduled reminders for this day
      reminders.forEach(reminder => {
        if (!reminder.enabled) return;
        
        // Check if reminder was scheduled for this day
        const isScheduled = reminder.days.length === 0 || reminder.days.includes(dayName);
        if (!isScheduled) return;

        // Check if dose was logged for this peptide on this date
        const wasLogged = doses.some(
          d => d.peptide_id === reminder.peptide_id && d.date === dateStr
        );

        if (!wasLogged) {
          missed.push({
            date: dateStr,
            dateFormatted: format(checkDate, 'EEE, MMM d'),
            peptide_id: reminder.peptide_id,
            peptide_name: reminder.peptide_name,
            dose: reminder.dose,
            time: reminder.time,
          });
        }
      });
    }

    // Sort by date descending (most recent first)
    return missed.sort((a, b) => b.date.localeCompare(a.date));
  }, [reminders, doses]);

  const handleQuickLog = async (missed: MissedDose) => {
    const uniqueId = `${missed.date}-${missed.peptide_id}-${missed.time}`;
    setLoggingId(uniqueId);

    try {
      // Parse dose value and unit
      const doseMatch = missed.dose.match(/^([\d.]+)\s*(mcg|mg|IU)?$/i);
      const doseValue = doseMatch ? parseFloat(doseMatch[1]) : parseFloat(missed.dose);
      const unit = (doseMatch?.[2]?.toLowerCase() || 'mg') as 'mg' | 'IU' | 'units';

      await addDose({
        date: missed.date,
        peptide_id: missed.peptide_id,
        peptide_name: missed.peptide_name,
        dose: doseValue,
        unit,
        time: missed.time,
        notes: 'Retroactively logged',
      });

      toast.success(`${missed.peptide_name} logged for ${missed.dateFormatted}`);
    } catch (error) {
      toast.error('Failed to log dose');
    } finally {
      setLoggingId(null);
    }
  };

  if (missedDoses.length === 0) {
    return null;
  }

  const displayedDoses = expanded ? missedDoses : missedDoses.slice(0, 3);

  return (
    <GradientCard>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-destructive/20">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Missed Doses</h3>
          <p className="text-xs text-muted-foreground">
            {missedDoses.length} dose{missedDoses.length !== 1 ? 's' : ''} to catch up on
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {displayedDoses.map((missed) => {
          const uniqueId = `${missed.date}-${missed.peptide_id}-${missed.time}`;
          const isLogging = loggingId === uniqueId;

          return (
            <div 
              key={uniqueId}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{missed.peptide_name}</p>
                <p className="text-sm text-muted-foreground">
                  {missed.dateFormatted} • {missed.dose} @ {missed.time}
                </p>
              </div>
              <Button
                size="sm"
                variant={isLogging ? "secondary" : "outline"}
                onClick={() => handleQuickLog(missed)}
                disabled={isLogging}
                className="ml-2 flex-shrink-0"
              >
                {isLogging ? (
                  <Check className="h-4 w-4 text-chart-2" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Log
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {missedDoses.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 w-full mt-3 pt-3 border-t border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show {missedDoses.length - 3} more
            </>
          )}
        </button>
      )}
    </GradientCard>
  );
}
