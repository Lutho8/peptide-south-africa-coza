import { useMemo } from 'react';
import { useAdherenceReport } from './useAdherenceReport';
import { useDailyDoses } from './useDailyDoses';
import { useDoseReminders } from './useDoseReminders';
import { format, differenceInDays, parseISO, startOfDay } from 'date-fns';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  category: 'streak' | 'adherence' | 'milestone' | 'dedication';
}

export function useAchievements() {
  const { overall, streak } = useAdherenceReport();
  const { doses } = useDailyDoses();
  const { reminders } = useDoseReminders();

  const achievements = useMemo<Achievement[]>(() => {
    // Calculate unique days with doses
    const uniqueDoseDays = new Set(doses.map(d => d.date));
    const totalDosesLogged = doses.length;
    
    // Calculate first dose date for "journey started" badges
    const firstDoseDate = doses.length > 0 
      ? doses.reduce((earliest, d) => d.date < earliest ? d.date : earliest, doses[0].date)
      : null;
    
    const daysSinceFirstDose = firstDoseDate 
      ? differenceInDays(startOfDay(new Date()), startOfDay(parseISO(firstDoseDate)))
      : 0;

    // Calculate perfect week (7 consecutive days at 100%)
    const perfectWeek = streak >= 7;
    
    // Calculate 30-day milestone
    const monthMilestone = daysSinceFirstDose >= 30;
    
    return [
      // Streak achievements
      {
        id: 'first-streak',
        name: 'First Streak',
        description: 'Maintain 3 consecutive days of 100% adherence',
        icon: '🔥',
        unlocked: streak >= 3,
        progress: Math.min(streak, 3),
        maxProgress: 3,
        category: 'streak',
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Achieve 7-day perfect adherence streak',
        icon: '⚡',
        unlocked: perfectWeek,
        progress: Math.min(streak, 7),
        maxProgress: 7,
        category: 'streak',
      },
      {
        id: 'two-week-titan',
        name: 'Two Week Titan',
        description: 'Achieve 14-day perfect adherence streak',
        icon: '🏆',
        unlocked: streak >= 14,
        progress: Math.min(streak, 14),
        maxProgress: 14,
        category: 'streak',
      },
      {
        id: 'monthly-master',
        name: 'Monthly Master',
        description: 'Achieve 30-day perfect adherence streak',
        icon: '👑',
        unlocked: streak >= 30,
        progress: Math.min(streak, 30),
        maxProgress: 30,
        category: 'streak',
      },
      
      // Adherence achievements
      {
        id: 'perfect-week',
        name: 'Perfect Week',
        description: 'Achieve 100% weekly adherence',
        icon: '💯',
        unlocked: overall.percentage === 100 && overall.expected > 0,
        category: 'adherence',
      },
      {
        id: 'high-achiever',
        name: 'High Achiever',
        description: 'Maintain 80%+ weekly adherence',
        icon: '📈',
        unlocked: overall.percentage >= 80 && overall.expected > 0,
        category: 'adherence',
      },
      {
        id: 'consistency-king',
        name: 'Consistency King',
        description: 'Log doses on 5+ different peptides in a week',
        icon: '🎯',
        unlocked: new Set(doses.slice(-50).map(d => d.peptide_id)).size >= 5,
        category: 'adherence',
      },
      
      // Milestone achievements
      {
        id: 'first-dose',
        name: 'First Steps',
        description: 'Log your first dose',
        icon: '🌱',
        unlocked: totalDosesLogged >= 1,
        category: 'milestone',
      },
      {
        id: 'ten-doses',
        name: 'Getting Serious',
        description: 'Log 10 doses total',
        icon: '💪',
        unlocked: totalDosesLogged >= 10,
        progress: Math.min(totalDosesLogged, 10),
        maxProgress: 10,
        category: 'milestone',
      },
      {
        id: 'fifty-doses',
        name: 'Dedicated',
        description: 'Log 50 doses total',
        icon: '🌟',
        unlocked: totalDosesLogged >= 50,
        progress: Math.min(totalDosesLogged, 50),
        maxProgress: 50,
        category: 'milestone',
      },
      {
        id: 'hundred-doses',
        name: 'Centurion',
        description: 'Log 100 doses total',
        icon: '💎',
        unlocked: totalDosesLogged >= 100,
        progress: Math.min(totalDosesLogged, 100),
        maxProgress: 100,
        category: 'milestone',
      },
      
      // Dedication achievements
      {
        id: 'week-journey',
        name: 'Week One',
        description: 'Use the app for 7 days',
        icon: '📅',
        unlocked: uniqueDoseDays.size >= 7,
        progress: Math.min(uniqueDoseDays.size, 7),
        maxProgress: 7,
        category: 'dedication',
      },
      {
        id: 'month-journey',
        name: 'Month Strong',
        description: 'Use the app for 30 days since first dose',
        icon: '🗓️',
        unlocked: monthMilestone,
        progress: Math.min(daysSinceFirstDose, 30),
        maxProgress: 30,
        category: 'dedication',
      },
      {
        id: 'reminder-pro',
        name: 'Reminder Pro',
        description: 'Set up 3 or more reminders',
        icon: '⏰',
        unlocked: reminders.filter(r => r.enabled).length >= 3,
        progress: Math.min(reminders.filter(r => r.enabled).length, 3),
        maxProgress: 3,
        category: 'dedication',
      },
    ];
  }, [overall, streak, doses, reminders]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    unlockedCount,
    totalCount,
    progressPercentage: Math.round((unlockedCount / totalCount) * 100),
  };
}
