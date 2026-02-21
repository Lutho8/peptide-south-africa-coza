import { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Syringe, Droplets, UtensilsCrossed, Camera, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface DayActivity {
  doses: number;
  water: boolean;
  meals: number;
  photos: number;
  weight: boolean;
}

type ActivityMap = Record<string, DayActivity>;

const ACTIVITY_ICONS = [
  { key: 'doses' as const, icon: Syringe, label: 'Doses', color: 'bg-violet-500' },
  { key: 'water' as const, icon: Droplets, label: 'Water', color: 'bg-sky-500' },
  { key: 'meals' as const, icon: UtensilsCrossed, label: 'Meals', color: 'bg-amber-500' },
  { key: 'photos' as const, icon: Camera, label: 'Photos', color: 'bg-pink-500' },
  { key: 'weight' as const, icon: Scale, label: 'Weight', color: 'bg-emerald-500' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ActivityCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activities, setActivities] = useState<ActivityMap>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  useEffect(() => {
    if (!user) return;
    fetchActivities();
  }, [user, currentMonth]);

  const fetchActivities = async () => {
    if (!user) return;
    setLoading(true);

    const from = format(monthStart, 'yyyy-MM-dd');
    const to = format(monthEnd, 'yyyy-MM-dd');

    const [dosesRes, waterRes, foodRes, photosRes, weightRes] = await Promise.all([
      supabase.from('daily_doses').select('date').eq('user_id', user.id).gte('date', from).lte('date', to),
      supabase.from('water_intake').select('date, amount_ml').eq('user_id', user.id).gte('date', from).lte('date', to),
      supabase.from('food_logs').select('date').eq('user_id', user.id).gte('date', from).lte('date', to),
      supabase.from('progress_photos').select('date').eq('user_id', user.id).gte('date', from).lte('date', to),
      supabase.from('body_composition').select('date').eq('user_id', user.id).gte('date', from).lte('date', to),
    ]);

    const map: ActivityMap = {};

    const ensureDay = (date: string) => {
      if (!map[date]) map[date] = { doses: 0, water: false, meals: 0, photos: 0, weight: false };
    };

    dosesRes.data?.forEach(d => { ensureDay(d.date); map[d.date].doses++; });
    waterRes.data?.forEach(d => { ensureDay(d.date); if (d.amount_ml > 0) map[d.date].water = true; });
    foodRes.data?.forEach(d => { ensureDay(d.date); map[d.date].meals++; });
    photosRes.data?.forEach(d => { ensureDay(d.date); map[d.date].photos++; });
    weightRes.data?.forEach(d => { ensureDay(d.date); map[d.date].weight = true; });

    setActivities(map);
    setLoading(false);
  };

  const getDots = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    const act = activities[key];
    if (!act) return [];
    const dots: string[] = [];
    if (act.doses > 0) dots.push('bg-violet-500');
    if (act.water) dots.push('bg-sky-500');
    if (act.meals > 0) dots.push('bg-amber-500');
    if (act.photos > 0) dots.push('bg-pink-500');
    if (act.weight) dots.push('bg-emerald-500');
    return dots;
  };

  const selectedKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedActivity = selectedKey ? activities[selectedKey] : null;

  const activeDays = Object.keys(activities).length;
  const totalDoses = Object.values(activities).reduce((s, a) => s + a.doses, 0);
  const totalMeals = Object.values(activities).reduce((s, a) => s + a.meals, 0);

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-lg font-bold text-foreground">{format(currentMonth, 'MMMM yyyy')}</h2>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_ICONS.map(a => (
          <div key={a.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn('w-2 h-2 rounded-full', a.color)} />
            {a.label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <GradientCard className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const inMonth = isSameMonth(day, currentMonth);
            const dots = getDots(day);
            const selected = selectedDate && isSameDay(day, selectedDate);
            const today = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(selected ? null : day)}
                className={cn(
                  'relative flex flex-col items-center py-1.5 rounded-lg transition-all min-h-[44px]',
                  !inMonth && 'opacity-30',
                  selected ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-muted/50',
                  today && !selected && 'ring-1 ring-primary/40'
                )}
              >
                <span className={cn(
                  'text-xs font-medium',
                  today ? 'text-primary font-bold' : 'text-foreground'
                )}>
                  {format(day, 'd')}
                </span>
                {dots.length > 0 && (
                  <div className="flex gap-[2px] mt-1">
                    {dots.slice(0, 4).map((color, i) => (
                      <span key={i} className={cn('w-1.5 h-1.5 rounded-full', color)} />
                    ))}
                    {dots.length > 4 && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </GradientCard>

      {/* Selected day detail */}
      {selectedDate && (
        <GradientCard className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">{format(selectedDate, 'EEEE, MMMM d')}</h3>
          {selectedActivity ? (
            <div className="grid grid-cols-2 gap-3">
              {selectedActivity.doses > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Syringe size={16} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedActivity.doses}</p>
                    <p className="text-[10px] text-muted-foreground">Doses logged</p>
                  </div>
                </div>
              )}
              {selectedActivity.water && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                    <Droplets size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">✓</p>
                    <p className="text-[10px] text-muted-foreground">Water tracked</p>
                  </div>
                </div>
              )}
              {selectedActivity.meals > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <UtensilsCrossed size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedActivity.meals}</p>
                    <p className="text-[10px] text-muted-foreground">Meals logged</p>
                  </div>
                </div>
              )}
              {selectedActivity.photos > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Camera size={16} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedActivity.photos}</p>
                    <p className="text-[10px] text-muted-foreground">Photos taken</p>
                  </div>
                </div>
              )}
              {selectedActivity.weight && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Scale size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">✓</p>
                    <p className="text-[10px] text-muted-foreground">Weigh-in</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No activity recorded on this day.</p>
          )}
        </GradientCard>
      )}

      {/* Monthly summary */}
      <GradientCard className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Monthly Summary</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{activeDays}</p>
            <p className="text-[10px] text-muted-foreground">Active Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-400">{totalDoses}</p>
            <p className="text-[10px] text-muted-foreground">Total Doses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">{totalMeals}</p>
            <p className="text-[10px] text-muted-foreground">Meals Logged</p>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
