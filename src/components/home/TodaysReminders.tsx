import { useMemo } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { SwipeableCard } from '@/components/ui/SwipeableCard';
import { Bell, ChevronRight, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface Reminder {
  id: string;
  peptide_name: string;
  dose: string;
  time: string;
  days: string[];
  enabled: boolean;
}

interface TodaysRemindersProps {
  reminders: Reminder[];
  onViewSettings: () => void;
  onMarkAsTaken?: (peptideName: string, dose: string, time: string) => void;
}

function SwipeableReminderCard({ 
  reminder, 
  isPast, 
  formatTime, 
  onMarkAsTaken 
}: { 
  reminder: Reminder & { isPast: boolean }; 
  isPast: boolean;
  formatTime: (time: string) => string;
  onMarkAsTaken?: (peptideName: string, dose: string, time: string) => void;
}) {
  const x = useMotionValue(0);
  const takenOpacity = useTransform(x, [0, 80], [0, 1]);
  const scale = useTransform(x, [0, 100], [1, 0.95]);
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 80 && onMarkAsTaken) {
      onMarkAsTaken(reminder.peptide_name, reminder.dose, reminder.time);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg flex-shrink-0">
      {/* Mark as taken background (swipe right) */}
      <motion.div 
        className="absolute inset-y-0 left-0 flex items-center justify-start pl-3 bg-chart-2 rounded-lg"
        style={{ opacity: takenOpacity, width: 100 }}
      >
        <Check className="text-primary-foreground" size={18} />
      </motion.div>
      
      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 100 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x, scale }}
        className={cn(
          "relative px-3 py-2 border touch-pan-y cursor-grab active:cursor-grabbing",
          isPast 
            ? "bg-muted/30 border-border/30" 
            : "bg-primary/10 border-primary/30"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <Clock size={12} className={isPast ? "text-muted-foreground" : "text-primary"} />
          <span className={cn(
            "text-xs font-medium",
            isPast ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {formatTime(reminder.time)}
          </span>
        </div>
        <p className={cn(
          "text-xs",
          isPast ? "text-muted-foreground" : "text-foreground"
        )}>
          {reminder.peptide_name}
        </p>
        <p className="text-[10px] text-muted-foreground">{reminder.dose}</p>
        {!isPast && onMarkAsTaken && (
          <p className="text-[9px] text-primary/60 mt-1">← Swipe to mark taken</p>
        )}
      </motion.div>
    </div>
  );
}

export function TodaysReminders({ reminders, onViewSettings, onMarkAsTaken }: TodaysRemindersProps) {
  const todaysReminders = useMemo(() => {
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDay = dayNames[new Date().getDay()];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return reminders
      .filter(r => {
        if (!r.enabled) return false;
        // Check if today is scheduled (empty means every day)
        if (r.days.length > 0 && !r.days.includes(currentDay)) return false;
        return true;
      })
      .map(r => {
        const [hours, minutes] = r.time.split(':').map(Number);
        const reminderTime = hours * 60 + minutes;
        const isPast = reminderTime < currentTime;
        return { ...r, isPast, sortTime: reminderTime };
      })
      .sort((a, b) => a.sortTime - b.sortTime);
  }, [reminders]);

  const upcomingCount = todaysReminders.filter(r => !r.isPast).length;
  const completedCount = todaysReminders.filter(r => r.isPast).length;

  if (todaysReminders.length === 0) {
    return null;
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <GradientCard hover onClick={onViewSettings}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-chart-4/20 flex items-center justify-center">
            <Bell size={24} className="text-chart-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Today's Reminders</h3>
            <p className="text-sm text-muted-foreground">
              {upcomingCount} upcoming • {completedCount} past
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1" onClick={(e) => e.stopPropagation()}>
        {todaysReminders.slice(0, 5).map((reminder) => (
          <SwipeableReminderCard
            key={reminder.id}
            reminder={reminder}
            isPast={reminder.isPast}
            formatTime={formatTime}
            onMarkAsTaken={onMarkAsTaken}
          />
        ))}
        {todaysReminders.length > 5 && (
          <div className="flex-shrink-0 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 flex items-center">
            <span className="text-xs text-muted-foreground">+{todaysReminders.length - 5} more</span>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
