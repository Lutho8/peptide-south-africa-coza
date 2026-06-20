import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown, Minus, Brain, FlaskConical, Calendar } from 'lucide-react';
import { FeedbackEntry, MetricType, CorrelationResult } from '@/lib/feedback/types';
import { getMetricLabel, getMetricColor } from '@/lib/feedback/metrics';
import { calculateAllCorrelations } from '@/lib/feedback/correlation';

interface DoseLog {
  date: string;
  peptide: string;
  amount: number;
}

interface CorrelationViewProps {
  feedback: FeedbackEntry[];
  doseLogs: DoseLog[];
  peptides?: string[];
}

const PEPTIDE_COLORS: Record<string, string> = {
  'BPC-157': '#f59e0b',
  'TB-500': '#8b5cf6',
  'CJC-1295': '#06b6d4',
  'Ipamorelin': '#10b981',
  'GHRP-6': '#f43f5e',
  'Melanotan': '#ec4899',
  'Semaglutide': '#6366f1',
  'Tirzepatide': '#14b8a6',
};

function getPeptideColor(peptide: string): string {
  return PEPTIDE_COLORS[peptide] ?? '#6b7280';
}

interface ChartDataPoint {
  date: string;
  dateLabel: string;
  [key: string]: string | number;
}

export const CorrelationView: React.FC<CorrelationViewProps> = ({
  feedback,
  doseLogs,
  peptides: propPeptides,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('energy');
  const [selectedPeptides, setSelectedPeptides] = useState<string[]>(() => {
    const all = propPeptides ?? [...new Set(doseLogs.map((d) => d.peptide))];
    return all.slice(0, 3);
  });

  // Derive peptides from dose logs if not provided
  const allPeptides = useMemo(() => {
    return propPeptides ?? [...new Set(doseLogs.map((d) => d.peptide))];
  }, [propPeptides, doseLogs]);

  // Calculate correlations
  const correlations = useMemo(() => {
    if (feedback.length < 3) return [];
    return calculateAllCorrelations(
      feedback,
      selectedPeptides.length > 0 ? selectedPeptides : allPeptides,
      doseLogs
    );
  }, [feedback, selectedPeptides, allPeptides, doseLogs]);

  // Filter to selected metric
  const metricCorrelations = useMemo(() => {
    return correlations.filter((c) => c.metric === selectedMetric);
  }, [correlations, selectedMetric]);

  // Build chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    // Get unique dates from feedback
    const dateSet = new Set<string>();
    feedback.forEach((f) => dateSet.add(f.timestamp.split('T')[0]));
    doseLogs.forEach((d) => dateSet.add(d.date.split('T')[0]));
    const sortedDates = [...dateSet].sort();

    return sortedDates.map((date) => {
      const entry = feedback.find((f) => f.timestamp.startsWith(date));
      const dayDoses = doseLogs.filter((d) => d.date.startsWith(date));

      const point: ChartDataPoint = {
        date,
        dateLabel: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        [selectedMetric]: entry?.metrics[selectedMetric] ?? null,
      };

      // Add binary dose indicators for each selected peptide
      for (const peptide of selectedPeptides) {
        const hasDose = dayDoses.some((d) => d.peptide === peptide);
        point[`dose_${peptide}`] = hasDose ? 10 : null;
      }

      return point;
    });
  }, [feedback, doseLogs, selectedMetric, selectedPeptides]);

  // Toggle peptide selection
  const togglePeptide = (peptide: string) => {
    setSelectedPeptides((prev) =>
      prev.includes(peptide) ? prev.filter((p) => p !== peptide) : [...prev, peptide]
    );
  };

  const metricLabel = getMetricLabel(selectedMetric);
  const metricColorClass = getMetricColor(selectedMetric);

  // Extract hex from tailwind class for chart
  const colorMap: Record<MetricType, string> = {
    mood: '#f59e0b',
    sleep: '#6366f1',
    energy: '#eab308',
    libido: '#f43f5e',
    recovery: '#10b981',
    focus: '#06b6d4',
    appetite: '#f97316',
    pain: '#ef4444',
  };

  const hasData = feedback.length >= 3;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Metric selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Metric:</span>
            </div>
            <Select
              value={selectedMetric}
              onValueChange={(v) => setSelectedMetric(v as MetricType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['mood', 'sleep', 'energy', 'libido', 'recovery', 'focus'] as MetricType[]).map(
                  (m) => (
                    <SelectItem key={m} value={m}>
                      {getMetricLabel(m)}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Peptide toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Peptides:</span>
            {allPeptides.map((peptide) => {
              const isActive = selectedPeptides.includes(peptide);
              const color = getPeptideColor(peptide);
              return (
                <button
                  key={peptide}
                  onClick={() => togglePeptide(peptide)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border-2 transition-all',
                    isActive
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:border-muted-foreground/50'
                  )}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {peptide}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {metricLabel} Over Time
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                <Calendar className="h-3 w-3 inline mr-1" />
                {chartData.length} data points across {selectedPeptides.length} peptide
                {selectedPeptides.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 10]}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <ReferenceLine y={5} stroke="var(--border)" strokeDasharray="3 3" />

                {/* Metric line */}
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  name={metricLabel}
                  stroke={colorMap[selectedMetric]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colorMap[selectedMetric] }}
                  connectNulls
                />

                {/* Dose scatter lines (binary 10/null) */}
                {selectedPeptides.map((peptide) => (
                  <Line
                    key={peptide}
                    type="step"
                    dataKey={`dose_${peptide}`}
                    name={`${peptide} dose`}
                    stroke={getPeptideColor(peptide)}
                    strokeWidth={0}
                    dot={{ r: 6, fill: getPeptideColor(peptide), opacity: 0.7 }}
                    legendType="circle"
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              <Brain className="h-8 w-8 mb-2 opacity-30" />
              <p>Log at least 3 feedback entries to see correlations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insight Cards */}
      {hasData && metricCorrelations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription className="text-xs">
              Detected correlations for {metricLabel.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {metricCorrelations.map((corr, i) => (
                  <InsightCard key={`${corr.peptide}-${i}`} result={corr} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const InsightCard: React.FC<{ result: CorrelationResult }> = ({ result }) => {
  const isPositive = result.correlation > 0;
  const isNegative = result.correlation < -0.15;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
      <div
        className={cn(
          'p-1.5 rounded-full shrink-0',
          isPositive
            ? 'bg-emerald-100 text-emerald-600'
            : isNegative
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-500'
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : isNegative ? (
          <TrendingDown className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">{result.peptide}</span>
          <Badge
            variant="outline"
            className={cn(
              'text-[10px]',
              result.confidence === 'high'
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                : result.confidence === 'medium'
                  ? 'border-amber-500 text-amber-600 bg-amber-50'
                  : 'border-gray-300 text-gray-500 bg-gray-50'
            )}
          >
            {result.confidence} confidence
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.insight}</p>
      </div>
    </div>
  );
};

CorrelationView.displayName = 'CorrelationView';
