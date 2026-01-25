import { useMemo, useState } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { DailyDoseEntry } from '@/hooks/useDailyDoses';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { peptides } from '@/data/peptides';
import { TrendingUp, Calendar, Target, FlaskConical, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DoseSummaryProps {
  doses: DailyDoseEntry[];
  currentDate: Date;
}

interface PeptideStat {
  peptideId: string;
  peptideName: string;
  totalDoses: number;
  totalAmount: number;
  unit: string;
  daysUsed: number;
  adherenceRate: number;
}

export function DoseSummary({ doses, currentDate }: DoseSummaryProps) {
  const [view, setView] = useState<'week' | 'month'>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatsForPeriod = useMemo(() => {
    const start = view === 'week' ? weekStart : monthStart;
    const end = view === 'week' ? weekEnd : monthEnd;
    const daysInPeriod = view === 'week' ? weekDays : monthDays;

    const periodDoses = doses.filter(d => {
      const doseDate = new Date(d.date);
      return isWithinInterval(doseDate, { start, end });
    });

    // Group by peptide
    const peptideGroups: Record<string, DailyDoseEntry[]> = {};
    periodDoses.forEach(dose => {
      if (!peptideGroups[dose.peptide_id]) {
        peptideGroups[dose.peptide_id] = [];
      }
      peptideGroups[dose.peptide_id].push(dose);
    });

    // Calculate stats per peptide
    const stats: PeptideStat[] = Object.entries(peptideGroups).map(([peptideId, doseList]) => {
      const peptide = peptides.find(p => p.id === peptideId);
      const uniqueDays = new Set(doseList.map(d => d.date)).size;
      
      // Calculate expected doses based on peptide frequency
      let expectedDosesPerWeek = 7; // Default to daily
      if (peptide?.frequency) {
        if (peptide.frequency.includes('2x')) expectedDosesPerWeek = 2;
        else if (peptide.frequency.includes('3x')) expectedDosesPerWeek = 3;
        else if (peptide.frequency.toLowerCase().includes('weekly')) expectedDosesPerWeek = 1;
      }

      const expectedDoses = view === 'week' 
        ? expectedDosesPerWeek 
        : Math.round(expectedDosesPerWeek * 4.33); // ~4.33 weeks per month

      return {
        peptideId,
        peptideName: doseList[0].peptide_name,
        totalDoses: doseList.length,
        totalAmount: doseList.reduce((sum, d) => sum + d.dose, 0),
        unit: doseList[0].unit,
        daysUsed: uniqueDays,
        adherenceRate: Math.min(100, Math.round((doseList.length / expectedDoses) * 100)),
      };
    });

    return {
      totalDoses: periodDoses.length,
      activeDays: new Set(periodDoses.map(d => d.date)).size,
      totalDaysInPeriod: daysInPeriod.length,
      peptideStats: stats.sort((a, b) => b.totalDoses - a.totalDoses),
    };
  }, [doses, view, weekStart, weekEnd, monthStart, monthEnd]);

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

  const overallAdherence = getStatsForPeriod.peptideStats.length > 0
    ? Math.round(getStatsForPeriod.peptideStats.reduce((sum, s) => sum + s.adherenceRate, 0) / getStatsForPeriod.peptideStats.length)
    : 0;

  return (
    <div className="space-y-4">
      <Tabs value={view} onValueChange={(v) => setView(v as 'week' | 'month')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={view} className="space-y-4 mt-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-2">
            <GradientCard className="text-center p-3">
              <FlaskConical size={18} className="mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{getStatsForPeriod.totalDoses}</p>
              <p className="text-xs text-muted-foreground">Total Doses</p>
            </GradientCard>
            <GradientCard className="text-center p-3">
              <Calendar size={18} className="mx-auto text-emerald-500 mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {getStatsForPeriod.activeDays}/{getStatsForPeriod.totalDaysInPeriod}
              </p>
              <p className="text-xs text-muted-foreground">Active Days</p>
            </GradientCard>
            <GradientCard className="text-center p-3">
              <Target size={18} className="mx-auto text-amber-500 mb-1" />
              <p className="text-2xl font-bold text-foreground">{overallAdherence}%</p>
              <p className="text-xs text-muted-foreground">Adherence</p>
            </GradientCard>
          </div>

          {/* Peptide Breakdown */}
          {getStatsForPeriod.peptideStats.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" />
                Peptide Breakdown
              </h4>
              {getStatsForPeriod.peptideStats.map((stat) => (
                <GradientCard key={stat.peptideId} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-10 rounded-full", getCategoryColor(stat.peptideId))} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{stat.peptideName}</span>
                        <Badge variant="outline" className="text-xs">
                          {stat.totalDoses} dose{stat.totalDoses !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Total: {stat.totalAmount.toFixed(stat.unit === 'mcg' ? 0 : 2)} {stat.unit}
                        </span>
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} className={stat.adherenceRate >= 80 ? 'text-emerald-500' : 'text-amber-500'} />
                          <span className={stat.adherenceRate >= 80 ? 'text-emerald-500' : 'text-amber-500'}>
                            {stat.adherenceRate}% adherence
                          </span>
                        </div>
                      </div>
                      {/* Adherence bar */}
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            stat.adherenceRate >= 80 ? 'bg-emerald-500' : stat.adherenceRate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                          style={{ width: `${Math.min(100, stat.adherenceRate)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </GradientCard>
              ))}
            </div>
          ) : (
            <GradientCard className="text-center py-8">
              <FlaskConical size={32} className="mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground text-sm">
                No doses logged for this {view}
              </p>
            </GradientCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
