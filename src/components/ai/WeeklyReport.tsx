import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  Activity,
  Syringe,
  Clock,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

export interface WeeklyReportData {
  weekRange: string;
  adherencePercent: number;
  dosesLogged: number;
  dosesPlanned: number;
  metricTrends: {
    metric: string;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    average: number;
  }[];
  insights: string[];
  suggestions: string[];
  alerts: string[];
  topPeptide?: string;
  weeklyComparison: 'better' | 'worse' | 'same';
}

interface WeeklyReportProps {
  data?: WeeklyReportData;
  isLoading?: boolean;
}

const mockReport: WeeklyReportData = {
  weekRange: 'Jun 9 – Jun 15, 2025',
  adherencePercent: 92,
  dosesLogged: 13,
  dosesPlanned: 14,
  metricTrends: [
    { metric: 'Energy', trend: 'up', changePercent: 18, average: 7.4 },
    { metric: 'Sleep', trend: 'up', changePercent: 12, average: 8.1 },
    { metric: 'Recovery', trend: 'up', changePercent: 8, average: 7.2 },
    { metric: 'Mood', trend: 'stable', changePercent: 2, average: 7.0 },
    { metric: 'Focus', trend: 'down', changePercent: -5, average: 6.2 },
    { metric: 'Libido', trend: 'up', changePercent: 15, average: 6.8 },
  ],
  insights: [
    'Your energy levels peaked on Wednesday and Friday, correlating with CJC-1295 + Ipamorelin dosing days',
    'Sleep quality improved 12% this week, likely from evening dosing schedule',
    'Recovery scores were consistently above 7 after TB-500 administration',
    'You missed 1 dose (Sunday evening) — consider setting a reminder',
  ],
  suggestions: [
    'Consider shifting CJC-1295 to evening (8-9 PM) for deeper sleep enhancement',
    'Add B-complex supplement on injection days to support energy levels',
    'Your focus scores dipped mid-week — try dosing earlier in the day',
    'Increase water intake on TB-500 days to support lymphatic clearance',
  ],
  alerts: [
    'BPC-157 vial expires in 8 days — plan reorder',
  ],
  topPeptide: 'CJC-1295 + Ipamorelin',
  weeklyComparison: 'better',
};

export const WeeklyReport: React.FC<WeeklyReportProps> = ({
  data = mockReport,
  isLoading = false,
}) => {
  const missedDoses = data.dosesPlanned - data.dosesLogged;

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12" />
        <CardContent className="pt-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  AI Weekly Report
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{data.weekRange}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Personalized insights based on your tracking data
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                data.weeklyComparison === 'better'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : data.weeklyComparison === 'worse'
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
              )}
            >
              {data.weeklyComparison === 'better' && <ArrowUp className="h-3 w-3 mr-1" />}
              {data.weeklyComparison === 'worse' && <ArrowDown className="h-3 w-3 mr-1" />}
              {data.weeklyComparison === 'better'
                ? 'Better than last week'
                : data.weeklyComparison === 'worse'
                  ? 'Below last week'
                  : 'Same as last week'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Target}
          label="Adherence"
          value={`${data.adherencePercent}%`}
          subtitle={`${data.dosesLogged}/${data.dosesPlanned} doses`}
          color={data.adherencePercent >= 90 ? 'emerald' : data.adherencePercent >= 70 ? 'amber' : 'red'}
        />
        <MetricCard
          icon={Syringe}
          label="Doses Logged"
          value={String(data.dosesLogged)}
          subtitle={missedDoses > 0 ? `${missedDoses} missed` : 'Perfect week!'}
          color={missedDoses === 0 ? 'emerald' : missedDoses <= 2 ? 'amber' : 'red'}
        />
        <MetricCard
          icon={Activity}
          label="Top Peptide"
          value={data.topPeptide ?? '—'}
          subtitle="Most active this week"
          color="primary"
        />
        <MetricCard
          icon={Zap}
          label="Avg Energy"
          value={`${data.metricTrends.find((m) => m.metric === 'Energy')?.average.toFixed(1) ?? '—'}/10`}
          subtitle="Peak metric this week"
          color="yellow"
        />
      </div>

      {/* Adherence Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Weekly Adherence</span>
            <span className={cn(
              'text-sm font-bold',
              data.adherencePercent >= 90 ? 'text-emerald-600' : data.adherencePercent >= 70 ? 'text-amber-600' : 'text-red-600'
            )}>
              {data.adherencePercent}%
            </span>
          </div>
          <Progress
            value={data.adherencePercent}
            className={cn(
              'h-2.5',
              data.adherencePercent < 70 && '[&>div]:bg-red-500',
              data.adherencePercent >= 70 && data.adherencePercent < 90 && '[&>div]:bg-amber-500'
            )}
          />
          <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
            <span>0%</span>
            <span>Goal: 90%+</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Metric Trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Metric Trends
          </CardTitle>
          <CardDescription className="text-xs">Week-over-week changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.metricTrends.map((metric, i) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{metric.metric}</span>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-foreground">{metric.average.toFixed(1)}</span>
                  <span className={cn(
                    'text-xs font-medium',
                    metric.trend === 'up' ? 'text-emerald-600' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  )}>
                    {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {data.insights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
                >
                  <div className="p-1 rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{insight}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              AI Suggestions
            </CardTitle>
            <CardDescription className="text-xs">
              Personalized recommendations to optimize your protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                  className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                'bg-amber-50 border-amber-200 text-amber-900',
                'dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200'
              )}
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="text-sm">{alert}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ icon: Icon, label, value, subtitle, color }) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    red: { bg: 'bg-red-50', text: 'text-red-500' },
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  };
  const c = colorMap[color] ?? colorMap.primary;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('p-1 rounded-md', c.bg)}>
            <Icon className={cn('h-3.5 w-3.5', c.text)} />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-lg font-bold text-foreground truncate">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

WeeklyReport.displayName = 'WeeklyReport';
