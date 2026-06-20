import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

const QUICK_ADD_AMOUNTS = [250, 500, 750];

export function WaterTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayIntake, setTodayIntake] = useState(0);
  const [goal, setGoal] = useState(2500);
  const [weeklyData, setWeeklyData] = useState<{ date: string; amount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');
  const progress = Math.min((todayIntake / goal) * 100, 100);
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Today's intake
      const { data: todayData } = await supabase
        .from('water_intake')
        .select('amount_ml, goal_ml')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (todayData) {
        setTodayIntake(todayData.amount_ml);
        setGoal(todayData.goal_ml);
      }

      // Weekly data
      const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd');
      const { data: weekData } = await supabase
        .from('water_intake')
        .select('date, amount_ml')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .order('date', { ascending: true });

      setWeeklyData(weekData?.map(d => ({ date: d.date, amount: d.amount_ml })) || []);
    } finally {
      setIsLoading(false);
    }
  };

  const addWater = async (amount: number) => {
    if (!user) return;
    const newAmount = Math.max(0, todayIntake + amount);
    setTodayIntake(newAmount);

    const { error } = await supabase
      .from('water_intake')
      .upsert({
        user_id: user.id,
        date: today,
        amount_ml: newAmount,
        goal_ml: goal,
      }, { onConflict: 'user_id,date' });

    if (error) {
      toast({ title: 'Error saving', variant: 'destructive' });
      setTodayIntake(todayIntake); // revert
    } else if (newAmount >= goal && todayIntake < goal) {
      toast({ title: '🎉 Goal reached!', description: 'Great hydration today!' });
    }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const entry = weeklyData.find(d => d.date === date);
    return { day: weekDays[(new Date(date).getDay() + 6) % 7], amount: entry?.amount || 0 };
  });

  const maxWeek = Math.max(...last7.map(d => d.amount), goal);

  return (
    <div className="space-y-6">
      {/* Progress Ring */}
      <GradientCard className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="70" cy="70" r="60" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-5 h-5 text-primary mb-1" />
              <span className="text-2xl font-bold text-foreground">{todayIntake}</span>
              <span className="text-xs text-muted-foreground">/ {goal} ml</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-foreground">Today's Hydration</h3>
            <p className="text-sm text-muted-foreground">
              {progress >= 100 ? '✅ Goal reached!' : `${Math.round(goal - todayIntake)} ml remaining`}
            </p>
            <div className="flex gap-2 flex-wrap">
              {QUICK_ADD_AMOUNTS.map(amt => (
                <Button
                  key={amt}
                  size="sm"
                  variant="outline"
                  onClick={() => addWater(amt)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {amt}ml
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addWater(-250)}
              disabled={todayIntake <= 0}
              className="text-xs text-muted-foreground"
            >
              <Minus className="w-3 h-3 mr-1" />
              Undo 250ml
            </Button>
          </div>
        </div>
      </GradientCard>

      {/* Weekly Bar Chart */}
      <GradientCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-foreground text-sm">Weekly Overview</h4>
        </div>
        <div className="flex items-end gap-2 h-24">
          {last7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-muted rounded-t-sm relative" style={{ height: '80px' }}>
                <motion.div
                  className={`absolute bottom-0 w-full rounded-t-sm ${d.amount >= goal ? 'bg-accent' : 'bg-primary/60'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${maxWeek > 0 ? (d.amount / maxWeek) * 100 : 0}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Goal: {goal}ml/day</span>
        </div>
      </GradientCard>
    </div>
  );
}
