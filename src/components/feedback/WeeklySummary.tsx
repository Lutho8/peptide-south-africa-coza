import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  ArrowUp,
  ArrowDown,
  Award,
  BarChart3,
  Smile,
  Moon,
  Zap,
  Heart,
  Activity,
  Target,
  Utensils,
  Flame,
} from 'lucide-react';
import { FeedbackEntry, MetricType } from '@/lib/feedback/types';
import { getMetricLabel } from '@/lib/feedback/metrics';

interface WeeklySummaryProps {
  feedback: FeedbackEntry[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smile,
  Moon,
  Zap,
  Heart,
  Activity,
  Target,
  Utensils,
  Flame,
};

const metricIcons: Record<MetricType, React.ComponentType<{ className?: string }>> = {
  mood: Smile,
  sleep: Moon,
  energy: Zap,
  libido: Heart,
  recovery: Activity,
  focus: Target,
  appetite: Utensils,
  pain: Flame,
};

const metricColorMap: Record<MetricType, string> = {
  mood: 'text-amber-500',
  sleep: 'text-indigo-500',
  energy: 'text-yellow-500',
  libido: 'text-rose-500',
  recovery: 'text-emerald-500',
  focus: 'text-cyan-500',
  appetite: 'text-orange-500',
  pain: 'text-red-500',
};

const metricBgMap: Record<MetricType, string> = {
  mood: 'bg-amber-50',
  sleep: 'bg-indigo-50',
  energy: 'bg-yellow-50',
  libido: 'bg-rose-50',
  recovery: 'bg-emerald-50',
  focus: 'bg-cyan-50',
  appetite: 'bg-orange-50',
  pain: 'bg-red-50',
};

interface MetricSummary {
  metric: MetricType;
  currentAvg: number;
  previousAvg: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  sparkline: { day: string; value: number }[];
  bestDay: string;
  worstDay: string;
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function getDayName(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ feedback }) => {
  const summary = useMemo(() => {
    if (feedback.length === 0) return null;

    const now = new Date();
    const currentWeekKey = getWeekKey(now);
    const prevWeekDate = new Date(now);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    const previousWeekKey = getWeekKey(prevWeekDate);

    const metrics: MetricType[] = ['mood', 'sleep', 'energy', 'libido', 'recovery', 'focus'];

    return metrics.map((metric): MetricSummary => {
      // Current week entries
      const currentEntries = feedback.filter(
        (f) => getWeekKey(new Date(f.timestamp)) === currentWeekKey
      );
      // Previous week entries
      const previousEntries = feedback.filter(
        (f) => getWeekKey(new Date(f.timestamp)) === previousWeekKey
      );

      const currentValues = currentEntries
        .map((e) => e.metrics[metric])
        .filter((v) => v !== undefined);
      const previousValues = previousEntries
        .map((e) => e.metrics[metric])
        .filter((v) => v !== undefined);

      const currentAvg =
        currentValues.length > 0
          ? currentValues.reduce((a, b) => a + b, 0) / currentValues.length
          : 0;
      const previousAvg =
        previousValues.length > 0
          ? previousValues.reduce((a, b) => a + b, 0) / previousValues.length
          : 0;

      const change = currentAvg - previousAvg;
      const changePercent = previousAvg > 0 ? (change / previousAvg) * 100 : 0;
      const trend: MetricSummary['trend'] =
        change > 0.3 ? 'up' : change < -0.3 ? 'down' : 'stable';

      // Sparkline data for current week
      const sparkline = currentEntries
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .map((e) => ({
          day: getDayName(e.timestamp),
          value: e.metrics[metric] ?? 0,
        }));

      // Best/worst day
      let bestDay = '-';
      let worstDay = '-';
      if (currentEntries.length > 0) {
        const sorted = [...currentEntries].sort(
          (a, b) => (a.metrics[metric] ?? 0) - (b.metrics[metric] ?? 0)
        );
        bestDay = getDayName(sorted[sorted.length - 1].timestamp);
        worstDay = getDayName(sorted[0].timestamp);
      }

      return { metric, currentAvg, previousAvg, change, changePercent, trend, sparkline, bestDay, worstDay };
    });
  }, [feedback]);

  if (!summary || feedback.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Log feedback entries to see your weekly summary</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Overall best metric
  const bestMetric = [...summary].sort((a, b) => b.currentAvg - a.currentAvg)[0];

  // Get current week range
  const weekStart = new Date();
  const dayOfWeek = weekStart.getDay();
  const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  weekStart.setDate(diff);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">{weekRange}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Weekly Summary</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {feedback.length} entries logged this period
              </p>
            </div>
            {bestMetric && (
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Top Metric</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {getMetricLabel(bestMetric.metric)}
                </span>
                <div className="flex items-center gap-1 justify-end">
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">
                    {bestMetric.currentAvg.toFixed(1)}/10
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {summary.map((s, index) => {
          const Icon = metricIcons[s.metric];
          const colorClass = metricColorMap[s.metric];
          const bgClass = metricBgMap[s.metric];

          return (
            <motion.div
              key={s.metric}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('p-1.5 rounded-lg', bgClass)}>
                        <Icon className={cn('h-4 w-4', colorClass)} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {getMetricLabel(s.metric)}
                      </span>
                    </div>
                    <TrendBadge trend={s.trend} changePercent={s.changePercent} />
                  </div>

                  {/* Score */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={cn('text-2xl font-bold', colorClass)}>
                      {s.currentAvg > 0 ? s.currentAvg.toFixed(1) : '-'}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 10</span>
                  </div>

                  {/* Sparkline */}
                  {s.sparkline.length > 1 && (
                    <div className="h-[40px] mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={s.sparkline}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={
                              s.trend === 'up'
                                ? '#10b981'
                                : s.trend === 'down'
                                  ? '#ef4444'
                                  : '#6b7280'
                            }
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Best/worst day */}
                  {s.currentAvg > 0 && (
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
                      <span>Best: <span className="font-medium text-emerald-600">{s.bestDay}</span></span>
                      <span>Worst: <span className="font-medium text-red-500">{s.worstDay}</span></span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const TrendBadge: React.FC<{ trend: MetricSummary['trend']; changePercent: number }> = ({
  trend,
  changePercent,
}) => {
  if (trend === 'up') {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] gap-1">
        <ArrowUp className="h-3 w-3" />
        {changePercent > 0 ? `${changePercent.toFixed(0)}%` : '↑'}
      </Badge>
    );
  }
  if (trend === 'down') {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 text-[10px] gap-1">
        <ArrowDown className="h-3 w-3" />
        {changePercent !== 0 ? `${Math.abs(changePercent).toFixed(0)}%` : '↓'}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 text-[10px] gap-1">
      <Minus className="h-3 w-3" />
      flat
    </Badge>
  );
};

WeeklySummary.displayName = 'WeeklySummary';
